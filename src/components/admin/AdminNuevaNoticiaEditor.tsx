"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast as sonner } from "sonner"

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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export default function AdminNuevaNoticiaEditor() {
  const router = useRouter()
  const { toast } = useToast()

  const [values, setValues] = useState<NoticiaEditorValues>({
    titulo: "",
    resumen: "",
    contenido: "",
    categoria_id: null,
    slug: "",
    imagen_url: null,
    destacado: false,
  })
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [categorias, setCategorias] = useState<NoticiaEditorCategoria[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      const { data: categoriasData, error: categoriasError } = await supabase
        .from("categorias")
        .select("id, nombre, slug")
        .order("nombre", { ascending: true })

      if (categoriasError) {
        console.error("Error cargando categorías:", categoriasError.message)
        setCategorias([])
      } else {
        setCategorias(categoriasData ?? [])
      }
    })()
  }, [router])

  const handleSubmit = async () => {
    setSaving(true)

    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      toast({
        variant: "destructive",
        title: "No autenticado",
        description: "Iniciá sesión primero.",
      })
      setSaving(false)
      return
    }

    let imagenUrl: string | null = null
    if (imagenFile) {
      const path = `noticias/${crypto.randomUUID()}-${imagenFile.name}`
      const { error } = await supabase.storage.from("media").upload(path, imagenFile)

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

    const finalSlug =
      values.slug.trim() || `${toSlug(values.titulo)}-${Date.now().toString(36)}`

    const { data: inserted, error } = await supabase
      .from("noticias")
      .insert({
        titulo: values.titulo,
        slug: finalSlug,
        resumen: values.resumen,
        contenido: values.contenido,
        categoria_id: Number(values.categoria_id),
        estado: "borrador",
        owner_id: auth.user.id,
        imagen_url: imagenUrl,
      })
      .select("id")
      .single()

    setSaving(false)

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message })
      return
    }

    toast({ title: "Borrador creado", description: "La noticia se guardó como borrador." })

    if (inserted?.id) {
      sonner.success("Borrador creado", {
        description: "Ya esta disponible en Noticias",
      })
      router.push("/admin/noticias")
    }

    setValues({
      titulo: "",
      resumen: "",
      contenido: "",
      categoria_id: null,
      slug: "",
      imagen_url: null,
      destacado: false,
    })
    setImagenFile(null)
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Noticia</CardTitle>
            <CardDescription>Redacta y previsualiza</CardDescription>
          </CardHeader>
          <CardContent>
            <NoticiaEditorForm
              mode="create"
              values={values}
              onChange={setValues}
              onSubmit={handleSubmit}
              onCancel={() => router.push("/admin/noticias")}
              loading={saving}
              categorias={categorias}
              slugEditable
              showDestacado={false}
              imageFile={imagenFile}
              onImageFileChange={setImagenFile}
            />
          </CardContent>
        </Card>

        <div className="hidden xl:block xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Vista previa</CardTitle>
            </CardHeader>
            <CardContent>
              <NoticiaPreview data={{ ...values, imagenFile }} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
