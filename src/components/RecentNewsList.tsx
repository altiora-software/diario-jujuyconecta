// src/components/RecentNewsList.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type NotaResumida = {
  id: number;
  titulo: string;
  slug: string;
  fecha_publicacion: string | null;
  created_at: string;
};

const MAX_NOTICIAS = 6;

const RecentNewsList = () => {
  const [noticias, setNoticias] = useState<NotaResumida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRecent() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("noticias")
          .select("id, titulo, slug, fecha_publicacion, created_at, estado")
          .eq("estado", "publicado")
          .order("fecha_publicacion", { ascending: false })
          .limit(MAX_NOTICIAS);

        if (error) throw error;

        if (!cancelled && data) {
          setNoticias(
            data.map((n: any) => ({
              id: n.id,
              titulo: n.titulo,
              slug: n.slug,
              fecha_publicacion: n.fecha_publicacion,
              created_at: n.created_at,
            }))
          );
        }
      } catch (e: any) {
        if (!cancelled) {
          console.error("Error cargando noticias recientes:", e);
          setError(e?.message ?? "Error al cargar noticias recientes");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchRecent();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Card className="border border-news-border">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-headline-primary">
          Últimas noticias
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground">
            Cargando noticias recientes…
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {error}
          </p>
        )}

        {!loading && !error && noticias.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay noticias recientes disponibles.
          </p>
        )}

        {!loading && !error && noticias.length > 0 && (
          <ul className="space-y-3">
            {noticias.map((nota) => {
              const fecha = new Date(
                nota.fecha_publicacion || nota.created_at
              ).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });

              return (
                <li key={nota.id}>
                  <Link
                    href={`/nota/${nota.slug}`}
                    className="group block"
                  >
                    <p className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2">
                      {nota.titulo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {fecha}
                    </p>
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
