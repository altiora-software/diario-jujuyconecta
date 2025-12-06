// lib/news-images.ts
import { supabase } from "@/integrations/supabase/client";

export function getCardImageUrl(path: string, variant: "hero" | "secondary" | "small" | "list") {
  if (!path) return "";

  const { width, height } =
    variant === "hero"
      ? { width: 1200, height: 675 }
      : variant === "secondary"
      ? { width: 800, height: 600 }
      : variant === "list"
      ? { width: 320, height: 240 }
      : { width: 640, height: 360 };

  const { data } = supabase.storage.from("media").getPublicUrl(path, {
    transform: {
      width,
      height,
      resize: "cover",
      quality: 70,
    },
  });

  return data.publicUrl;
}
