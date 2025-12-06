// src/lib/news-images.ts
import { supabase } from "@/integrations/supabase/client";

export type CardVariant = "hero" | "secondary" | "small" | "list";

// Saca el path interno del storage a partir de una URL pública de Supabase
function extractStoragePathFromUrl(url: string): string | null {
  const marker = "/storage/v1/object/public/";
  const index = url.indexOf(marker);
  if (index === -1) return null;

  // Ejemplo devuelto: "media/noticias/archivo.png"
  return url.slice(index + marker.length);
}

/**
 * Devuelve una URL optimizada (thumb) para la noticia según el variant.
 * No modifica el archivo original, solo usa transform de Supabase.
 */
export function getOptimizedNewsImageUrl(
  rawUrl: string | null | undefined,
  variant: CardVariant
): string | null {
  if (!rawUrl) return null;

  // Si no es una URL de Supabase, devolvemos tal cual
  if (!rawUrl.includes("/storage/v1/object/public/")) {
    return rawUrl;
  }

  const path = extractStoragePathFromUrl(rawUrl);
  if (!path) return rawUrl;

  // Tamaños distintos por variant
  const { width, height } =
    variant === "hero"
      ? { width: 1200, height: 675 } // portada grande
      : variant === "secondary"
      ? { width: 800, height: 600 }  // cards medianas
      : variant === "list"
      ? { width: 320, height: 240 }  // listas laterales
      : { width: 640, height: 360 }; // grid normal

  const { data } = supabase.storage.from("media").getPublicUrl(path, {
    transform: {
      width,
      height,
      resize: "cover",
      quality: 70,
      format: "origin",
    },
  });

  return data.publicUrl;
}
