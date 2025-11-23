// src/app/seccion/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import SocialSidebar from "@/components/SocialSidebar";
import { Card, CardContent } from "@/components/ui/card";

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

type Noticia = {
  id: string | number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  source?: string | null;
  original_url?: string | null;
};

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

// Revalidar cada 5 minutos
export const revalidate = 300;

// OJO: params es un Promise
type PageProps = {
  params: Promise<{ slug: string }>;
};

// SEO por sección
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const nombreSeccion =
    slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();

  return {
    title: `Noticias de ${nombreSeccion} | Jujuy Conecta Diario`,
    description: `Todas las noticias sobre ${nombreSeccion} actualizadas en Jujuy Conecta Diario.`,
  };
}

async function fetchNoticiasPorSlug(slug: string): Promise<{
  noticias: Noticia[];
  error: string | null;
}> {
  if (!NEWS_PROXY_URL) {
    return {
      noticias: [],
      error: "Falta configurar NEWS_PROXY_URL en el entorno",
    };
  }

  const normalized = slug.toLowerCase();
  const mappedCategory = slugToCategoryMap[normalized];

  let articles: any[] = [];

  try {
    // 1) Intento principal: top-headlines por categoría
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

      if (
        resTop.ok &&
        jsonTop?.status === "ok" &&
        (jsonTop.articles?.length ?? 0) > 0
      ) {
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

    const mapped: Noticia[] = articles.map((a: any, i: number) => {
      const title = a.title || a.description || "Sin título";
      const publishedAt = a.publishedAt ?? null;
      const slugFromTitle =
        slugifyTitle(title) +
        (publishedAt
          ? "-" + new Date(publishedAt).getTime()
          : `-${i}`);

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
    return {
      noticias: [],
      error: e?.message ?? "Error inesperado al cargar noticias",
    };
  }
}

export default async function SeccionPage({ params }: PageProps) {
  const { slug } = await params;

  const { noticias, error } = await fetchNoticiasPorSlug(slug);

  return (
    <div className="min-h-screen bg-background">
      <SocialSidebar />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-headline-primary mb-2 capitalize">
          {slug}
        </h1>
        <p className="text-text-muted mb-8">
          Todas las noticias sobre {slug}
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!error && noticias.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">
              No hay noticias disponibles en esta sección.
            </p>
            <Link
              href="/"
              className="text-primary hover:underline mt-4 inline-block"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {!error && noticias.length > 0 && (
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
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      {noticia.source && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {noticia.source}
                        </p>
                      )}
                      <time className="text-xs text-muted-foreground mt-auto">
                        {noticia.fecha_publicacion
                          ? new Date(
                              noticia.fecha_publicacion
                            ).toLocaleDateString("es-AR")
                          : "Fecha no disponible"}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              );

              if (noticia.original_url) {
                return (
                  <a
                    key={noticia.id}
                    href={noticia.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
