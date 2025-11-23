// src/components/home/HomeLatest.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { CategoryBadge } from "@/components/ui/CategoryBadge";


type NoticiaLista = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  categoria?: {
    nombre: string;
    slug: string;
  } | null;
};

type HomeLatestProps = {
  title?: string;
  limit?: number;
};

export default function HomeLatest({
  title = "Últimas noticias de Jujuy",
  limit = 9,
}: HomeLatestProps) {
  const [rows, setRows] = useState<NoticiaLista[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLatest() {
      try {
        setLoading(true);
        setErr(null);

        const { data, error } = await supabase
          .from("noticias")
          .select(
            `
            id,
            titulo,
            slug,
            imagen_url,
            fecha_publicacion,
            categoria:categoria_id ( nombre, slug ),
            estado
          `
          )
          .eq("estado", "publicado")
          // acá podrías filtrar por categorías locales si querés
          // .in("categoria_id", [...ids_locales])
          .order("fecha_publicacion", { ascending: false })
          .limit(limit);

        if (error) throw error;
        if (!data || cancelled) return;

        setRows(data as unknown as NoticiaLista[]);
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? "Error al cargar las últimas noticias");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchLatest();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return (
    <section className="container mx-auto px-4 pb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {/* Después podemos linkear a /seccion/jujuy o /noticias */}
      </div>

      {loading && (
        <p className="text-muted-foreground">Cargando últimas noticias…</p>
      )}

      {err && (
        <p className="text-destructive">
          Error al cargar las últimas noticias: {err}
        </p>
      )}

      {!loading && !err && rows.length === 0 && (
        <p className="text-muted-foreground">
          Todavía no hay noticias publicadas.
        </p>
      )}

      {!loading && !err && rows.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {rows.map((n) => (
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
        <div className="mb-2">
          {n.categoria?.nombre && (
            <CategoryBadge
              label={n.categoria.nombre}
              slug={n.categoria.slug}
            />
          )}
        </div>
        <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary">
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
