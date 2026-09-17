"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  Eye,
  Loader2,
  Pencil,
  Search,
  Trash2,
} from "lucide-react"
import { toast as sonner } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

type Role = "admin" | "editor" | "colaborador" | null

type Noticia = {
  id: number
  titulo: string
  estado: string
  fecha_publicacion: string | null
  slug: string
  owner_id: string | null
  origen: string | null
  url_origen: string | null
  profile: {
    full_name: string | null
  } | null
}

type CreatorInfo = {
  name: string
  indicator?: "Bot" | "Automático histórico"
  url?: string | null
}

const AUTOMATED_ORIGINS: Record<
  string,
  Pick<CreatorInfo, "name" | "indicator">
> = {
  robot_criterio24: { name: "Criterio24", indicator: "Bot" },
  robot_jujuy_al_momento: { name: "Jujuy al Momento", indicator: "Bot" },
  robot_prensa_jujuy: { name: "Prensa Jujuy", indicator: "Bot" },
  robot_todo_jujuy: { name: "Todo Jujuy", indicator: "Bot" },
  TodoJujuy: { name: "Todo Jujuy", indicator: "Automático histórico" },
  "TodoJujuy Mundial": {
    name: "Todo Jujuy Mundial",
    indicator: "Automático histórico",
  },
}

function getCreatorInfo(noticia: Noticia): CreatorInfo {
  const origin = noticia.origen?.trim()
  const fullName = noticia.profile?.full_name?.trim()

  if (origin === "manual") {
    if (fullName) return { name: fullName }
    if (noticia.owner_id) return { name: "Usuario sin nombre" }
    return { name: "Autor no identificado" }
  }

  if (origin) {
    const knownOrigin = AUTOMATED_ORIGINS[origin]

    return {
      name: knownOrigin?.name ?? origin,
      indicator: knownOrigin?.indicator,
      url: noticia.url_origen,
    }
  }

  if (fullName) return { name: fullName }
  if (noticia.owner_id) return { name: "Usuario sin nombre" }

  return { name: "Autor no identificado" }
}

const PAGE_SIZE = 10

