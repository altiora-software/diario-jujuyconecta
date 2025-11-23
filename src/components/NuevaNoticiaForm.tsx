import { useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // ← usá alias @ si ya lo tenés configurado
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import CategorySelect from "@/components/CategorySelect";

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function NuevaNoticiaForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [slug, setSlug] = useState("");
  const [resumen, setResumen] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>(""); // ← ⚠️ string
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "Iniciá sesión primero." });
      setLoading(false);
      return;
    }

    // Imagen (opcional)
    let imagen_url: string | null = null;
    if (file) {
      const filePath = `noticias/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("media").upload(filePath, file);
      if (upErr) {
        toast({ variant: "destructive", title: "Error al subir imagen", description: upErr.message });
        setLoading(false);
        return;
      }
      imagen_url = supabase.storage.from("media").getPublicUrl(filePath).data.publicUrl;
    }

    // Slug final
    const finalSlug = slug.trim() ? slug.trim() : `${toSlug(titulo)}-${Date.now().toString(36)}`;

    // Validación de categoría
    if (!categoriaId) {
      toast({ variant: "destructive", title: "Falta categoría", description: "Seleccioná una categoría." });
      setLoading(false);
      return;
    }

    // Insert borrador
    const { error } = await supabase.from("noticias").insert({
      titulo,
      slug: finalSlug,
      resumen,
      contenido,
      categoria_id: Number(categoriaId), // ← ⚠️ casteo a número
      estado: "borrador",
      owner_id: user.id,
      imagen_url,
    });

    setLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }

    toast({ title: "Borrador creado", description: "La noticia se guardó como borrador." });

    // Reset
    setTitulo("");
    setSlug("");
    setResumen("");
    setContenido("");
    setCategoriaId(undefined);
    setFile(null);

    // Refresco simple (si querés, después lo cambiamos por callback)
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título *</Label>
        <Input
          id="titulo"
          type="text"
          placeholder="Ingresá el título de la noticia"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (opcional)</Label>
        <Input
          id="slug"
          type="text"
          placeholder="se-genera-automaticamente"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="resumen">Resumen</Label>
        <Input
          id="resumen"
          type="text"
          placeholder="Breve resumen de la noticia"
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contenido">Contenido</Label>
        <Textarea
          id="contenido"
          placeholder="Contenido completo de la noticia (HTML o texto)"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={6}
          disabled={loading}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoria">Categoría *</Label>
        <CategorySelect
          value={categoriaId}//siempre string
          onChange={setCategoriaId}     // ← recibe string (id)
          placeholder="Elegí una categoría"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imagen">Imagen</Label>
        <Input
          id="imagen"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={loading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Crear Borrador
      </Button>
    </form>
  );
}
