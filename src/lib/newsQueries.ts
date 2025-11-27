import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/supabase"

export type NoticiaDB = Tables<"noticias">
export type CategoriaDB = Tables<"categorias">

export async function getDestacada() {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("estado", "publicado")
    .eq("destacado", true)
    .order("fecha_publicacion", { ascending: false })
    .limit(1)
  return { data: data?.[0] ?? null, error }
}

export async function getRecientes(limit = 9) {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("estado", "publicado")
    .order("fecha_publicacion", { ascending: false })
    .limit(limit)
  return { data, error }
}

export async function getCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .order("nombre", { ascending: true })
  return { data, error }
}


// Añadir a newsQueries.ts

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, slug")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle();

  return { data, error };
}

export async function getNoticiasByCategoriaId(categoria_id: number, limit = 24) {
  const { data, error } = await supabase
    .from("noticias")
    .select("id, titulo, slug, resumen, imagen_url, fecha_publicacion, created_at, categoria_id")
    .eq("estado", "publicado")
    .eq("categoria_id", categoria_id)
    .order("fecha_publicacion", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getByCategorySlug(slug: string, limit = 24) {
  const cat = await getCategoryBySlug(slug);
  if (cat.error) return { data: null, error: cat.error };
  if (!cat.data) return { data: [], error: null }; // categoría no encontrada -> vacío
  return await getNoticiasByCategoriaId(cat.data.id, limit);
}
