"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type NotaResumida = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  created_at: string;
};

const MAX_NOTICIAS = 4;

type Props = {
  categorySlug?: string | null; // si viene, filtramos por esa categoría
};

const RecentNewsList = ({ categorySlug }: Props) => {
  const [noticias, setNoticias] = useState<NotaResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecent() {
      try {
        setLoading(true);
        setError(null);

        if (categorySlug) {
          // 1) obtener id de la categoria por slug
          const { data: catData, error: catErr } = await supabase
            .from("categorias")
            .select("id")
            .eq("slug", categorySlug)
            .limit(1)
            .single();

          if (catErr) throw catErr;

          if (!catData) {
            // si no existe category, fallback a los recientes generales
            const { data, error } = await supabase
              .from("noticias")
              .select("id, titulo, slug, imagen_url, fecha_publicacion, created_at, estado")
              .eq("estado", "publicado")
              .order("fecha_publicacion", { ascending: false })
              .limit(MAX_NOTICIAS);

            if (error) throw error;
            if (!cancelled && data) setNoticias(mapNotas(data));
            return;
          }

          const catId = catData.id;

          const { data, error } = await supabase
            .from("noticias")
            .select("id, titulo, slug, imagen_url, fecha_publicacion, created_at")
            .eq("estado", "publicado")
            .eq("categoria_id", catId)
            .order("fecha_publicacion", { ascending: false })
            .limit(MAX_NOTICIAS);

          if (error) throw error;
          if (!cancelled && data) setNoticias(mapNotas(data));
          return;
        }

        // default: recientes generales
        const { data, error } = await supabase
          .from("noticias")
          .select("id, titulo, slug, imagen_url, fecha_publicacion, created_at, estado")
          .eq("estado", "publicado")
          .order("fecha_publicacion", { ascending: false })
          .limit(MAX_NOTICIAS);

        if (error) throw error;
        if (!cancelled && data) setNoticias(mapNotas(data));
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error al cargar noticias recientes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    function mapNotas(data: any[]) {
      return data.map((n: any) => ({
        id: n.id,
        titulo: n.titulo,
        slug: n.slug,
        imagen_url: n.imagen_url,
        fecha_publicacion: n.fecha_publicacion,
        created_at: n.created_at,
      }));
    }

    fetchRecent();

    return () => {
      cancelled = true;
    };
  }, [categorySlug]);

  return (
    <Card className="bg-white/[0.02] backdrop-blur-md border-white/[0.05] shadow-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          Últimas noticias
        </CardTitle>
      </CardHeader>

      <CardContent>
      {loading && <p className="text-sm text-muted-foreground animate-pulse">Cargando noticias…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        
        {!loading && !error && noticias.length > 0 && (
          <ul className="space-y-2">
            {noticias.map((nota) => {
              const fecha = new Date(nota.fecha_publicacion || nota.created_at).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "short",
              });

              return (
                <li key={nota.id}>
                  <Link href={`/nota/${nota.slug}`} className="group flex gap-3 rounded-xl p-2 hover:bg-white/[0.05] transition-all duration-300 border border-transparent hover:border-primary/20">
                    {nota.imagen_url && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                        <img src={nota.imagen_url} alt={nota.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}

                    <div className="flex flex-col justify-center gap-1">
                      <p className="text-sm font-medium text-slate-200 group-hover:text-primary leading-snug line-clamp-2 transition-colors">
                        {nota.titulo}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary/80">{fecha}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentNewsList;
