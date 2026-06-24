"use client"

import { useEffect, useState } from "react"
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
}

export default function AdminNoticiasManager() {
  const router = useRouter()
  const { toast } = useToast()

  const PAGE_SIZE = 10
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

  const fetchNoticias = async () => {
    if (!userReady) return

    setLoading(true)

    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    let query = supabase
      .from("noticias")
      .select("id,titulo,estado,fecha_publicacion,slug,owner_id", {
        count: "exact",
      })
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

    setNoticias((data ?? []) as Noticia[])
    setTotalPages(Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)))
    setLoading(false)
  }

  useEffect(() => {
    if (!userReady) {
      setLoading(false)
      return
    }
    fetchNoticias()
  }, [userReady, page, filterEstado, searchTerm])

  useEffect(() => {
    setPage(1)
  }, [filterEstado, searchTerm])

  const canEdit = (n: Noticia) =>
    userId === n.owner_id || role === "admin" || role === "editor"

  const canPublish = () => role === "admin" || role === "editor"

  const canDelete = (n: Noticia) => userId === n.owner_id || role === "admin"

  const publicar = async (id: number) => {
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titulo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="hidden md:table-cell">Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {noticias.map((n) => (
                    <TableRow key={n.id} id={`noticia-${n.id}`}>
                      <TableCell>{n.titulo}</TableCell>
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
                        {n.estado === "publicado" && n.slug && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(`/nota/${n.slug}`, "_blank")}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

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
