import { supabase } from "@/integrations/supabase/client"

export async function uploadNoticiaImage(file: File): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-")
  const path = `noticias/${crypto.randomUUID()}-${safeName}`
  const { error } = await supabase.storage.from("media").upload(path, file)

  if (error) throw error

  return supabase.storage.from("media").getPublicUrl(path).data.publicUrl
}
