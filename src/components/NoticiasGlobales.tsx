import { useEffect, useState } from "react";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const FUNCTION_HEADERS = SUPABASE_ANON_KEY
  ? {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    }
  : {};


type Noticia = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  destacado: boolean;
  categoria_id: number | null;
  source?: string | null;
  original_url?: string | null;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function NoticiasGlobales({
  country = "ar",
  category,
  pageSize = 12,
}: {
  country?: string;
  category?: string | undefined;
  pageSize?: number;
}) {
  const [rows, setRows] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // ✅ Usar la variable de entorno si existe
  const NEWS_PROXY_URL = process.env.VITE_NEWS_PROXY_URL as string | undefined;

  useEffect(() => {
    let cancelled = false;

    async function fetchNoticias() {
      if (!NEWS_PROXY_URL) {
        setErr("Falta configurar VITE_NEWS_PROXY_URL en el frontend");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr(null);

      try {
        const params = new URLSearchParams();
        params.set("pageSize", String(pageSize));
        params.set("language", "es");
        if (country) params.set("country", country);
        if (category) params.set("category", category);

        const urlTop = `${NEWS_PROXY_URL}/top-headlines?${params.toString()}`;
        console.log("[NoticiasGlobales] Fetching from:", urlTop);

        let articles: any[] = [];

        // ---- 1) Intento principal: top-headlines ----
        const resTop = await fetch(urlTop, { headers: buildNewsHeaders() });
        const jsonTop = await resTop.json();
        console.log("[NoticiasGlobales] Response:", jsonTop);

        if (resTop.ok && jsonTop.status === "ok" && (jsonTop.articles?.length ?? 0) > 0) {
          articles = jsonTop.articles;
        } else {
          // ---- 2) Fallback: everything (búsqueda libre) ----
          const p2 = new URLSearchParams();
          p2.set("q", category ?? "argentina OR jujuy OR tecnología");
          p2.set("language", "es");
          p2.set("sortBy", "publishedAt");
          p2.set("pageSize", String(pageSize));

          const urlEv = `${NEWS_PROXY_URL}/everything?${p2.toString()}`;
          console.log("[NoticiasGlobales] Fallback to:", urlEv);

          const resEv = await fetch(urlEv, {headers: buildNewsHeaders()});
          const jsonEv = await resEv.json();
          console.log("[NoticiasGlobales] Fallback response:", jsonEv);

          if (!resEv.ok || jsonEv.status !== "ok") {
            throw new Error(jsonEv?.message || `HTTP ${resEv.status}`);
          }
          articles = jsonEv.articles || [];
        }

        // ---- Mapear noticias ----
        const mapped = (articles || []).map((a: any, i: number) => ({
          id: i,
          titulo: a.title || "Sin título",
          slug:
            slugify(a.title || "sin-titulo") +
            (a.publishedAt
              ? "-" + new Date(a.publishedAt).getTime()
              : `-${i}`),
          imagen_url: a.urlToImage ?? null,
          fecha_publicacion: a.publishedAt ?? null,
          destacado: false,
          categoria_id: null,
          source: a.source?.name ?? null,
          original_url: a.url ?? null,
        }));

        if (!cancelled) setRows(mapped);
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? "Error inesperado");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchNoticias();
    return () => {
      cancelled = true;
    };
  }, [country, category, pageSize]);

  if (loading)
    return <div className="py-8 text-center text-muted-foreground">Cargando noticias…</div>;

  if (err)
    return (
      <div className="py-8 text-center text-destructive">
        Error al cargar noticias: {err}
      </div>
    );

  if (!rows.length)
    return (
      <div className="py-8 text-center text-muted-foreground">
        No hay noticias disponibles (puede que NewsAPI no devuelva resultados).
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {rows.map((n) => (
        <a
          key={n.id}
          href={n.original_url ?? `/nota/${n.slug}`}
          target={n.original_url ? "_blank" : undefined}
          rel={n.original_url ? "noopener noreferrer" : undefined}
          className="group"
        >
          <article className="bg-card border border-border rounded-lg overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            {n.imagen_url ? (
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={n.imagen_url}
                  alt={n.titulo}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gray-100 flex items-center justify-center text-muted-foreground">
                Sin imagen
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {n.titulo}
              </h3>
              {n.source && (
                <div className="text-xs text-muted-foreground mb-2">
                  {n.source}
                </div>
              )}
              {n.fecha_publicacion && (
                <time className="text-sm text-muted-foreground mt-auto">
                  {new Date(n.fecha_publicacion).toLocaleDateString("es-AR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              )}
            </div>
          </article>
        </a>
      ))}
    </div>
  );
}
function buildNewsHeaders(): HeadersInit | undefined {
  throw new Error("Function not implemented.");
}

