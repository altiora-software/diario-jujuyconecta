// src/app/nota/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import Script from "next/script";
import Image from "next/image";
import { supabase } from "@/integrations/supabase/client";
import RatingStars from "@/components/RatingStars";
import Comments from "@/components/Comments";
import RecentNewsList from "@/components/RecentNewsList";
import ShareButtons from "@/components/ShareButtons";
import MarketplaceSidebarBanner from "@/components/MarketplaceSidebarBanner";
import HighlightedRelatedStory from "@/components/HighlightedRelatedStory";

type Nota = {
  id: number;
  titulo: string;
  slug: string;
  contenido: string | null;
  resumen: string | null;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  categoria_id: number | null;
  autor?: string | null;
  created_at: string;
};

const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://diario.jujuyconecta.com")
  .replace(/\/$/, "");

// Helper para limpiar HTML y sacar descripción
function extractPlainText(html: string | null, maxLen = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text.slice(0, maxLen);
}

// función común para no repetir la query
async function getNotaBySlug(slug: string): Promise<Nota | null> {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("slug", slug)
    .eq("estado", "publicado")
    .single();

  if (error) {
    console.error("Error cargando noticia:", error);
    return null;
  }

  return data as Nota;
}

type RouteParams = {
  params: Promise<{ slug: string }>;
};

// ------- SEO dinámico para la nota --------
export async function generateMetadata(
  { params }: RouteParams,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const nota = await getNotaBySlug(slug);

  if (!nota) {
    return {
      title: "Noticia no encontrada",
      description: "La noticia que buscás no existe o fue eliminada.",
      robots: { index: false, follow: false },
    };
  }

  const url = new URL(`/nota/${nota.slug}`, SITE_BASE).toString();

  const description =
    nota.resumen ??
    extractPlainText(nota.contenido, 160);

  const published = nota.fecha_publicacion || nota.created_at;

  const imageUrl = nota.imagen_url
    ? (nota.imagen_url.startsWith("http")
        ? nota.imagen_url
        : new URL(nota.imagen_url, SITE_BASE).toString())
    : undefined;

  const images = imageUrl
    ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: nota.titulo,
        },
      ]
    : (await parent).openGraph?.images ?? [];

  return {
    title: `${nota.titulo} | Jujuy Conecta Diario`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: nota.titulo,
      description,
      publishedTime: published,
      modifiedTime: nota.created_at,
      siteName: "Jujuy Conecta Diario",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: nota.titulo,
      description,
      images: images.length
        ? images.map((i) => (typeof i === "string" ? i : url))
        : undefined,
    },
  };
}

// ------- Página de la noticia --------
export default async function NoticiaPage({ params }: RouteParams) {
  const { slug } = await params;
  const nota = await getNotaBySlug(slug);

  if (!nota) {
    notFound();
  }

  const publishedIso = nota.fecha_publicacion || nota.created_at;
  const fecha = new Date(publishedIso).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const url = `${SITE_BASE}/nota/${nota.slug}`;

  const description =
    nota.resumen ??
    extractPlainText(nota.contenido, 200);

  // Si guardás URL completa de Supabase, esto pasa directo
  // Si alguna vez pasás a guardar solo el path, acá deberías generar el publicUrl de Supabase.
  const imageUrl = nota.imagen_url
    ? (nota.imagen_url.startsWith("http")
        ? nota.imagen_url
        : `${SITE_BASE}${nota.imagen_url.startsWith("/") ? "" : "/"}${nota.imagen_url}`)
    : undefined;

  // JSON-LD NewsArticle
  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: nota.titulo,
    description,
    image: imageUrl ? [imageUrl] : undefined,
    datePublished: publishedIso,
    dateModified: nota.created_at,
    author: nota.autor
      ? {
          "@type": "Person",
          name: nota.autor,
        }
      : {
          "@type": "Organization",
          name: "Redacción Jujuy Conecta",
        },
    publisher: {
      "@type": "Organization",
      name: "Jujuy Conecta Diario",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_BASE}/jc.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    articleSection: "Noticias",
    inLanguage: "es-AR",
  };

  // JSON-LD Breadcrumbs
  const jsonLdBreadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_BASE,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Noticias",
        item: `${SITE_BASE}/`, // si después tenés secciones, acá va /seccion/x
      },
      {
        "@type": "ListItem",
        position: 3,
        name: nota.titulo,
        item: url,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD para esta nota */}
      <Script
        id={`ld-json-article-${nota.id}`}
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([jsonLdArticle, jsonLdBreadcrumbs]),
        }}
      />

      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* MAIN */}
          <article className="xl:col-span-8 mx-auto w-full">
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-headline-primary mb-4 leading-tight">
                {nota.titulo}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-text-secondary text-sm">
                <time dateTime={publishedIso}>{fecha}</time>
                {nota.autor && (
                  <>
                    <span>•</span>
                    <span>Por {nota.autor}</span>
                  </>
                )}
              </div>
            </header>

            {imageUrl && (
              <figure className="mb-8 rounded-lg overflow-hidden border border-news-border">
                {/* Paso 1: al menos usar next/image y sizes */}
                <div className="relative w-full h-auto aspect-[16/9]">
                  <Image
                    src={imageUrl}
                    alt={nota.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 60vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              </figure>
            )}

            {nota.resumen && (
              <div className="bg-muted/50 border-l-4 border-primary p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-foreground/80 leading-relaxed italic">
                  {nota.resumen}
                </p>
              </div>
            )}
            <div className="mx-auto">
              <div
                className="prose prose-lg max-w-none text-foreground leading-relaxed prose-headings:text-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: nota.contenido ?? "" }}
              />
              <HighlightedRelatedStory
                noticiaId={nota.id}
                categoriaId={nota.categoria_id}
              />
              <a
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:underline mt-8 mb-6"
              >
                ← Volver al inicio
              </a>

              <ShareButtons titulo={nota.titulo} slug={nota.slug} />
              <RatingStars noticiaId={nota.id} />
              <Comments noticiaId={nota.id} />
            </div>
          </article>

          {/* ASIDE */}
          <aside className="xl:col-span-4">
            <div className="sticky top-28 space-y-4">
              <RecentNewsList />
              <MarketplaceSidebarBanner />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
