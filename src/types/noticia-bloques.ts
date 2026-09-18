import type { Tables } from "@/integrations/supabase/supabase"

export const NOTICIA_BLOQUE_TIPOS = [
  "paragraph",
  "image",
  "gallery",
  "video",
] as const

export type NoticiaBloqueTipo = (typeof NOTICIA_BLOQUE_TIPOS)[number]

export const NOTICIA_VIDEO_PROVIDERS = [
  "youtube",
  "instagram",
  "tiktok",
] as const

export type NoticiaVideoProvider = (typeof NOTICIA_VIDEO_PROVIDERS)[number]

export type ParagraphBlockContent = {
  text: string
}

export type ImageBlockItem = {
  url: string
  alt: string
  caption?: string
}

export type ImageBlockContent = ImageBlockItem

export type GalleryBlockContent = {
  images: ImageBlockItem[]
}

export type VideoBlockContent = {
  provider: NoticiaVideoProvider
  url: string
}

export type NoticiaBloqueContenidoPorTipo = {
  paragraph: ParagraphBlockContent
  image: ImageBlockContent
  gallery: GalleryBlockContent
  video: VideoBlockContent
}

type NoticiaBloqueBase<Tipo extends NoticiaBloqueTipo> = Omit<
  Tables<"noticia_bloques">,
  "contenido" | "media_url" | "tipo"
> & {
  tipo: Tipo
  contenido: NoticiaBloqueContenidoPorTipo[Tipo]
}

export type ParagraphBlock = NoticiaBloqueBase<"paragraph">
export type ImageBlock = NoticiaBloqueBase<"image">
export type GalleryBlock = NoticiaBloqueBase<"gallery">
export type VideoBlock = NoticiaBloqueBase<"video">

export type NoticiaBloque =
  | ParagraphBlock
  | ImageBlock
  | GalleryBlock
  | VideoBlock

export type NoticiaBloqueInput = {
  [Tipo in NoticiaBloqueTipo]: {
    tipo: Tipo
    orden: number
    contenido: NoticiaBloqueContenidoPorTipo[Tipo]
  }
}[NoticiaBloqueTipo]

export type NoticiaBloqueValidationResult =
  | { success: true; data: NoticiaBloqueInput }
  | { success: false; error: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string"
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false

  try {
    const url = new URL(value)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

function isImageBlockItem(value: unknown): value is ImageBlockItem {
  return (
    isRecord(value) &&
    isHttpUrl(value.url) &&
    typeof value.alt === "string" &&
    isOptionalString(value.caption)
  )
}

export function isNoticiaBloqueTipo(value: unknown): value is NoticiaBloqueTipo {
  return NOTICIA_BLOQUE_TIPOS.some((tipo) => tipo === value)
}

export function isNoticiaVideoProvider(
  value: unknown
): value is NoticiaVideoProvider {
  return NOTICIA_VIDEO_PROVIDERS.some((provider) => provider === value)
}

function providerMatchesHostname(
  provider: NoticiaVideoProvider,
  hostname: string
): boolean {
  const normalizedHostname = hostname.toLowerCase().replace(/^www\./, "")
  const isDomain = (domain: string) =>
    normalizedHostname === domain || normalizedHostname.endsWith(`.${domain}`)

  switch (provider) {
    case "youtube":
      return isDomain("youtube.com") || isDomain("youtu.be")
    case "instagram":
      return isDomain("instagram.com")
    case "tiktok":
      return isDomain("tiktok.com")
  }
}

/**
 * Valida el dominio del provider y devuelve una URL HTTPS canónica, sin
 * credenciales ni fragmento. No acepta HTML de embed.
 */
export function normalizeNoticiaVideoUrl(
  provider: NoticiaVideoProvider,
  value: string
): string | null {
  try {
    const url = new URL(value.trim())

    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password ||
      !providerMatchesHostname(provider, url.hostname)
    ) {
      return null
    }

    url.protocol = "https:"
    url.hostname = url.hostname.toLowerCase()
    url.port = ""
    url.hash = ""

    return url.toString()
  } catch {
    return null
  }
}

export function validateNoticiaBloqueInput(
  value: unknown
): NoticiaBloqueValidationResult {
  if (!isRecord(value) || !isNoticiaBloqueTipo(value.tipo)) {
    return { success: false, error: "Tipo de bloque inválido." }
  }

  if (!Number.isInteger(value.orden) || (value.orden as number) < 0) {
    return { success: false, error: "El orden debe ser un entero no negativo." }
  }

  if (!isRecord(value.contenido)) {
    return { success: false, error: "El contenido debe ser un objeto." }
  }

  const orden = value.orden as number

  switch (value.tipo) {
    case "paragraph":
      if (typeof value.contenido.text !== "string") {
        return { success: false, error: "El párrafo debe incluir texto." }
      }
      return {
        success: true,
        data: { tipo: value.tipo, orden, contenido: { text: value.contenido.text } },
      }

    case "image":
      if (!isImageBlockItem(value.contenido)) {
        return { success: false, error: "Los datos de la imagen son inválidos." }
      }
      return {
        success: true,
        data: { tipo: value.tipo, orden, contenido: value.contenido },
      }

    case "gallery":
      if (
        !Array.isArray(value.contenido.images) ||
        !value.contenido.images.every(isImageBlockItem)
      ) {
        return { success: false, error: "Los datos de la galería son inválidos." }
      }
      return {
        success: true,
        data: {
          tipo: value.tipo,
          orden,
          contenido: { images: value.contenido.images },
        },
      }

    case "video": {
      if (!isNoticiaVideoProvider(value.contenido.provider)) {
        return { success: false, error: "Provider de video inválido." }
      }

      if (typeof value.contenido.url !== "string") {
        return { success: false, error: "La URL del video es inválida." }
      }

      const url = normalizeNoticiaVideoUrl(
        value.contenido.provider,
        value.contenido.url
      )

      if (!url) {
        return { success: false, error: "La URL no corresponde al provider." }
      }

      return {
        success: true,
        data: {
          tipo: value.tipo,
          orden,
          contenido: { provider: value.contenido.provider, url },
        },
      }
    }
  }
}
