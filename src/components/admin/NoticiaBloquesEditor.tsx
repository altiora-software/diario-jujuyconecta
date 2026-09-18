"use client"

/* eslint-disable @next/next/no-img-element -- previews support Storage URLs selected at runtime */

import { useRef, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Images,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Type,
  Video,
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
import { Textarea } from "@/components/ui/textarea"
import { uploadNoticiaImage } from "@/lib/noticia-media"
import {
  normalizeNoticiaVideoUrl,
  type ImageBlockItem,
  type NoticiaBloqueEditorItem,
  type NoticiaBloqueTipo,
  type NoticiaVideoProvider,
} from "@/types/noticia-bloques"

type Props = {
  bloques: NoticiaBloqueEditorItem[]
  onChange: (bloques: NoticiaBloqueEditorItem[]) => void
  disabled?: boolean
  onUploadingChange?: (uploading: boolean) => void
}

const blockLabels: Record<NoticiaBloqueTipo, string> = {
  paragraph: "Texto",
  image: "Imagen",
  gallery: "Carrusel",
  video: "Video",
}

function createEmptyImage(): ImageBlockItem {
  return { url: "", alt: "", caption: "" }
}

function createBlock(tipo: NoticiaBloqueTipo, orden: number): NoticiaBloqueEditorItem {
  const base = { editorKey: crypto.randomUUID(), orden }

  switch (tipo) {
    case "paragraph":
      return { ...base, tipo, contenido: { text: "" } }
    case "image":
      return { ...base, tipo, contenido: createEmptyImage() }
    case "gallery":
      return {
        ...base,
        tipo,
        contenido: { images: [createEmptyImage(), createEmptyImage()] },
      }
    case "video":
      return { ...base, tipo, contenido: { provider: "youtube", url: "" } }
  }
}

function reindex(bloques: NoticiaBloqueEditorItem[]) {
  return bloques.map((bloque, orden) => ({ ...bloque, orden }))
}

type ImageEditorProps = {
  id: string
  image: ImageBlockItem
  onChange: (image: ImageBlockItem) => void
  onRemove?: () => void
  disabled: boolean
  onUploadingChange: (uploading: boolean) => void
}

function BlockImageEditor({
  id,
  image,
  onChange,
  onRemove,
  disabled,
  onUploadingChange,
}: ImageEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const upload = async (file: File | null) => {
    if (!file) return

    setUploadError(null)
    setUploading(true)
    onUploadingChange(true)

    try {
      const url = await uploadNoticiaImage(file)
      onChange({ ...image, url })
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "No se pudo subir la imagen."
      )
    } finally {
      setUploading(false)
      onUploadingChange(false)
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-white/10 bg-black/10 p-3">
      {image.url && (
        <div className="overflow-hidden rounded-md border border-white/10 bg-slate-950">
          <img
            src={image.url}
            alt={image.alt}
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={`${id}-file`} className="text-xs font-semibold">
          {image.url ? "Reemplazar imagen" : "Subir imagen"}
        </Label>
        <Input
          id={`${id}-file`}
          type="file"
          accept="image/*"
          disabled={disabled || uploading}
          onChange={(event) => {
            void upload(event.target.files?.[0] ?? null)
            event.target.value = ""
          }}
        />
        {uploading && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subiendo imagen…
          </p>
        )}
        {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-alt`} className="text-xs font-semibold">
          Texto alternativo
        </Label>
        <Input
          id={`${id}-alt`}
          value={image.alt}
          disabled={disabled}
          onChange={(event) => onChange({ ...image, alt: event.target.value })}
          placeholder="Descripción accesible"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-caption`} className="text-xs font-semibold">
          Epígrafe opcional
        </Label>
        <Input
          id={`${id}-caption`}
          value={image.caption ?? ""}
          disabled={disabled}
          onChange={(event) => onChange({ ...image, caption: event.target.value })}
          placeholder="Epígrafe"
        />
      </div>

      {onRemove && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled || uploading}
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" /> Quitar imagen
        </Button>
      )}
    </div>
  )
}

