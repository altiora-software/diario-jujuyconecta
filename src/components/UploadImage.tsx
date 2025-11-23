// src/components/UploadImage.tsx
import { ChangeEvent, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function UploadImage({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [loading, setLoading] = useState(false);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const name = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("media").upload(`news/${name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) { setLoading(false); alert(error.message); return; }
    const { data: pub } = supabase.storage.from("media").getPublicUrl(data.path);
    onUploaded(pub.publicUrl);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <input type="file" accept="image/*" onChange={onFile} />
      <Button type="button" variant="outline" disabled={loading}>
        {loading ? "Subiendo..." : "Subir"}
      </Button>
    </div>
  );
}
