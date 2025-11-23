// src/components/home/HomeSectionBlock.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { CategoryBadge } from "@/components/ui/CategoryBadge";

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
};

type Noticia = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
};

type Props = {
  categoriaSlug: string;   // ej: "deportes"
  title?: string;          // texto a mostrar arriba
  limit?: number;
};

export default function HomeSectionBlock({
  categoriaSlug,
  title,
  limit = 6,
}: Props) {
  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchSection() {
      try {
        setLoading(true);
        setErr(null);

        const { data: cat, error: catError } = await supabase
          .from("categorias")
          .select("id, nombre, slug")
          .eq("slug", categoriaSlug)
          .maybeSingle();

        if (catError) throw catError;
        if (!cat || cancelled) {
          setCategoria(null);
          setNoticias([]);
          return;
        }

        setCategoria(cat as Categoria);

        const { data: rows, error: newsError } = await supabase
          .from("noticias")
          .select("id, titulo, slug, imagen_url, fecha_publicacion, estado")
          .eq("estado", "publicado")
          .eq("categoria_id", cat.id)
          .order("fecha_publicacion", { ascending: false })
          .limit(limit);

        if (newsError) throw newsError;
        if (cancelled) return;

        setNoticias((rows ?? []) as Noticia[]);
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? "Error al cargar la sección");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSection();
    return () => {
      cancelled = true;
    };
  }, [categoriaSlug, limit]);

  // Si la categoría no existe, no mostramos nada
  if (!loading && !categoria) return null;

  return (
    <section className="container mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">
          {title ?? categoria?.nombre ?? "Sección"}
        </h2>
        {categoria && (
          <Link
            href={`/seccion/${categoria.slug}`}
            className="text-sm text-primary hover:underline"
          >
            Ver más
          </Link>
        )}
      </div>

      {loading && (
        <p className="text-muted-foreground">
          Cargando {title ?? categoriaSlug}…
        </p>
      )}

      {err && (
        <p className="text-destructive">
          Error al cargar la sección: {err}
        </p>
      )}

      {!loading && !err && noticias.length === 0 && (
        <p className="text-muted-foreground">
          Todavía no hay noticias en esta sección.
        </p>
      )}

      {!loading && !err && noticias.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((n) => (
            <Link key={n.id} href={`/nota/${n.slug}`}>
              <article className="bg-card border border-border/70 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-[3px] transition-all duration-200 flex flex-col h-full">
                {n.imagen_url ? (
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={n.imagen_url}
                      alt={n.titulo}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-muted flex items-center justify-center text-xs text-muted-foreground">
                    Sin imagen
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  {categoria && (
                    <div className="mb-2">
                      <CategoryBadge
                        label={categoria.nombre}
                        slug={categoria.slug}
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-base mb-2 line-clamp-2">
                    {n.titulo}
                  </h3>
                  {n.fecha_publicacion && (
                    <time className="mt-auto text-xs text-muted-foreground">
                      {new Date(n.fecha_publicacion).toLocaleDateString("es-AR")}
                    </time>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
