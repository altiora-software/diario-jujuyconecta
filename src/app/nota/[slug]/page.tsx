// src/app/nota/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { supabase } from "@/integrations/supabase/client";
import RatingStars from "@/components/RatingStars";
import Comments from "@/components/Comments";
import RecentNewsList from "@/components/RecentNewsList";
import ShareButtons from "@/components/ShareButtons";

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

  const previousImages = (await parent).openGraph?.images || [];
  const url = `/nota/${nota.slug}`;

  const description =
    nota.resumen ??
    (nota.contenido ? nota.contenido.replace(/<[^>]+>/g, "").slice(0, 160) : "");

  const published = nota.fecha_publicacion || nota.created_at;

  return {
    title: nota.titulo,
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
      images: nota.imagen_url
        ? [
            {
              url: nota.imagen_url,
              width: 1200,
              height: 630,
              alt: nota.titulo,
            },
          ]
        : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: nota.titulo,
      description,
      images: nota.imagen_url ? [nota.imagen_url] : undefined,
    },
  };
}

// ------- Página de la noticia --------
export default async function NoticiaPage({ params }: RouteParams) {
  // 👉 ESTO es lo que te marcaba el error: hay que hacer await
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
            <a
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              ← Volver al inicio
            </a>

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
                {/* podrías migrar a next/image después, pero esto funciona ya */}
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

            {/* Contenido con ancho cómodo */}
            <div className="mx-auto ">
              <div
                className="prose prose-lg max-w-none text-foreground leading-relaxed prose-headings:text-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: nota.contenido ?? "" }}
              />
              <ShareButtons titulo={nota.titulo} slug={nota.slug} />
              {/* Rating */}
            <RatingStars noticiaId={nota.id} />

            {/* Comentarios */}
            <Comments noticiaId={nota.id} />
            </div>
          </article>

          {/* ASIDE */}
          <aside className="xl:col-span-4">
            <div className="sticky top-28">
              <RecentNewsList />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
