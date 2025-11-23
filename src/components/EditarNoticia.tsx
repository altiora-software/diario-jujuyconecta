"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import CategorySelect from "@/components/CategorySelect";
import { Loader2, Lock } from "lucide-react";
import { toast as sonner } from "sonner";
import ArticleBody from "@/components/ArticleBody";
import AutoTextarea from "@/components/AutoTextarea";
import UploadImage from "@/components/UploadImage";

type Role = "admin" | "editor" | "colaborador" | null;

export default function EditarNoticiaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState<Role>(null);

  const [titulo, setTitulo] = useState("");
  const [resumen, setResumen] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoriaId, setCategoriaId] = useState<string>("");
  const [slug, setSlug] = useState("");
  const [estado, setEstado] = useState<"borrador" | "publicado">("borrador");
  const [imagenUrl, setImagenUrl] = useState<string>("");

  const isPublished = estado === "publicado";

  useEffect(() => {
    (async () => {
      if (!id) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole((prof?.role ?? null) as Role);

      const { data, error } = await supabase
        .from("noticias")
        .select(
          "id,titulo,resumen,contenido,categoria_id,slug,estado,imagen_url,created_at,fecha_publicacion"
        )
        .eq("id", Number(id))
        .single();

      if (error || !data) {
        toast({
          variant: "destructive",
          title: "No encontrada",
          description: error?.message || "La noticia no existe.",
        });
        router.push("/admin");
        return;
      }

      setTitulo(data.titulo || "");
      setResumen(data.resumen || "");
      setContenido(data.contenido || "");
      setCategoriaId(data.categoria_id ? String(data.categoria_id) : "");
      setSlug(data.slug || "");
      setEstado(data.estado as "publicado" | "borrador");
      setImagenUrl(data.imagen_url || "");
      setLoading(false);
    })();
  }, [id, router, toast]);

  const canEditPublished = role === "admin" || role === "editor";
  const isFormDisabled = isPublished && !canEditPublished;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!titulo.trim()) {
      toast({
        variant: "destructive",
        title: "Falta título",
        description: "El título es obligatorio.",
      });
      return;
    }
    if (!categoriaId) {
      toast({
        variant: "destructive",
        title: "Falta categoría",
        description: "Seleccioná una categoría.",
      });
      return;
    }
    if (isFormDisabled) {
      toast({
        variant: "destructive",
        title: "Permiso denegado",
        description: "No podés editar una noticia publicada.",
      });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("noticias")
      .update({
        titulo,
        resumen: resumen || null,
        contenido: contenido || null,
        categoria_id: Number(categoriaId),
        imagen_url: imagenUrl || null,
        ...(canEditPublished ? { slug } : {}),
      })
      .eq("id", Number(id));

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error.message,
      });
      return;
    }

    sonner.success("Cambios guardados", {
      description: "La noticia fue actualizada.",
      duration: 2500,
    });

    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Editar noticia</h1>
        {isFormDisabled && (
          <div className="inline-flex items-center text-sm text-muted-foreground gap-1">
            <Lock className="w-4 h-4" /> Publicada (solo editores/admin)
          </div>
        )}
      </div>

      {/* Grid: formulario izquierda, vista previa derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Columna izquierda: FORM */}
        <form
          onSubmit={onSubmit}
          className="grid gap-2 [&>div]:gap-1 [&>div]:space-y-0 [&_label]:text-[13px] [&_label]:font-medium"
        >
          <div className="grid gap-1">
            <Label>Título</Label>
            <AutoTextarea
              minRows={2}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              disabled={isFormDisabled}
              className="text-lg"
              placeholder="Escribí un título claro y descriptivo"
            />
          </div>

          <div className="grid gap-1">
            <Label>Resumen</Label>
            <AutoTextarea
              minRows={3}
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              disabled={isFormDisabled}
              placeholder="Breve copete/entradilla de la noticia"
            />
          </div>

          {/* cambio de imagen */}
          <div className="grid gap-1">
            <Label>Imagen de portada</Label>
            {imagenUrl && (
              <img
                src={imagenUrl}
                alt="Portada"
                className="h-40 w-full object-cover rounded-md border mb-2"
              />
            )}
            <UploadImage onUploaded={(url) => setImagenUrl(url)} />
            <p className="text-xs text-muted-foreground">
              Formatos recomendados: JPG/PNG. Relación 16:9 sugerida. Tamaño ≥
              1200px ancho.
            </p>
          </div>

          <div className="grid gap-1">
            <Label>Contenido</Label>
            <Textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="min-h-[220px] leading-snug"
              disabled={isFormDisabled}
              placeholder="Texto con saltos o Markdown..."
            />
          </div>

          <div className="grid gap-1">
            <Label>Categoría</Label>
            <CategorySelect
              value={categoriaId}
              onChange={setCategoriaId}
              placeholder="Elegí una categoría"
            />
          </div>

          {(role === "admin" || role === "editor") && (
            <div className="grid gap-1.5">
              <Label>Slug (solo editor/admin)</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={isPublished && !canEditPublished}
              />
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving || isFormDisabled}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar cambios
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
            >
              Cancelar
            </Button>
          </div>
        </form>

        {/* Columna derecha: PREVIEW */}
        <aside className="bg-card border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-3">Vista previa</p>

          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {titulo || "Título de ejemplo"}
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              {new Date().toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          {imagenUrl && (
            <figure className="mb-6 rounded-lg overflow-hidden border">
              <img
                src={imagenUrl}
                alt="Portada"
                className="w-full h-auto object-cover"
              />
            </figure>
          )}

          {resumen && (
            <div className="bg-muted/50 border-l-4 border-primary p-4 mb-6 rounded-r-lg">
              <p className="text-base text-foreground/80 leading-relaxed italic">
                {resumen}
              </p>
            </div>
          )}

          <ArticleBody content={contenido} />
        </aside>
      </div>
    </div>
  );
}
