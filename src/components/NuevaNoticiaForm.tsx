"use client";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ImagePlus, Type, Link2, AlignLeft, FileText } from "lucide-react";
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

    const finalSlug = slug.trim() || `${toSlug(titulo)}-${Date.now().toString(36)}`;

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
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }

    toast({ title: "Borrador creado", description: "La noticia se guardó como borrador." });

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

  const inputStyles = "bg-white/5 border-white/10 focus:border-primary/50 text-black transition-all duration-300";
  const labelStyles = "text-[10px] uppercase tracking-widest font-black text-slate-500 flex items-center gap-2 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Título */}
      <div className="space-y-2">
        <Label className={labelStyles}>
          <Type className="h-3 w-3" /> Título de la noticia *
        </Label>
        <Input
          value={data.titulo}
          onChange={(e) => setData((d) => ({ ...d, titulo: e.target.value }))}
          disabled={loading}
          required
          placeholder="Escribe un titular impactante..."
          className={`${inputStyles} text-lg font-bold py-6 italic h-auto`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categoría */}
        <div className="space-y-2 text-black">
          <Label className={labelStyles}>
            <FileText className="h-3 w-3" /> Categoría *
          </Label>
          <CategorySelect
            value={data.categoriaId}
            onChange={(v) => setData((d) => ({ ...d, categoriaId: v }))}
            placeholder="Elegí una sección"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label className={labelStyles}>
            <Link2 className="h-3 w-3" /> URL Personalizada
          </Label>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={loading}
            placeholder="slug-de-la-nota"
            className={inputStyles}
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="space-y-2">
        <Label className={labelStyles}>
          <AlignLeft className="h-3 w-3" /> Bajada / Resumen
        </Label>
        <Input
          value={data.resumen}
          onChange={(e) => setData((d) => ({ ...d, resumen: e.target.value }))}
          disabled={loading}
          placeholder="Un breve resumen para la portada..."
          className={inputStyles}
        />
      </div>

      {/* Contenido */}
      <div className="space-y-2">
        <Label className={labelStyles}>
          <AlignLeft className="h-3 w-3" /> Cuerpo de la noticia
        </Label>
        <Textarea
          rows={8}
          value={data.contenido}
          onChange={(e) => setData((d) => ({ ...d, contenido: e.target.value }))}
          disabled={loading}
          placeholder="Desarrolla la noticia aquí..."
          className={`${inputStyles} resize-none leading-relaxed`}
        />
      </div>

      {/* Imagen */}
      <div className="space-y-2">
        <Label className={labelStyles}>
          <ImagePlus className="h-3 w-3" /> Imagen de portada
        </Label>
        <div className="relative group">
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
            className={`${inputStyles} file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary file:text-black hover:file:bg-primary/80 cursor-pointer`}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest py-6 h-auto transition-all shadow-lg shadow-primary/20" 
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          "Guardar en Redacción"
        )}
      </Button>
    </form>
  );
}