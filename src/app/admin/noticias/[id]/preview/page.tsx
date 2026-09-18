"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CalendarDays, Loader2, Pencil, Tag } from "lucide-react"

import ArticleBody from "@/components/ArticleBody"
import NoticiaBloquesPreview from "@/components/admin/NoticiaBloquesPreview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { loadNoticiaBloques } from "@/lib/noticia-bloques"
import type { NoticiaBloqueEditorItem } from "@/types/noticia-bloques"

type Role = "admin" | "editor" | "colaborador" | null

type Noticia = {
  id: number
  titulo: string
  resumen: string | null
  contenido: string | null
  categoria_id: number | null
  imagen_url: string | null
  fecha_publicacion: string | null
  created_at: string
  estado: string
  owner_id: string | null
}

export default function AdminNoticiaPreviewPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()

  const id = Number(params.id)
  const [loading, setLoading] = useState(true)
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [categoriaNombre, setCategoriaNombre] = useState<string | null>(null)
  const [canEdit, setCanEdit] = useState(false)
  const [bloques, setBloques] = useState<NoticiaBloqueEditorItem[]>([])

  useEffect(() => {
    if (!id) {
      router.replace("/admin/noticias")
      return
    }

    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const [noticiaResult, profileResult, bloquesResult] = await Promise.all([
        supabase
          .from("noticias")
          .select(
            "id,titulo,resumen,contenido,categoria_id,imagen_url,fecha_publicacion,created_at,estado,owner_id"
          )
          .eq("id", id)
          .single(),
        supabase.from("profiles").select("role").eq("id", user.id).single(),
        loadNoticiaBloques(id),
      ])

      if (noticiaResult.error || !noticiaResult.data) {
        toast({
          variant: "destructive",
          title: "No se pudo abrir la vista previa",
          description: "La noticia no existe o no tenés permiso para verla.",
        })
        router.replace("/admin/noticias")
        return
      }

      const row = noticiaResult.data as Noticia
      const role = (profileResult.data?.role ?? null) as Role

      if (bloquesResult.error !== null) {
        toast({
          variant: "destructive",
          title: "No se pudieron cargar los bloques",
          description: bloquesResult.error,
        })
        router.replace("/admin/noticias")
        return
      }

      setNoticia(row)
      setBloques(bloquesResult.data)
      setCanEdit(
        role === "admin" ||
          role === "editor" ||
          (role === "colaborador" &&
            row.estado === "borrador" &&
            row.owner_id === user.id)
      )

      if (row.categoria_id !== null) {
        const { data: categoria } = await supabase
          .from("categorias")
          .select("nombre")
          .eq("id", row.categoria_id)
          .maybeSingle()

        setCategoriaNombre(categoria?.nombre ?? null)
      }

      setLoading(false)
    })()
  }, [id, router, toast])

  if (loading || !noticia) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const fechaIso = noticia.fecha_publicacion ?? noticia.created_at
  const fecha = new Date(fechaIso).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="outline" onClick={() => router.push("/admin/noticias")}>
            <ArrowLeft className="h-4 w-4" />
            Volver a noticias
          </Button>

          {canEdit && (
            <Button onClick={() => router.push(`/admin/editar/${noticia.id}`)}>
              <Pencil className="h-4 w-4" />
              Editar noticia
            </Button>
          )}
        </div>

        {noticia.estado === "borrador" && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
            Vista previa privada — esta noticia todavía no está publicada.
          </div>
        )}

        <Card className="overflow-hidden shadow-sm">
          {noticia.imagen_url && (
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={noticia.imagen_url}
                alt={noticia.titulo}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <CardContent className="space-y-8 p-6 sm:p-10">
            <header className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={noticia.estado === "publicado" ? "default" : "secondary"}>
                  {noticia.estado === "publicado" ? "Publicada" : "Borrador"}
                </Badge>

                {categoriaNombre && (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    {categoriaNombre}
                  </span>
                )}

                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  {fecha}
                </span>
              </div>

              <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
                {noticia.titulo}
              </h1>

              {noticia.resumen && (
                <p className="border-l-4 border-primary pl-5 text-lg italic text-muted-foreground sm:text-xl">
                  {noticia.resumen}
                </p>
              )}
            </header>

            {bloques.length > 0 ? (
              <NoticiaBloquesPreview bloques={bloques} />
            ) : noticia.contenido ? (
              <ArticleBody content={noticia.contenido} />
            ) : (
              <p className="text-muted-foreground">Esta noticia todavía no tiene contenido.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
