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
