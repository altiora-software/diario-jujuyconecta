// src/app/seccion/[slug]/page.tsx
/**
 * Página de sección (server)
 *
 * Estrategia:
 * 1) Intentamos servir noticias internas (Supabase) para la categoría `slug`.
 *    - Más preciso para "provinciales" / identidad local.
 * 2) Si no hay categoría interna o no hay noticias internas, hacemos fallback
 *    al proveedor externo (NEWS_PROXY_URL) — tu comportamiento anterior.
 *
 * Beneficio:
 * - Evitamos mezclar noticias globales con locales cuando hay contenido local.
 * - Permitimos mantener el proxy externo para secciones donde no haya material propio.
 *
 * NOTA: No ejecuta updates. Solo lectura. Probá en rama antes de mergear.
 */

import type { Metadata } from "next";
import Link from "next/link";
import SocialSidebar from "@/components/SocialSidebar";
import { Card, CardContent } from "@/components/ui/card";
import RecentNewsList from "@/components/RecentNewsList";

// Helpers para Supabase (los agregaste previamente en newsQueries.ts)
import { getCategoryBySlug, getNoticiasByCategoriaId } from "@/lib/newsQueries";

// Ajustá estos nombres de env a lo que pongas en .env.local
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "";

const FUNCTION_HEADERS =
  SUPABASE_ANON_KEY !== ""
    ? {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    : undefined;

const NEWS_PROXY_URL =
  process.env.NEWS_PROXY_URL ?? process.env.NEXT_PUBLIC_NEWS_PROXY_URL;

type NoticiaExternal = {
  id: string | number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  source?: string | null;
  original_url?: string | null;
};

type NoticiaInternal = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url?: string | null;
  fecha_publicacion?: string | null;
  created_at?: string | null;
  // otros campos que pueda devolver la tabla
};

// Mapeo legacy para el proxy (lo dejé tal cual; sirve como fallback)
const slugifyTitle = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9áéíóúñ]+/g, "-")
    .replace(/^-+|-+$/g, "");

const slugToCategoryMap: Record<string, string> = {
  provinciales: "general",
  nacionales: "general",
  mundo: "general",
  deportes: "sports",
  cultura: "entertainment",
  radio: "technology",
  tecnologia: "technology",
  salud: "health",
  ciencia: "science",
  economia: "business",
};

// Revalidar cada 5 minutos (ajustalo si querés)
export const revalidate = 300;

// OJO: params es un Promise en tu implementación
type PageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * generateMetadata: intenta consultar el nombre de la sección desde la tabla
 * de categorías para tener un title más amigable. Si no existe, usa slug.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  // Intentar recuperar la categoría interna para un mejor título
  try {
    const catRes = await getCategoryBySlug(slug);
    const nombre = catRes?.data?.nombre ?? slug;
    const nombreSeccion = String(nombre).charAt(0).toUpperCase() + String(nombre).slice(1);
    return {
      title: `Noticias de ${nombreSeccion} | Jujuy Conecta Diario`,
      description: `Todas las noticias sobre ${nombreSeccion} actualizadas en Jujuy Conecta Diario.`,
    };
  } catch {
    const nombreSeccion = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
    return {
      title: `Noticias de ${nombreSeccion} | Jujuy Conecta Diario`,
      description: `Todas las noticias sobre ${nombreSeccion} actualizadas en Jujuy Conecta Diario.`,
    };
  }
}

/**
 * fetchNoticiasPorProxy: tu lógica original para obtener noticias del proveedor externo.
 * La dejo intacta (salvo pequeños ajustes) para usar como fallback.
 */
