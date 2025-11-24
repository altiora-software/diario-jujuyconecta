"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  noticiaId: number;
};

type Comentario = {
  id: number;
  contenido: string;
  created_at: string;
};

export default function Comments({ noticiaId }: Props) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [contenido, setContenido] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function fetchComments() {
      const { data, error } = await supabase
        .from("notas_comentarios")
        .select("*")
        .eq("noticia_id", noticiaId)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        toast.error("Error al cargar comentarios.");
      } else {
        setComentarios(data as Comentario[]);
      }

      setLoading(false);
    }

    fetchComments();
    return () => {
      mounted = false;
    };
  }, [noticiaId]);

  async function handleSubmit() {
    if (!contenido.trim()) {
      toast.error("El comentario no puede estar vacío.");
      return;
    }
  
    setSaving(true);
  
    try {
      const { data, error } = await supabase
        .from("notas_comentarios")
        .insert([{ noticia_id: noticiaId, contenido }])
        .select("*")
        .single(); // si esperás un solo objeto
  
      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Error al publicar comentario.");
        return;
      }
  
      // si todo OK, limpiar input y actualizar lista localmente
      setContenido("");
      setComentarios(prev => [data as Comentario, ...prev]);
      toast.success("Comentario publicado.");
    } catch (err: any) {
      console.error("handleSubmit unexpected error:", err);
      toast.error("Error al publicar comentario.");
    } finally {
      setSaving(false); // importante: siempre liberar el estado
    }
  }
  

  return (
    <div className="mt-10 border-t pt-8">
      <h3 className="text-lg font-semibold mb-4">Comentarios</h3>

      {/* Caja para comentar */}
      <div className="flex flex-col gap-2 mb-6">
        <Textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          placeholder="Escribí un comentario..."
        />

        <Button onClick={handleSubmit} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Publicar
        </Button>
      </div>

      {/* Listado */}
      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando comentarios…</p>
      ) : comentarios.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sé el primero en comentar.</p>
      ) : (
        <ul className="space-y-4">
          {comentarios.map((c) => (
            <li key={c.id} className="border rounded-md p-3 bg-muted/30">
              <p className="text-sm">{c.contenido}</p>
              <time className="text-[11px] text-muted-foreground block mt-1">
                {new Date(c.created_at).toLocaleString("es-AR")}
              </time>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