export default function AdminNoticiasManager() {
  const router = useRouter()
  const { toast } = useToast()

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<Role>(null)

  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)

  const [filterEstado, setFilterEstado] = useState("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setUserId(user.id)

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setRole((profile?.role ?? null) as Role)
    })()
  }, [router])

  const userReady = !!userId && !!role

  const fetchNoticias = useCallback(async () => {
    if (!userReady) return

    setLoading(true)

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from("noticias")
      .select(
        "id,titulo,estado,fecha_publicacion,slug,owner_id,origen,url_origen,profile:profiles!noticias_owner_id_fkey(full_name)",
        { count: "exact" }
      )
      .order("created_at", { ascending: false })
      .range(from, to)

    if (!(role === "admin" || role === "editor")) {
      query = query.eq("owner_id", userId!)
    }

    if (filterEstado !== "todos") {
      query = query.eq("estado", filterEstado)
    }

    if (searchTerm) {
      query = query.ilike("titulo", `%${searchTerm}%`)
    }

    const { data, count, error } = await query

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
      setLoading(false)
      return
    }

    setNoticias(data ?? [])
    setTotalPages(Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)))
    setLoading(false)
  }, [filterEstado, page, role, searchTerm, toast, userId, userReady])

  useEffect(() => {
    if (!userReady) {
      setLoading(false)
      return
    }
    fetchNoticias()
  }, [fetchNoticias, userReady])

  useEffect(() => {
    setPage(1)
  }, [filterEstado, searchTerm])

  const canEdit = (n: Noticia) =>
    role === "admin" ||
    role === "editor" ||
    (role === "colaborador" && userId === n.owner_id && n.estado === "borrador")

  const canPublish = () => role === "admin" || role === "editor"

  const canDelete = (n: Noticia) => userId === n.owner_id || role === "admin"

  const publicar = async (id: number) => {
    const { data: noticia, error: contenidoError } = await supabase
      .from("noticias")
      .select("contenido")
      .eq("id", id)
      .single()

    if (contenidoError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: contenidoError.message,
      })
      return
    }

    if (!noticia.contenido?.trim()) {
      toast({
        variant: "destructive",
        title: "Contenido incompleto",
        description: "Completá el contenido de la noticia antes de publicarla.",
      })
      return
    }

    const { data, error } = await supabase
      .from("noticias")
      .update({
        estado: "publicado",
        fecha_publicacion: new Date().toISOString(),
      })
      .eq("id", id)
      .select("slug")
      .single()

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
      return
    }

    setNoticias((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              estado: "publicado",
              fecha_publicacion: new Date().toISOString(),
            }
          : n
      )
    )

    sonner.success("Noticia publicada", {
      action: data?.slug
        ? {
            label: "Ver nota",
            onClick: () => window.open(`/nota/${data.slug}`, "_blank"),
          }
        : undefined,
    })
  }

  const eliminar = async (id: number) => {
    await supabase.from("noticias").delete().eq("id", id)
    setNoticias((prev) => prev.filter((n) => n.id !== id))
    setDeleteId(null)
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/editar/${id}`)
  }

  const getEstadoBadge = (estado: string) =>
    estado === "publicado" ? (
      <Badge className="bg-green-600 text-white">Publicado</Badge>
    ) : (
      <Badge variant="secondary">Borrador</Badge>
    )

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle>Gestion de Noticias</CardTitle>
          <CardDescription>
            {role === "admin" || role === "editor"
              ? "Todas las noticias"
              : "Tus noticias"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por titulo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="borrador">Borradores</SelectItem>
                <SelectItem value="publicado">Publicados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : noticias.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No hay noticias para mostrar
            </div>
          ) : (
            <>
              <TooltipProvider delayDuration={300}>
                <Table className="min-w-[760px] table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[32%]">Titulo</TableHead>
                    <TableHead className="w-[22%]">Creado por</TableHead>
                    <TableHead className="w-[110px]">Estado</TableHead>
                    <TableHead className="hidden w-[110px] md:table-cell">
                      Fecha
                    </TableHead>
                    <TableHead className="w-[152px] text-right">Acciones</TableHead>
                    <TableHead className="w-[52px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {noticias.map((n) => {
                    const creator = getCreatorInfo(n)

                    return (
                      <TableRow key={n.id} id={`noticia-${n.id}`}>
                      <TableCell className="max-w-0">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span
                              tabIndex={0}
                              className="block w-full truncate rounded-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                              {n.titulo}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm whitespace-normal">
                            {n.titulo}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell className="max-w-0">
                        <div className="flex min-w-0 flex-col items-start gap-1">
                          {creator.url ? (
                            <a
                              href={creator.url}
                              target="_blank"
                              rel="noreferrer"
                              className="block max-w-full truncate font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              title={creator.name}
                            >
                              {creator.name}
                            </a>
                          ) : (
                            <span
                              className="block max-w-full truncate font-medium"
                              title={creator.name}
                            >
                              {creator.name}
                            </span>
                          )}
                          {creator.indicator ? (
                            <Badge variant="outline" className="whitespace-nowrap text-[10px]">
                              {creator.indicator}
                            </Badge>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{getEstadoBadge(n.estado)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {n.fecha_publicacion
                          ? new Date(n.fecha_publicacion).toLocaleDateString(
                              "es-AR"
                            )
                          : "--"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          {canEdit(n) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(n.id)}
                              title="Editar noticia"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {n.estado === "borrador" && canPublish() && (
                            <Button size="sm" onClick={() => publicar(n.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete(n) && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteId(n.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {n.estado === "publicado" && n.slug ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`/nota/${n.slug}`, "_blank")}
                            title="Ver noticia publicada"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : n.estado === "borrador" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => router.push(`/admin/noticias/${n.id}/preview`)}
                            title="Vista previa privada"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
                </Table>
              </TooltipProvider>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Pagina {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive"
              onClick={() => deleteId && eliminar(deleteId)}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
