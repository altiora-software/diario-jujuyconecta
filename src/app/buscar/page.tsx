"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

type NotaBusqueda = {
  id: number;
  titulo: string;
  slug: string;
  resumen: string | null;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  created_at: string;
};

export default function BuscarPage() {
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();

  const [resultados, setResultados] = useState<NotaBusqueda[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function buscar() {
      if (!q) {
        setResultados([]);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from("noticias")
          .select(
            "id,titulo,slug,resumen,imagen_url,fecha_publicacion,created_at"
          )
          .eq("estado", "publicado")
          .or(`titulo.ilike.%${q}%,resumen.ilike.%${q}%`)
          .order("fecha_publicacion", { ascending: false })
          .limit(50);

        if (error) throw error;
        if (!cancelled) {
          setResultados((data as NotaBusqueda[]) ?? []);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message ?? "Error al buscar noticias");
          setResultados([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    buscar();

    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <header>
        <h1 className="text-2xl font-semibold">
          Buscar noticias
        </h1>
        {q && (
          <p className="text-sm text-muted-foreground mt-1">
            Resultados para{" "}
            <span className="text-primary">&ldquo;{q}&rdquo;</span>
          </p>
        )}
      </header>

      {!q && (
        <p className="text-sm text-muted-foreground">
          Escribí algo en el buscador para encontrar noticias.
        </p>
      )}

      {q && loading && (
        <p className="text-sm text-muted-foreground">
          Buscando noticias…
        </p>
      )}

      {q && !loading && error && (
        <p className="text-sm text-destructive">
          Error al buscar: {error}
        </p>
      )}

      {q && !loading && !error && resultados.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No encontramos noticias que coincidan con esa búsqueda.
        </p>
      )}

      {q && !loading && !error && resultados.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resultados.map((nota) => (
            <Link key={nota.id} href={`/nota/${nota.slug}`}>
              <article className="border rounded-lg overflow-hidden hover:bg-muted/60 transition-colors h-full">
                {nota.imagen_url && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={nota.imagen_url}
                      alt={nota.titulo}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-base font-semibold line-clamp-2">
                    {nota.titulo}
                  </h2>
                  {nota.resumen && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {nota.resumen}
                    </p>
                  )}
                  <time className="text-xs text-muted-foreground mt-auto">
                    {new Date(
                      nota.fecha_publicacion ?? nota.created_at
                    ).toLocaleDateString("es-AR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
