// src/app/seccion/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import SocialSidebar from "@/components/SocialSidebar";
import RecentNewsList from "@/components/RecentNewsList";
import { ChevronLeft, Globe, Zap, AlertCircle } from "lucide-react";

// Helpers para Supabase
import { getCategoryBySlug, getNoticiasByCategoriaId } from "@/lib/newsQueries";

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
  id: number | string;
  titulo: string;
  slug: string;
  imagen_url?: string | null;
  fecha_publicacion?: string | null;
  created_at?: string | null;
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

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const catRes = await getCategoryBySlug(slug);
    const nombre = catRes?.data?.nombre ?? slug;
    const nombreSeccion = String(nombre).charAt(0).toUpperCase() + String(nombre).slice(1);
    return {
      title: `${nombreSeccion} | Jujuy Conecta Diario`,
      description: `Todas las noticias sobre ${nombreSeccion} actualizadas en Jujuy Conecta Diario.`,
    };
  } catch {
    const nombreSeccion = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
    return {
      title: `${nombreSeccion} | Jujuy Conecta Diario`,
    };
  }
}

async function fetchNoticiasPorProxy(slug: string): Promise<{ noticias: NoticiaExternal[]; error: string | null }> {
  if (!NEWS_PROXY_URL) return { noticias: [], error: "Falta configurar NEWS_PROXY_URL" };
  const normalized = slug.toLowerCase();
  const mappedCategory = slugToCategoryMap[normalized];
  let articles: any[] = [];

  try {
    if (mappedCategory) {
      const p1 = new URLSearchParams();
      p1.set("language", "es");
      p1.set("pageSize", "24");
      p1.set("category", mappedCategory);
      p1.set("country", "ar");
      const urlTop = `${NEWS_PROXY_URL}/top-headlines?${p1.toString()}`;
      const resTop = await fetch(urlTop, { headers: FUNCTION_HEADERS, next: { revalidate: 300 } });
      const jsonTop = await resTop.json();
      if (resTop.ok && jsonTop?.status === "ok" && (jsonTop.articles?.length ?? 0) > 0) {
        articles = jsonTop.articles;
      }
    }
    if (articles.length === 0) {
      const q = normalized || "noticias";
      const p2 = new URLSearchParams();
      p2.set("q", q);
      p2.set("language", "es");
      p2.set("sortBy", "publishedAt");
      p2.set("pageSize", "24");
      const urlEv = `${NEWS_PROXY_URL}/everything?${p2.toString()}`;
      const resEv = await fetch(urlEv, { headers: FUNCTION_HEADERS, next: { revalidate: 300 } });
      const jsonEv = await resEv.json();
      if (!resEv.ok || jsonEv?.status !== "ok") throw new Error(jsonEv?.message || `HTTP ${resEv.status}`);
      articles = jsonEv.articles || [];
    }
    const mapped: NoticiaExternal[] = articles.map((a: any, i: number) => {
      const title = a.title || a.description || "Sin título";
      const publishedAt = a.publishedAt ?? null;
      const slugFromTitle = slugifyTitle(title) + (publishedAt ? "-" + new Date(publishedAt).getTime() : `-${i}`);
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
    return { noticias: [], error: e?.message };
  }
}

async function fetchNoticiasInternas(slug: string): Promise<{ noticias: NoticiaInternal[]; error: string | null }> {
  try {
    const catRes = await getCategoryBySlug(slug);
    if (catRes.error) return { noticias: [], error: String(catRes.error.message ?? catRes.error) };
    if (!catRes.data) return { noticias: [], error: null };
    const noticiasRes = await getNoticiasByCategoriaId(catRes.data.id, 24);
    if (noticiasRes.error) return { noticias: [], error: String(noticiasRes.error.message ?? noticiasRes.error) };
    const rows = (noticiasRes.data ?? []) as any[];
    const mapped: NoticiaInternal[] = rows.map((r) => ({
      id: r.id,
      titulo: r.titulo,
      slug: r.slug,
      imagen_url: r.imagen_url ?? null,
      fecha_publicacion: r.fecha_publicacion ?? r.created_at ?? null,
      created_at: r.created_at ?? null,
    }));
    return { noticias: mapped, error: null };
  } catch (e: any) {
    return { noticias: [], error: e?.message };
  }
}

/** * COMPONENTE DE TARJETA (Visual Only)
 */
const NewsCard = ({ noticia, isExternal }: { noticia: any, isExternal: boolean }) => {
  const url = isExternal ? noticia.original_url : `/nota/${noticia.slug}`;
  const target = isExternal ? "_blank" : "_self";

  return (
    <Link href={url} target={target} className="group flex flex-col h-full">
      <div className="relative w-full h-52 rounded-[2rem] overflow-hidden mb-4 border border-white/10 shadow-lg group-hover:border-primary/40 transition-all duration-500">
        <img 
          src={noticia.imagen_url || "/placeholder.svg"} 
          alt={noticia.titulo} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-70" />
        <div className="absolute top-4 right-4">
          <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter backdrop-blur-md border border-white/10 ${isExternal ? 'bg-blue-500/20 text-blue-400' : 'bg-primary/20 text-primary'}`}>
            {isExternal ? <Globe className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
            {isExternal ? (noticia.source || 'Global') : 'Exclusivo'}
          </span>
        </div>
      </div>
      <div className="px-2">
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">
          {noticia.titulo}
        </h3>
        <time className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {new Date(noticia.fecha_publicacion || noticia.created_at || "").toLocaleDateString("es-AR", { day: 'numeric', month: 'long' })}
        </time>
      </div>
    </Link>
  );
};

export default async function SeccionPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Intentar internas
  const internas = await fetchNoticiasInternas(slug);
  
  let noticiasAMostrar = internas.noticias || [];
  let isExternalFallback = false;
  let errorMsg = internas.error;

  // 2. Si no hay internas o hubo error, intentar proxy
  if (noticiasAMostrar.length === 0) {
    const proxy = await fetchNoticiasPorProxy(slug);
    noticiasAMostrar = proxy.noticias;
    isExternalFallback = true;
    if (proxy.error) errorMsg = proxy.error;
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <SocialSidebar />
      <main className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6 hover:opacity-70 transition-opacity">
            <ChevronLeft className="w-4 h-4" /> Inicio
          </Link>
          <div className="flex items-center gap-4">
            <span className="w-2 h-12 bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            <div>
              <h1 className="text-5xl md:text-6xl text-secondary uppercase tracking-tighter italic">
                {slug}
              </h1>
              <p className="text-slate-400 font-medium mt-1">
                {isExternalFallback ? 'Cobertura Global en Tiempo Real' : 'Noticias Locales Actualizadas'}
              </p>
            </div>
          </div>
        </header>

        {errorMsg && (
          <div className="flex items-center gap-3 p-4 mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm italic">
            <AlertCircle className="w-5 h-5" />
            <p>Aviso del sistema: {errorMsg}. Explorando fuentes alternativas...</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          <div className="xl:col-span-8">
            {noticiasAMostrar.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {noticiasAMostrar.map((n: any) => (
                  <NewsCard key={n.id} noticia={n} isExternal={isExternalFallback} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
                <p className="text-slate-500 text-lg italic">No se encontraron noticias disponibles en este momento.</p>
                <Link href="/" className="text-primary font-bold mt-4 inline-block hover:underline">Volver al Home</Link>
              </div>
            )}
          </div>

          <aside className="xl:col-span-4 space-y-10">
            <div className="sticky top-28">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-sm">
                <h2 className="text-xl text-secondary uppercase tracking-tighter mb-6 flex items-center gap-2 italic">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  Lo más reciente
                </h2>
                <RecentNewsList categorySlug={slug} />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}