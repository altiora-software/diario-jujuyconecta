"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import NoticiaEditorForm from "@/components/admin/NoticiaEditorForm"
import NoticiaPreview from "@/components/NoticiaPreview"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type {
  NoticiaEditorCategoria,
  NoticiaEditorValues,
} from "@/types/noticia-editor"

type Role = "admin" | "editor" | "colaborador" | null

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export default function EditarNoticiaPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { toast } = useToast()

  const id = Number(params.id)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [categorias, setCategorias] = useState<NoticiaEditorCategoria[]>([])
  const [slugOriginal, setSlugOriginal] = useState("")
  const [estado, setEstado] = useState("")
  const [values, setValues] = useState<NoticiaEditorValues>({
    titulo: "",
    resumen: "",
    contenido: "",
    categoria_id: null,
    slug: "",
    imagen_url: null,
    destacado: false,
  })

  useEffect(() => {
    if (!id) return

    (async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const [noticiaResult, profileResult, categoriasResult] = await Promise.all([
        supabase.from("noticias").select("*").eq("id", id).single(),
        supabase.from("profiles").select("role").eq("id", user.id).single(),
        supabase
          .from("categorias")
          .select("id, nombre, slug")
          .order("nombre", { ascending: true }),
      ])

      if (noticiaResult.error || !noticiaResult.data) {
        toast({
          variant: "destructive",
          title: "Error al cargar",
          description: "No se pudo cargar la noticia.",
        })
        router.replace("/admin/noticias")
        return
      }

      if (profileResult.error) {
        toast({
          variant: "destructive",
          title: "No se pudieron validar los permisos",
          description: "Volvé a intentarlo o contactá a un administrador.",
        })
        router.replace("/admin/noticias")
        return
      }

      const noticia = noticiaResult.data
      const role = (profileResult.data?.role ?? null) as Role
      const canEdit =
        role === "admin" ||
        role === "editor" ||
        (role === "colaborador" &&
          noticia.owner_id === user.id &&
          noticia.estado === "borrador")

      if (!canEdit) {
        toast({
          variant: "destructive",
          title: "Permiso denegado",
          description: "No tenés permiso para editar esta noticia.",
        })
        router.replace("/admin/noticias")
        return
      }

      if (categoriasResult.error) {
        toast({
          variant: "destructive",
          title: "Error al cargar categorías",
          description: categoriasResult.error.message,
        })
        router.replace("/admin/noticias")
        return
      }

      setValues({
        titulo: noticia.titulo,
        resumen: noticia.resumen ?? "",
        contenido: noticia.contenido ?? "",
        categoria_id: noticia.categoria_id,
        slug: noticia.slug,
        imagen_url: noticia.imagen_url,
        destacado: noticia.destacado,
      })
      setCategorias(categoriasResult.data ?? [])
      setSlugOriginal(noticia.slug)
      setEstado(noticia.estado)
      setLoading(false)
    })()
  }, [id, router, toast])

  const guardar = async () => {
    const slugModificado = values.slug !== slugOriginal
    const slug = slugModificado ? normalizeSlug(values.slug) : slugOriginal

    if (slugModificado && !slug) {
      toast({
        variant: "destructive",
        title: "Slug inválido",
        description: "La URL personalizada no puede quedar vacía.",
      })
      return
    }

    if (estado === "publicado" && !values.contenido.trim()) {
      toast({
        variant: "destructive",
        title: "Contenido obligatorio",
        description: "Una noticia publicada no puede quedar sin contenido.",
      })
      return
    }

    setSaving(true)

    let imagenUrl = values.imagen_url

    if (imageFile) {
      const path = `noticias/${crypto.randomUUID()}-${imageFile.name}`
      const { error } = await supabase.storage.from("media").upload(path, imageFile)

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al subir imagen",
          description: error.message,
        })
        setSaving(false)
        return
      }

      imagenUrl = supabase.storage.from("media").getPublicUrl(path).data.publicUrl
    }

    const { data: updated, error } = await supabase
      .from("noticias")
      .update({
        titulo: values.titulo,
        resumen: values.resumen,
        contenido: values.contenido,
        categoria_id: values.categoria_id,
        slug,
        imagen_url: imagenUrl,
        destacado: values.destacado,
      })
      .eq("id", id)
      .select("id")
      .maybeSingle()

    setSaving(false)

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error.message,
      })
      return
    }

    if (!updated) {
      toast({
        variant: "destructive",
        title: "No se guardaron los cambios",
        description: "La noticia no existe o ya no tenés permiso para editarla.",
      })
      return
    }

    toast({
      title: "Cambios guardados",
      description: "La noticia se actualizó correctamente.",
    })

    router.push("/admin/noticias")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const categoriaNombre =
    categorias.find((categoria) => categoria.id === values.categoria_id)?.nombre ?? null

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Editar Noticia</CardTitle>
              <CardDescription>Modificá el contenido y guardá los cambios</CardDescription>
            </CardHeader>

            <CardContent>
              <NoticiaEditorForm
                mode="edit"
                values={values}
                onChange={setValues}
                onSubmit={guardar}
                onCancel={() => router.push("/admin/noticias")}
                loading={saving}
                categorias={categorias}
                slugEditable
                showDestacado
                imageFile={imageFile}
                onImageFileChange={setImageFile}
              />
            </CardContent>
          </Card>

          <div className="xl:sticky xl:top-24 xl:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Vista previa</CardTitle>
              </CardHeader>
              <CardContent>
                <NoticiaPreview
                  data={{
                    ...values,
                    categoriaNombre,
                    imagenFile: imageFile,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
