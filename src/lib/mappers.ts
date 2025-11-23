import type { Tables } from "@/integrations/supabase/supabase"

export type NoticiaDB = Tables<"noticias">
export type CategoriaDB = Tables<"categorias">

export function mapNoticiaToCard(
  n: NoticiaDB,
  categoriaNombre: string | null
) {
  return {
    id: n.id,
    slug: n.slug,
    titulo: n.titulo,
    imagen_url: n.imagen_url ?? "/placeholder.jpg",
    categoria: categoriaNombre ?? "General",
    fecha: n.fecha_publicacion
      ? new Date(n.fecha_publicacion).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "",
    vistas: undefined, // cuando agreguemos columna 'vistas', usamos n.vistas acá
  }
}
