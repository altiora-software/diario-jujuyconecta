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
import { Clock, User, ChevronLeft } from "lucide-react";
import Link from "next/link";

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

const SITE_BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://diario.jujuyconecta.com").replace(/\/$/, "");

function extractPlainText(html: string | null, maxLen = 160): string {
  if (!html) return "";
  const text = html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text.slice(0, maxLen);
}

async function getNotaBySlug(slug: string): Promise<Nota | null> {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("slug", slug)
    .eq("estado", "publicado")
    .single();
  if (error) return null;
  return data as Nota;
}

type RouteParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: RouteParams, parent: ResolvingMetadata): Promise<Metadata> {
  const { slug } = await params;
  const nota = await getNotaBySlug(slug);
  if (!nota) return { title: "Noticia no encontrada" };

  const url = `${SITE_BASE}/nota/${nota.slug}`;
  const description = nota.resumen ?? extractPlainText(nota.contenido, 160);
  const imageUrl = nota.imagen_url;

  return {
    title: `${nota.titulo} | Jujuy Conecta`,
    description,
    openGraph: {
      type: "article",
      url,
      title: nota.titulo,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function NoticiaPage({ params }: RouteParams) {
  const { slug } = await params;
  const nota = await getNotaBySlug(slug);

  if (!nota) notFound();

  const publishedIso = nota.fecha_publicacion || nota.created_at;
  const fecha = new Date(publishedIso).toLocaleDateString("es-AR", {
    day: "numeric", month: "long", year: "numeric"
  });

  const imageUrl = nota.imagen_url;

  return (
    <div className="min-h-screen bg-[#020817]">
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* COLUMNA PRINCIPAL DE LECTURA */}
          <article className="xl:col-span-8">
            
            {/* Botón Volver */}
            <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:opacity-80 transition-opacity uppercase tracking-widest">
              <ChevronLeft className="w-4 h-4" /> Volver al inicio
            </Link>

            <header className="mb-10">
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                {nota.titulo}
              </h1>

              <div className="flex flex-wrap items-center gap-6 py-4 border-y border-white/10 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <time dateTime={publishedIso}>{fecha}</time>
                </div>
                {nota.autor && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span className="font-medium text-slate-300">Por {nota.autor}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Imagen Destacada */}
            {imageUrl && (
              <figure className="mb-10 relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={imageUrl}
                    alt={nota.titulo}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </figure>
            )}

            {/* Copete / Resumen */}
            {nota.resumen && (
              <div className="relative mb-12 p-8 rounded-3xl bg-primary/5 border border-primary/20">
                <div className="absolute top-0 left-8 -translate-y-1/2 bg-primary text-black text-[10px] font-black px-3 py-1 rounded-full uppercase">
                  Resumen
                </div>
                <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-medium italic">
                  "{nota.resumen}"
                </p>
              </div>
            )}

            {/* Cuerpo de la noticia */}
            <div className="mx-auto">
              <div
                className="prose prose-invert prose-lg max-w-none 
                prose-p:text-slate-300 prose-p:leading-[1.8] prose-p:mb-6
                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tighter
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-img:rounded-3xl prose-img:border prose-img:border-white/10"
                dangerouslySetInnerHTML={{ __html: nota.contenido ?? "" }}
              />

              <div className="mt-16 pt-8 border-t border-white/10 space-y-10">
                <ShareButtons titulo={nota.titulo} slug={nota.slug} />
                
                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10">
                  <HighlightedRelatedStory noticiaId={nota.id} categoriaId={nota.categoria_id} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <RatingStars noticiaId={nota.id} />
                  <Comments noticiaId={nota.id} />
                </div>
              </div>
            </div>
          </article>

          {/* ASIDE / SIDEBAR */}
          <aside className="xl:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              <div className="p-6 rounded-3xl bg-[#0a0f1d] border border-white/10">
                <h2 className="text-lg font-black uppercase tracking-tighter text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full" />
                  Noticias Recientes
                </h2>
                <RecentNewsList />
              </div>
              <MarketplaceSidebarBanner />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}