"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Noticia = {
  id: number;
  titulo: string;
  slug: string;
  contenido: string | null;
  resumen: string | null;
  imagen_url: string | null;
  estado: string;
  fecha_publicacion: string | null;
  categoria_id: number | null;
};

export default function EditarNoticiaPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [titulo, setTitulo] = useState("");
  const [resumen, setResumen] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);

      const { data: noticia, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !noticia) {
        toast({
          variant: "destructive",
          title: "Error al cargar",
          description: "No se pudo cargar la noticia.",
        });
        router.replace("/admin");
        return;
      }

      setTitulo(noticia.titulo);
      setResumen(noticia.resumen ?? "");
      setContenido(noticia.contenido ?? "");
      setImagenUrl(noticia.imagen_url ?? "");

      setLoading(false);
    })();
  }, [id, router, toast]);

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("noticias")
      .update({
        titulo,
        resumen,
        contenido,
        imagen_url: imagenUrl || null,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error al guardar",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Cambios guardados",
      description: "La noticia se actualizó correctamente.",
    });

    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 py-10">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Editar Noticia</CardTitle>
            <CardDescription>Modificá el contenido y guardá los cambios</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={guardar} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <label className="font-medium">Título</label>
                <Input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                />
              </div>

              {/* Resumen */}
              <div className="space-y-2">
                <label className="font-medium">Resumen</label>
                <Textarea
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Contenido */}
              <div className="space-y-2">
                <label className="font-medium">Contenido (HTML)</label>
                <Textarea
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                  rows={10}
                  required
                />
              </div>

              {/* Imagen */}
              <div className="space-y-2">
                <label className="font-medium">URL de Imagen</label>
                <Input
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                />
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push("/admin")}
                >
                  Cancelar
                </Button>

                <Button disabled={saving} type="submit">
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
