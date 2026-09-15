"use client"

import { useState, type FormEvent } from "react"
import {
  AlignLeft,
  FileText,
  ImagePlus,
  Link2,
  Loader2,
  Star,
  Type,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type {
  NoticiaEditorCategoria,
  NoticiaEditorMode,
  NoticiaEditorValues,
} from "@/types/noticia-editor"

export type NoticiaEditorFormProps = {
  values: NoticiaEditorValues
  onChange: (values: NoticiaEditorValues) => void
  onSubmit: () => void | Promise<void>
  onCancel: () => void
  loading?: boolean
  mode: NoticiaEditorMode
  categorias: NoticiaEditorCategoria[]
  slugEditable?: boolean
  showDestacado?: boolean
}

export default function NoticiaEditorForm({
  values,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  mode,
  categorias,
  slugEditable = true,
  showDestacado = false,
}: NoticiaEditorFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const updateField = <Key extends keyof NoticiaEditorValues>(
    field: Key,
    value: NoticiaEditorValues[Key]
  ) => {
    onChange({ ...values, [field]: value })
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitted(true)

    if (!values.titulo.trim() || values.categoria_id === null) return

    void onSubmit()
  }

  const inputStyles =
    "bg-white/5 border-white/10 focus:border-primary/50 text-black transition-all duration-300"
  const labelStyles =
    "text-[10px] uppercase tracking-widest font-black text-slate-500 flex items-center gap-2 mb-2"
  const primaryLabel = mode === "create" ? "Guardar en Redacción" : "Guardar cambios"

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="noticia-titulo" className={labelStyles}>
          <Type className="h-3 w-3" /> Título de la noticia *
        </Label>
        <Input
          id="noticia-titulo"
          value={values.titulo}
          onChange={(event) => updateField("titulo", event.target.value)}
          disabled={loading}
          aria-invalid={submitted && !values.titulo.trim()}
          aria-describedby="noticia-titulo-error"
          placeholder="Escribe un titular impactante..."
          className={`${inputStyles} h-auto py-6 text-lg font-bold italic`}
        />
        {submitted && !values.titulo.trim() && (
          <p id="noticia-titulo-error" className="text-sm text-destructive">
            El título es obligatorio.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 text-black">
          <Label className={labelStyles}>
            <FileText className="h-3 w-3" /> Categoría *
          </Label>
          <Select
            value={values.categoria_id === null ? undefined : String(values.categoria_id)}
            onValueChange={(value) => updateField("categoria_id", Number(value))}
            disabled={loading || categorias.length === 0}
          >
            <SelectTrigger
              aria-invalid={submitted && values.categoria_id === null}
              aria-describedby="noticia-categoria-error"
              className="w-full border-white/10 bg-white/5 text-slate-200 transition-all duration-300 focus:border-primary/50 focus:ring-primary/20"
            >
              <SelectValue placeholder="Elegí una sección" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a0f1d] text-slate-200 shadow-2xl">
              {categorias.map((categoria) => (
                <SelectItem
                  key={categoria.id}
                  value={String(categoria.id)}
                  className="cursor-pointer py-2 text-[11px] font-bold uppercase tracking-wider transition-colors focus:bg-primary focus:text-black"
                >
                  {categoria.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {submitted && values.categoria_id === null && (
            <p id="noticia-categoria-error" className="text-sm text-destructive">
              La categoría es obligatoria.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="noticia-slug" className={labelStyles}>
            <Link2 className="h-3 w-3" /> URL personalizada
          </Label>
          <Input
            id="noticia-slug"
            value={values.slug}
            onChange={(event) => updateField("slug", event.target.value)}
            disabled={loading || !slugEditable}
            placeholder="slug-de-la-nota"
            className={inputStyles}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="noticia-resumen" className={labelStyles}>
          <AlignLeft className="h-3 w-3" /> Bajada / Resumen
        </Label>
        <Input
          id="noticia-resumen"
          value={values.resumen}
          onChange={(event) => updateField("resumen", event.target.value)}
          disabled={loading}
          placeholder="Un breve resumen para la portada..."
          className={inputStyles}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="noticia-contenido" className={labelStyles}>
          <AlignLeft className="h-3 w-3" /> Cuerpo de la noticia
        </Label>
        <Textarea
          id="noticia-contenido"
          rows={8}
          value={values.contenido}
          onChange={(event) => updateField("contenido", event.target.value)}
          disabled={loading}
          placeholder="Desarrolla la noticia aquí..."
          className={`${inputStyles} resize-none leading-relaxed`}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="noticia-imagen-url" className={labelStyles}>
          <ImagePlus className="h-3 w-3" /> Imagen de portada
        </Label>
        <Input
          id="noticia-imagen-url"
          type="url"
          value={values.imagen_url ?? ""}
          onChange={(event) => updateField("imagen_url", event.target.value || null)}
          disabled={loading}
          placeholder="https://..."
          className={inputStyles}
        />
        {values.imagen_url && (
          <div className="overflow-hidden rounded-md border bg-muted/30">
            <img
              src={values.imagen_url}
              alt={values.titulo ? `Vista previa de ${values.titulo}` : "Vista previa de portada"}
              className="aspect-video w-full object-cover"
            />
          </div>
        )}
      </div>

      {showDestacado && (
        <div className="flex items-center justify-between gap-4 rounded-md border p-4">
          <div className="space-y-1">
            <Label htmlFor="noticia-destacada" className="flex items-center gap-2 font-medium">
              <Star className="h-4 w-4" /> Noticia destacada
            </Label>
            <p className="text-sm text-muted-foreground">
              Prioriza esta noticia en los espacios principales del sitio.
            </p>
          </div>
          <Switch
            id="noticia-destacada"
            checked={values.destacado}
            onCheckedChange={(checked) => updateField("destacado", checked)}
            disabled={loading}
          />
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary font-black uppercase tracking-widest text-black shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? "Guardando..." : primaryLabel}
        </Button>
      </div>
    </form>
  )
}