async function fetchNoticiasPorProxy(slug: string): Promise<{ noticias: NoticiaExternal[]; error: string | null }> {
  if (!NEWS_PROXY_URL) {
    return { noticias: [], error: "Falta configurar NEWS_PROXY_URL en el entorno" };
  }

  const normalized = slug.toLowerCase();
  const mappedCategory = slugToCategoryMap[normalized];

  let articles: any[] = [];

  try {
    // 1) Intento principal: top-headlines por categoría del proveedor
    if (mappedCategory) {
      const p1 = new URLSearchParams();
      p1.set("language", "es");
      p1.set("pageSize", "24");
      p1.set("category", mappedCategory);
      p1.set("country", "ar");

      const urlTop = `${NEWS_PROXY_URL}/top-headlines?${p1.toString()}`;
      const resTop = await fetch(urlTop, {
        headers: FUNCTION_HEADERS,
        next: { revalidate: 300 },
      });
      const jsonTop = await resTop.json();

      if (resTop.ok && jsonTop?.status === "ok" && (jsonTop.articles?.length ?? 0) > 0) {
        articles = jsonTop.articles;
      }
    }

    // 2) Fallback: everything por palabra clave
    if (articles.length === 0) {
      const q = normalized || "noticias";
      const p2 = new URLSearchParams();
      p2.set("q", q);
      p2.set("language", "es");
      p2.set("sortBy", "publishedAt");
      p2.set("pageSize", "24");

      const urlEv = `${NEWS_PROXY_URL}/everything?${p2.toString()}`;
      const resEv = await fetch(urlEv, {
        headers: FUNCTION_HEADERS,
        next: { revalidate: 300 },
      });
      const jsonEv = await resEv.json();

      if (!resEv.ok || jsonEv?.status !== "ok") {
        throw new Error(jsonEv?.message || `HTTP ${resEv.status}`);
      }

      articles = jsonEv.articles || [];
    }

    const mapped: NoticiaExternal[] = articles.map((a: any, i: number) => {
      const title = a.title || a.description || "Sin título";
      const publishedAt = a.publishedAt ?? null;
      const slugFromTitle =
        slugifyTitle(title) +
        (publishedAt ? "-" + new Date(publishedAt).getTime() : `-${i}`);

      return {
        id: a.url ?? `${i}-${publishedAt ?? Date.now()}`,
        titulo: title,
        slug: slugFromTitle,
        imagen_url: a.urlToImage ?? null,
        fecha_publicacion: publishedAt,
        source: a.source?.name ?? null,
        original_url: a.url ?? null,
      };
    });

    return { noticias: mapped, error: null };
  } catch (e: any) {
    return { noticias: [], error: e?.message ?? "Error inesperado al cargar noticias" };
  }
}

/**
 * fetchNoticiasInternas: intenta obtener noticias de la tabla `noticias`
 * filtradas por la categoría interna. Usa los helpers que agregaste en newsQueries.ts.
 *
 * Retorna { noticias: mapped[], error } donde mapped tiene la forma que la UI espera.
 */
async function fetchNoticiasInternas(slug: string): Promise<{ noticias: NoticiaInternal[]; error: string | null }> {
  try {
    // 1) Buscar la categoría por slug
    const catRes = await getCategoryBySlug(slug);
    if (catRes.error) return { noticias: [], error: String(catRes.error.message ?? catRes.error) };
    if (!catRes.data) {
      // No existe categoría interna con ese slug
      return { noticias: [], error: null };
    }

    // 2) Obtener noticias por categoria_id
    const noticiasRes = await getNoticiasByCategoriaId(catRes.data.id, 24);
    if (noticiasRes.error) return { noticias: [], error: String(noticiasRes.error.message ?? noticiasRes.error) };
    const rows = (noticiasRes.data ?? []) as any[];

    // Mapear a la forma simple que necesita la UI
    const mapped = rows.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      slug: r.slug,
      imagen_url: r.imagen_url ?? null,
      fecha_publicacion: r.fecha_publicacion ?? r.created_at ?? null,
      // si necesitás más campos (categoria nombre, etc) devolvémelos y los agrego
    }));

    return { noticias: mapped, error: null };
  } catch (e: any) {
    return { noticias: [], error: e?.message ?? "Error al leer noticias internas" };
  }
}

/**
 * Componente de página: combina ambas fuentes.
 *
 * Lógica final:
 * - Si `fetchNoticiasInternas` devuelve noticias (length > 0) → uso esas.
 * - Si no devuelve noticias (length === 0) → llamo a `fetchNoticiasPorProxy` y uso el resultado.
 *
 * Esto evita que se mezclen globales en secciones donde sí hay contenido local.
 */
