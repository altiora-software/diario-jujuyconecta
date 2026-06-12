// src/components/UploadImage.tsx
import { ChangeEvent, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Props = {
  onUploaded: (url: string) => void;
  label?: string;
};

export default function UploadImage({
  onUploaded,
  label = "Subir imagen",
}: Props) {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);

    const name = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("media")
      .upload(`news/${name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    const { data: pub } = supabase.storage
      .from("media")
      .getPublicUrl(data.path);

    onUploaded(pub.publicUrl);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        ref={inputRef}
        id="upload-image"
        type="file"
        accept="image/*"
        onChange={onFile}
        className="sr-only"
      />

      <label htmlFor="upload-image">
        <Button
          type="button"
          variant="outline"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
        >
          {loading ? "Subiendo..." : label}
        </Button>
      </label>
    </div>
  );
}