export default function NoticiaBloquesEditor({
  bloques,
  onChange,
  disabled = false,
  onUploadingChange,
}: Props) {
  const [uploadingFields, setUploadingFields] = useState<Set<string>>(new Set())
  const uploadingFieldsRef = useRef<Set<string>>(new Set())

  const updateBlock = (
    editorKey: string,
    update: (bloque: NoticiaBloqueEditorItem) => NoticiaBloqueEditorItem
  ) => {
    onChange(
      bloques.map((bloque) =>
        bloque.editorKey === editorKey ? update(bloque) : bloque
      )
    )
  }

  const setFieldUploading = (fieldKey: string, uploading: boolean) => {
    const next = new Set(uploadingFieldsRef.current)
    if (uploading) next.add(fieldKey)
    else next.delete(fieldKey)
    uploadingFieldsRef.current = next
    setUploadingFields(next)
    onUploadingChange?.(next.size > 0)
  }

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= bloques.length) return

    const next = [...bloques]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(reindex(next))
  }

  const remove = (index: number) => {
    onChange(reindex(bloques.filter((_, current) => current !== index)))
  }

  const add = (tipo: NoticiaBloqueTipo) => {
    onChange([...bloques, createBlock(tipo, bloques.length)])
  }

  const controlsDisabled = disabled || uploadingFields.size > 0

  return (
    <section className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="space-y-1">
        <h2 className="text-sm font-black uppercase tracking-widest">Contenido por bloques</h2>
        <p className="text-xs text-muted-foreground">
          Se mostrará en el sitio cuando se habilite el renderer público. El contenido
          clásico se conserva como fallback.
        </p>
      </div>

      {bloques.length === 0 && (
        <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Todavía no agregaste bloques.
        </div>
      )}

      <div className="space-y-4">
        {bloques.map((bloque, index) => (
          <article
            key={bloque.editorKey}
            className="space-y-4 rounded-xl border bg-background/60 p-4 shadow-sm"
          >
            <header className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary">
                  {blockLabels[bloque.tipo]}
                </p>
                <p className="text-xs text-muted-foreground">Bloque {index + 1}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Subir bloque"
                  disabled={controlsDisabled || index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  aria-label="Bajar bloque"
                  disabled={controlsDisabled || index === bloques.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  aria-label="Eliminar bloque"
                  disabled={controlsDisabled}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </header>

            {bloque.tipo === "paragraph" && (
              <Textarea
                rows={6}
                value={bloque.contenido.text}
                disabled={controlsDisabled}
                placeholder="Contenido del párrafo"
                onChange={(event) =>
                  updateBlock(bloque.editorKey, (current) =>
                    current.tipo === "paragraph"
                      ? { ...current, contenido: { text: event.target.value } }
                      : current
                  )
                }
              />
            )}

            {bloque.tipo === "image" && (
              <BlockImageEditor
                id={`block-${bloque.editorKey}`}
                image={bloque.contenido}
                disabled={disabled}
                onUploadingChange={(uploading) =>
                  setFieldUploading(bloque.editorKey, uploading)
                }
                onChange={(image) =>
                  updateBlock(bloque.editorKey, (current) =>
                    current.tipo === "image"
                      ? { ...current, contenido: image }
                      : current
                  )
                }
              />
            )}

            {bloque.tipo === "gallery" && (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  {bloque.contenido.images.map((image, imageIndex) => (
                    <BlockImageEditor
                      key={`${bloque.editorKey}-${imageIndex}`}
                      id={`block-${bloque.editorKey}-image-${imageIndex}`}
                      image={image}
                      disabled={controlsDisabled}
                      onUploadingChange={(uploading) =>
                        setFieldUploading(
                          `${bloque.editorKey}-${imageIndex}`,
                          uploading
                        )
                      }
                      onChange={(nextImage) =>
                        updateBlock(bloque.editorKey, (current) => {
                          if (current.tipo !== "gallery") return current
                          const images = [...current.contenido.images]
                          images[imageIndex] = nextImage
                          return { ...current, contenido: { images } }
                        })
                      }
                      onRemove={() =>
                        updateBlock(bloque.editorKey, (current) =>
                          current.tipo === "gallery"
                            ? {
                                ...current,
                                contenido: {
                                  images: current.contenido.images.filter(
                                    (_, currentIndex) => currentIndex !== imageIndex
                                  ),
                                },
                              }
                            : current
                        )
                      }
                    />
                  ))}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={controlsDisabled}
                  onClick={() =>
                    updateBlock(bloque.editorKey, (current) =>
                      current.tipo === "gallery"
                        ? {
                            ...current,
                            contenido: {
                              images: [...current.contenido.images, createEmptyImage()],
                            },
                          }
                        : current
                    )
                  }
                >
                  <Plus className="h-4 w-4" /> Agregar imagen
                </Button>
              </div>
            )}

            {bloque.tipo === "video" && (
              <div className="grid gap-4 md:grid-cols-[180px_1fr]">
                <div className="space-y-2">
                  <Label>Provider</Label>
                  <Select
                    value={bloque.contenido.provider}
                    disabled={disabled}
                    onValueChange={(provider: NoticiaVideoProvider) =>
                      updateBlock(bloque.editorKey, (current) =>
                        current.tipo === "video"
                          ? { ...current, contenido: { ...current.contenido, provider } }
                          : current
                      )
                    }
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`block-${bloque.editorKey}-url`}>URL</Label>
                  <Input
                    id={`block-${bloque.editorKey}-url`}
                    type="url"
                    value={bloque.contenido.url}
                    disabled={disabled}
                    placeholder="https://..."
                    aria-invalid={
                      !!bloque.contenido.url &&
                      !normalizeNoticiaVideoUrl(
                        bloque.contenido.provider,
                        bloque.contenido.url
                      )
                    }
                    onChange={(event) =>
                      updateBlock(bloque.editorKey, (current) =>
                        current.tipo === "video"
                          ? {
                              ...current,
                              contenido: { ...current.contenido, url: event.target.value },
                            }
                          : current
                      )
                    }
                  />
                  {!!bloque.contenido.url &&
                    !normalizeNoticiaVideoUrl(
                      bloque.contenido.provider,
                      bloque.contenido.url
                    ) && (
                      <p className="text-xs text-destructive">
                        Ingresá una URL válida del provider seleccionado. No se acepta
                        código iframe o embed.
                      </p>
                    )}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Button type="button" variant="outline" disabled={controlsDisabled} onClick={() => add("paragraph")}>
          <Type className="h-4 w-4" /> Texto
        </Button>
        <Button type="button" variant="outline" disabled={controlsDisabled} onClick={() => add("image")}>
          <ImagePlus className="h-4 w-4" /> Imagen
        </Button>
        <Button type="button" variant="outline" disabled={controlsDisabled} onClick={() => add("gallery")}>
          <Images className="h-4 w-4" /> Carrusel
        </Button>
        <Button type="button" variant="outline" disabled={controlsDisabled} onClick={() => add("video")}>
          <Video className="h-4 w-4" /> Video
        </Button>
      </div>
    </section>
  )
}
