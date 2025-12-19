"use client";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import CategorySelect from "@/components/CategorySelect";
import { useState } from "react";

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

type Noticia = {
  id: number;
  titulo: string;
  estado: string;
  fecha_publicacion: string | null;
  slug: string;
  owner_id: string | null;
};

type DraftNoticia = {
  titulo: string;
  resumen: string;
  contenido: string;
  categoriaId: string;
  imagenFile: File | null;
};

type Props = {
  data: DraftNoticia;
  setData: React.Dispatch<React.SetStateAction<DraftNoticia>>;
  onCreated: (id: number) => void;
};

export default function NuevaNoticiaForm({ data, setData, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { titulo, resumen, contenido, categoriaId, imagenFile } = data;

    if (!titulo || !categoriaId) {
      toast({
        variant: "destructive",
        title: "Campos obligatorios",
        description: "Título y categoría son obligatorios.",
      });
      setLoading(false);
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      toast({
        variant: "destructive",
        title: "No autenticado",
        description: "Iniciá sesión primero.",
      });
      setLoading(false);
      return;
    }

    let imagen_url: string | null = null;
    if (imagenFile) {
      const path = `noticias/${crypto.randomUUID()}-${imagenFile.name}`;
      const { error } = await supabase.storage.from("media").upload(path, imagenFile);
      if (error) {
        toast({
          variant: "destructive",
          title: "Error al subir imagen",
          description: error.message,
        });
        setLoading(false);
        return;
      }
      imagen_url = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
    }

    const finalSlug =
      slug.trim() || `${toSlug(titulo)}-${Date.now().toString(36)}`;

    const { data: inserted, error } = await supabase
      .from("noticias")
      .insert({
        titulo,
        slug: finalSlug,
        resumen,
        contenido,
        categoria_id: Number(categoriaId),
        estado: "borrador",
        owner_id: auth.user.id,
        imagen_url,
      })
      .select("id")
      .single();

    setLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Borrador creado",
      description: "La noticia se guardó como borrador.",
    });

    if (inserted?.id) {
      onCreated(inserted.id);
    }

    setData({
      titulo: "",
      resumen: "",
      contenido: "",
      categoriaId: "",
      imagenFile: null,
    });

    setSlug("");
  };

  return (






    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Título *</Label>
        <Input
          value={data.titulo}
          onChange={(e) =>
            setData((d) => ({ ...d, titulo: e.target.value }))
          }
          disabled={loading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Slug (opcional)</Label>
        <Input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          disabled={loading}
          placeholder="se-genera-automaticamente"
        />
      </div>

      <div className="space-y-2">
        <Label>Resumen</Label>
        <Input
          value={data.resumen}
          onChange={(e) =>
            setData((d) => ({ ...d, resumen: e.target.value }))
          }
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Contenido</Label>
        <Textarea
          rows={6}
          value={data.contenido}
          onChange={(e) =>
            setData((d) => ({ ...d, contenido: e.target.value }))
          }
          disabled={loading}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Categoría *</Label>
        <CategorySelect
          value={data.categoriaId}
          onChange={(v) =>
            setData((d) => ({ ...d, categoriaId: v }))
          }
          placeholder="Elegí una categoría"
        />
      </div>

      <div className="space-y-2">
        <Label>Imagen</Label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setData((d) => ({
              ...d,
              imagenFile: e.target.files?.[0] ?? null,
            }))
          }
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Crear borrador
      </Button>
    </form>
  );
}











