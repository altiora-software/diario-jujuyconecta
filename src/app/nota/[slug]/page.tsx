// src/app/nota/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import RatingStars from "@/components/RatingStars";
import Comments from "@/components/Comments";
import RecentNewsList from "@/components/RecentNewsList";
import ShareButtons from "@/components/ShareButtons";
import MarketplaceSidebarBanner from "@/components/MarketplaceSidebarBanner";

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

/* helper: obtener base absoluta desde env pública */
const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://diario.jujuyconecta.com").replace(/\/$/, "");

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

// ------- SEO dinámico para la nota --------
type RouteParams = {
  params: Promise<{ slug: string }>;
};

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

  // PRECAUCIÓN: hay que usar URL absoluta para canonical / og:url
  const url = new URL(`/nota/${nota.slug}`, SITE_BASE).toString();

  const description =
    nota.resumen ??
    (nota.contenido ? nota.contenido.replace(/<[^>]+>/g, "").slice(0, 160) : "");

  const published = nota.fecha_publicacion || nota.created_at;

  // Asegurá que la imagen sea absoluta
  const images = nota.imagen_url
    ? [
        {
          url: nota.imagen_url.startsWith("http")
            ? nota.imagen_url
            : new URL(nota.imagen_url, SITE_BASE).toString(),
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
      images: images.length ? images.map((i) => (typeof i === "string" ? i : i.url)) : undefined,
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

  const fecha = new Date(
    nota.fecha_publicacion || nota.created_at
  ).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* MAIN */}
          <article className="xl:col-span-8 mx-auto w-full">
         
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-headline-primary mb-4 leading-tight">
                {nota.titulo}
              </h1>

              <div className="flex items-center gap-4 text-text-secondary text-sm">
                <time dateTime={nota.fecha_publicacion || nota.created_at}>
                  {fecha}
                </time>
                {nota.autor && (
                  <>
                    <span>•</span>
                    <span>Por {nota.autor}</span>
                  </>
                )}
              </div>
            </header>

            {nota.imagen_url && (
              <figure className="mb-8 rounded-lg overflow-hidden border border-news-border">
                <img
                  src={nota.imagen_url}
                  alt={nota.titulo}
                  className="w-full h-auto object-cover"
                />
              </figure>
            )}

            {nota.resumen && (
              <div className="bg-muted/50 border-l-4 border-primary p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-foreground/80 leading-relaxed italic">
                  {nota.resumen}
                </p>
              </div>
            )}

            <div className="mx-auto ">
              <div
                className="prose prose-lg max-w-none text-foreground leading-relaxed prose-headings:text-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: nota.contenido ?? "" }}
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
               {/* banner aside  */}
              <RecentNewsList />
              <MarketplaceSidebarBanner />
             </div>
             
          </aside>
        </div>
      </main>
    </div>
  );
}