export default async function SeccionPage({ params }: PageProps) {
  const { slug } = await params;

  // 1) Intentar noticias internas primero
  const internas = await fetchNoticiasInternas(slug);

  if (internas.error) {
    // Si hay error interno, mostramos aviso y (opcional) intentamos fallback
    // Aquí elegimos mostrar el error y además intentar el proxy como fallback:
    const proxy = await fetchNoticiasPorProxy(slug);
    return (
      <div className="min-h-screen bg-background">
        <SocialSidebar />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
            Error al cargar noticias internas: {internas.error}
          </div>

          {proxy.error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
              Error también al cargar el proveedor externo: {proxy.error}
            </div>
          )}

          {proxy.noticias.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted text-lg">No hay noticias disponibles en esta sección.</p>
              <Link href="/" className="text-primary hover:underline mt-4 inline-block">Volver al inicio</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {proxy.noticias.map((noticia) => {
                const card = (
                  <Card className="overflow-hidden card-hover border h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={noticia.imagen_url || "/placeholder.svg"}
                          alt={noticia.titulo}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{noticia.titulo}</h3>
                        {noticia.source && <p className="text-sm text-muted-foreground mb-2">{noticia.source}</p>}
                        <time className="text-xs text-muted-foreground mt-auto">
                          {noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion).toLocaleDateString("es-AR") : "Fecha no disponible"}
                        </time>
                      </div>
                    </CardContent>
                  </Card>
                );

                if (noticia.original_url) {
                  return (
                    <a key={noticia.id} href={noticia.original_url} target="_blank" rel="noopener noreferrer">
                      {card}
                    </a>
                  );
                }

                return (
                  <Link key={noticia.id} href={`/nota/${noticia.slug}`}>
                    {card}
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }

  // 2) Si no hay error interno: si hay noticias internas, las mostramos
  if ((internas.noticias ?? []).length > 0) {
    const noticias = internas.noticias as NoticiaInternal[];
    return (
      <div className="min-h-screen bg-background">
        <SocialSidebar />

        <main className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-headline-primary mb-2 capitalize">{slug}</h1>
          <p className="text-text-muted mb-8">Noticias locales de la sección {slug}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia) => {
              const card = (
                <Card className="overflow-hidden card-hover border h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={noticia.imagen_url || "/placeholder.svg"}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{noticia.titulo}</h3>
                      <time className="text-xs text-muted-foreground mt-auto">
                        {noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion).toLocaleDateString("es-AR") : "Fecha no disponible"}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              );

              // Noticias internas: link a la nota local
              return (
                <Link key={noticia.id} href={`/nota/${noticia.slug}`}>
                  {card}
                </Link>
              );
            })}
          </div>

          {/* Aside: últimas de la misma categoría (cliente) */}
          <div className="mt-8">
            {/* RecentNewsList es client component; le pasamos el slug para filtrar por categoría */}
            <RecentNewsList categorySlug={slug} />
          </div>
        </main>
      </div>
    );
  }

  // 3) Si no hay noticias internas (length === 0) y no hubo error → llamar al proxy
  const proxy = await fetchNoticiasPorProxy(slug);

  return (
    <div className="min-h-screen bg-background">
      <SocialSidebar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-headline-primary mb-2 capitalize">{slug}</h1>
        <p className="text-text-muted mb-8">Todas las noticias sobre {slug}</p>

        {proxy.error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            {proxy.error}
          </div>
        )}

        {!proxy.error && proxy.noticias.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">No hay noticias disponibles en esta sección.</p>
            <Link href="/" className="text-primary hover:underline mt-4 inline-block">Volver al inicio</Link>
          </div>
        )}

        {!proxy.error && proxy.noticias.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proxy.noticias.map((noticia) => {
              const card = (
                <Card className="overflow-hidden card-hover border h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={noticia.imagen_url || "/placeholder.svg"}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{noticia.titulo}</h3>
                      {noticia.source && <p className="text-sm text-muted-foreground mb-2">{noticia.source}</p>}
                      <time className="text-xs text-muted-foreground mt-auto">
                        {noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion).toLocaleDateString("es-AR") : "Fecha no disponible"}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              );

              if (noticia.original_url) {
                return (
                  <a key={noticia.id} href={noticia.original_url} target="_blank" rel="noopener noreferrer">
                    {card}
                  </a>
                );
              }

              return (
                <Link key={noticia.id} href={`/nota/${noticia.slug}`}>
                  {card}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
