import type { Json } from "@/integrations/supabase/supabase"
import { supabase } from "@/integrations/supabase/client"
import {
  validateNoticiaBloqueInput,
  type NoticiaBloqueEditorItem,
  type NoticiaBloqueInput,
} from "@/types/noticia-bloques"

type BloquesResult =
  | { data: NoticiaBloqueEditorItem[]; error: null }
  | { data: null; error: string }

export type ReplaceBloquesResult =
  | { error: null }
  | { error: string; restored: boolean }

function createEditorKey() {
  return crypto.randomUUID()
}

export async function loadNoticiaBloques(
  noticiaId: number
): Promise<BloquesResult> {
  const { data, error } = await supabase
    .from("noticia_bloques")
    .select("id,tipo,orden,contenido")
    .eq("noticia_id", noticiaId)
    .order("orden", { ascending: true })

  if (error) return { data: null, error: error.message }

  const bloques: NoticiaBloqueEditorItem[] = []

  for (const row of data ?? []) {
    const parsed = validateNoticiaBloqueInput({
      tipo: row.tipo,
      orden: row.orden,
      contenido: row.contenido,
    })

    if (!parsed.success) {
      return {
        data: null,
        error: `El bloque ${row.orden + 1} guardado no es válido: ${parsed.error}`,
      }
    }

    bloques.push({ ...parsed.data, id: row.id, editorKey: createEditorKey() })
  }

  return { data: bloques, error: null }
}

function prepareBloques(
  bloques: NoticiaBloqueEditorItem[]
): { data: NoticiaBloqueInput[]; error: null } | { data: null; error: string } {
  const prepared: NoticiaBloqueInput[] = []

  for (const [index, bloque] of bloques.entries()) {
    if (bloque.tipo === "paragraph" && !bloque.contenido.text.trim()) {
      return { data: null, error: `El bloque de texto ${index + 1} está vacío.` }
    }

    if (bloque.tipo === "gallery" && bloque.contenido.images.length === 0) {
      return {
        data: null,
        error: `El carrusel ${index + 1} debe contener al menos una imagen.`,
      }
    }

    const parsed = validateNoticiaBloqueInput({
      tipo: bloque.tipo,
      orden: index,
      contenido: bloque.contenido,
    })

    if (!parsed.success) {
      return { data: null, error: `Bloque ${index + 1}: ${parsed.error}` }
    }

    prepared.push(parsed.data)
  }

  return { data: prepared, error: null }
}

export async function replaceNoticiaBloques(
  noticiaId: number,
  bloques: NoticiaBloqueEditorItem[]
): Promise<ReplaceBloquesResult> {
  const prepared = prepareBloques(bloques)
  if (prepared.error !== null) {
    return { error: prepared.error, restored: true }
  }

  const { data: previous, error: snapshotError } = await supabase
    .from("noticia_bloques")
    .select("tipo,orden,contenido,media_url")
    .eq("noticia_id", noticiaId)
    .order("orden", { ascending: true })

  if (snapshotError) return { error: snapshotError.message, restored: true }

  const { error: deleteError } = await supabase
    .from("noticia_bloques")
    .delete()
    .eq("noticia_id", noticiaId)

  if (deleteError) return { error: deleteError.message, restored: true }

  if (prepared.data.length === 0) return { error: null }

  const rows = prepared.data.map((bloque) => ({
    noticia_id: noticiaId,
    tipo: bloque.tipo,
    orden: bloque.orden,
    contenido: bloque.contenido as Json,
  }))
  const { error: insertError } = await supabase
    .from("noticia_bloques")
    .insert(rows)

  if (!insertError) return { error: null }

  if (!previous || previous.length === 0) {
    return { error: insertError.message, restored: true }
  }

  const { error: restoreError } = await supabase.from("noticia_bloques").insert(
    previous.map((bloque) => ({
      noticia_id: noticiaId,
      tipo: bloque.tipo,
      orden: bloque.orden,
      contenido: bloque.contenido,
      media_url: bloque.media_url,
    }))
  )

  return {
    error: insertError.message,
    restored: !restoreError,
  }
}
