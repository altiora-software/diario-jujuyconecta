export type NoticiaEditorMode = "create" | "edit"

export type NoticiaEditorValues = {
  titulo: string
  resumen: string
  contenido: string
  categoria_id: number | null
  slug: string
  imagen_url: string | null
  destacado: boolean
}

export type NoticiaEditorCategoria = {
  id: number
  nombre: string
  slug?: string
}
