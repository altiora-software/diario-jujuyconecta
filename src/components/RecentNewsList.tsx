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
    <Card className="border border-news-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-headline-primary">
          Últimas noticias
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && <p className="text-sm text-muted-foreground">Cargando noticias…</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && noticias.length === 0 && (
          <p className="text-sm text-muted-foreground">No hay noticias recientes.</p>
        )}

        {!loading && !error && noticias.length > 0 && (
          <ul className="space-y-4">
            {noticias.map((nota) => {
              const fecha = new Date(nota.fecha_publicacion || nota.created_at).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <li key={nota.id}>
                  <Link href={`/nota/${nota.slug}`} className="group flex gap-3 rounded-md p-2 hover:bg-muted/50 transition-colors">
                    {nota.imagen_url && (
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img src={nota.imagen_url} alt={nota.titulo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    )}

                    <div className="flex flex-col justify-between">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2 group-hover:line-clamp-none transition-all">
                        {nota.titulo}
                      </p>
                      <p className="text-xs text-primary font-bold">{fecha}</p>
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
