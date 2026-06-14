import Link from "next/link";
import { CalendarDays, ChevronRight, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
export const dynamic = "force-dynamic"; 
type MundialNewsProps = {
  limit?: number;
};
type NoticiaMundial = {
  id: number;
  titulo: string;
  slug: string;
  resumen: string | null;
  imagen_url: string | null;
  cover_url: string | null;
  fecha_publicacion: string | null;
  created_at: string;
};
const CATEGORY_SLUG = "mundial-2026";
function formatDate(date: string | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
async function getMundialNews(limit: number) {
  const { data: categoria, error: categoryError } = await supabase
    .from("categorias")
    .select("id")
    .eq("slug", CATEGORY_SLUG)
    .maybeSingle();
  if (categoryError) throw categoryError;
  if (!categoria) return [];
  const { data, error } = await supabase
    .from("noticias")
    .select(
      "id, titulo, slug, resumen, imagen_url, cover_url, fecha_publicacion, created_at"
    )
    .eq("estado", "publicado")
    .eq("categoria_id", categoria.id)
    .order("fecha_publicacion", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as NoticiaMundial[];
}
export default async function MundialNews({ limit = 6 }: MundialNewsProps) {
  const noticias = await getMundialNews(limit);
  return (
    <section className="w-full bg-zinc-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
              Mundial 2026
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ultimas noticias
            </h2>
          </div>
      <Link
        href={`/seccion/${CATEGORY_SLUG}`}
        className="hidden items-center gap-1 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200 sm:inline-flex"
      >
        Ver todas
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>

    {noticias.length === 0 ? (
      <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-6 py-12 text-center">
        <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
          <Newspaper className="h-6 w-6 text-emerald-300" />
        </div>
        <h3 className="text-lg font-bold text-zinc-100">
          Todavia no hay noticias del Mundial 2026
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-400">
          Cuando se publiquen notas de esta cobertura, van a aparecer en
          este espacio.
        </p>
      </div>
    ) : (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {noticias.map((noticia) => {
          const imageUrl = noticia.cover_url ?? noticia.imagen_url;
          const dateLabel = formatDate(
            noticia.fecha_publicacion ?? noticia.created_at
          );

          return (
            <Link key={noticia.id} href={`/nota/${noticia.slug}`} className="group block h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20 transition duration-300 group-hover:-translate-y-1 group-hover:border-emerald-400/50 group-hover:bg-zinc-900">
                <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={noticia.titulo}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-zinc-800 to-zinc-950">
                    <Newspaper className="h-10 w-10 text-zinc-600" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                {dateLabel && (
                  <time className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs font-semibold text-zinc-200 backdrop-blur">
                    <CalendarDays className="h-3.5 w-3.5 text-emerald-300" />
                    {dateLabel}
                  </time>
                )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-lg font-bold leading-tight text-zinc-50 transition-colors group-hover:text-emerald-300">
                    {noticia.titulo}
                  </h3>

                  {noticia.resumen && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                      {noticia.resumen}
                    </p>
                  )}

                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-bold text-emerald-300">
                    Leer nota
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </article>
            </Link>
          );
        })}
      </div>
    )}
  </div>
</section>
  );
}
