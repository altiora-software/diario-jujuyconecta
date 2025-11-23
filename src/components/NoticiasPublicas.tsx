import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";

type Noticia = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  destacado: boolean;
  categoria_id: number | null;
};

export default function NoticiasPublicas() {
  const [rows, setRows] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setErr(null);

      try {
        console.log("[NP] Fetching noticias…");
        const { data, error } = await supabase
          .from("noticias")
          .select("id,titulo,slug,imagen_url,fecha_publicacion,destacado,categoria_id")
          .eq("estado", "publicado")
          .order("destacado", { ascending: false })
          .order("fecha_publicacion", { ascending: false })
          .limit(20);

        console.log("[NP] result:", { data, error });

        if (cancelled) return;

        if (error) {
          setErr(error.message);
          setRows([]);
          return;
        }

        setRows((data ?? []) as Noticia[]);
      } catch (e: any) {
        if (cancelled) return;
        console.error("[NP] EXCEPTION:", e);
        setErr(e?.message ?? "Error inesperado");
        setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="py-8 text-center text-muted-foreground">Cargando noticias…</div>;
  if (err) return <div className="py-8 text-center text-destructive">Error: {err}</div>;
  if (!rows.length) return <div className="py-8 text-center text-muted-foreground">No hay noticias publicadas aún.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {rows.map((n) => (
        <Link 
          key={n.id} 
          href={`/nota/${n.slug}`}
          className="group"
        >
          <article className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            {n.imagen_url && (
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={n.imagen_url} 
                  alt={n.titulo} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {n.destacado && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full">
                    Destacada
                  </span>
                )}
              </div>
            )}
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {n.titulo}
              </h3>
              {n.fecha_publicacion && (
                <time className="text-sm text-muted-foreground mt-auto">
                  {new Date(n.fecha_publicacion).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                  })}
                </time>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}
