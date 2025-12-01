// src/app/seccion/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import SocialSidebar from "@/components/SocialSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client"; // USAR supabase client
import RecentNewsList from "@/components/RecentNewsList";

// Revalidate
export const revalidate = 300;

type Noticia = {
  id: string | number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  source?: string | null;
  original_url?: string | null;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const nombreSeccion = slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
  return {
    title: `Noticias de ${nombreSeccion} | Jujuy Conecta Diario`,
    description: `Todas las noticias sobre ${nombreSeccion} actualizadas en Jujuy Conecta Diario.`,
  };
}

async function fetchNoticiasInternasPorSlug(slug: string): Promise<{ noticias: Noticia[]; error: any }> {
  // buscar categoria
  const { data: categoria, error: catErr } = await supabase.from("categorias").select("id, nombre, slug").eq("slug", slug).limit(1).single();

  if (catErr) {
    // error en la consulta (no abortar, devolvemos vacío y fallback)
    return { noticias: [], error: catErr };
  }

  if (categoria && categoria.id) {
    const { data, error } = await supabase
      .from("noticias")
      .select("id, titulo, slug, imagen_url, fecha_publicacion, created_at, resumen, contenido")
      .eq("estado", "publicado")
      .eq("categoria_id", categoria.id)
      .order("fecha_publicacion", { ascending: false })
      .limit(24);

    return { noticias: (data as any[]) ?? [], error };
  }

  return { noticias: [], error: null };
}

async function fetchNoticiasExternasPorSlug(slug: string): Promise<{ noticias: Noticia[]; error: any }> {
  // tu lógica previa con NEWS_PROXY_URL (lo dejo igual que tenías)
  // ... si no tenés NEWS_PROXY_URL configurado, devolvemos vacío
  const NEWS_PROXY_URL = process.env.NEWS_PROXY_URL;
  if (!NEWS_PROXY_URL) return { noticias: [], error: "NEWS_PROXY_URL no configurado" };

  try {
    // fallback: intentar categoría mapeada -> everything/top-headlines
    const res = await fetch(`${NEWS_PROXY_URL}/everything?q=${encodeURIComponent(slug)}&language=es&pageSize=24`);
    const json = await res.json();
    if (!res.ok || json?.status !== "ok") throw new Error(json?.message || `HTTP ${res.status}`);
    const articles = json.articles || [];
    const mapped = articles.map((a: any, i: number) => {
      const title = a.title || a.description || "Sin título";
      const publishedAt = a.publishedAt ?? null;
      const slugFromTitle = title.toLowerCase().replace(/[^a-z0-9áéíóúñ]+/g, "-").replace(/^-+|-+$/g, "") + "-" + (publishedAt ? new Date(publishedAt).getTime() : i);
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
    return { noticias: [], error: e?.message ?? "Error externo" };
  }
}

export default async function SeccionPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // 1) intento interno
  const internas = await fetchNoticiasInternasPorSlug(slug);
  if (internas.error) console.error("Error fetch internas:", internas.error);

  // 2) si no hay internas -> fallback externo
  let noticias = internas.noticias;
  if ((!noticias || noticias.length === 0) && process.env.NEWS_PROXY_URL) {
    const externas = await fetchNoticiasExternasPorSlug(slug);
    if (!externas.error) noticias = externas.noticias;
  }

  return (
    <div className="min-h-screen bg-background">
      <SocialSidebar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-headline-primary mb-2 capitalize">{slug}</h1>
        <p className="text-text-muted mb-8">Todas las noticias sobre {slug}</p>

        {!noticias || noticias.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-text-muted text-lg">No hay noticias disponibles en esta sección.</p>
            <Link href="/" className="text-primary hover:underline mt-4 inline-block">Volver al inicio</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia) => {
              const card = (
                <Card className="overflow-hidden card-hover border h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative overflow-hidden h-48">
                      <img src={noticia.imagen_url || "/placeholder.svg"} alt={noticia.titulo} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{noticia.titulo}</h3>
                      {noticia.source && <p className="text-sm text-muted-foreground mb-2">{noticia.source}</p>}
                      <time className="text-xs text-muted-foreground mt-auto">{noticia.fecha_publicacion ? new Date(noticia.fecha_publicacion).toLocaleDateString("es-AR") : "Fecha no disponible"}</time>
                    </div>
                  </CardContent>
                </Card>
              );

              if ((noticia as any).original_url) {
                return <a key={noticia.id} href={(noticia as any).original_url} target="_blank" rel="noopener noreferrer">{card}</a>;
              }

              return <Link key={noticia.id} href={`/nota/${noticia.slug}`}>{card}</Link>;
            })}
          </div>
        )}
      </main>
    </div>
  );
}
