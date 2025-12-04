// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SocialSidebar from "@/components/SocialSidebar";
import RadioPlayer from "@/components/RadioPlayer";
import Ticker from "@/components/Ticker";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/supabase";
import RecentNewsList from "@/components/RecentNewsList";
import MarketplaceBanner from "@/components/MarketplaceBanner";
import CategoryNewsBlock from "@/components/CategoryNewsBlock";
import CosquinPromoBannerDiario from "@/components/CosquinLineup/CosquinPromoBannerDiario";

// 👇 Cliente SERVER-SIDE (después lo extraemos a helper compartido)
const supabaseServer = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type HomeNoticia = {
  id: number;
  titulo: string;
  slug: string;
  resumen: string | null;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  created_at: string;
  categoria_id: number | null;
};

export const revalidate = 60;

export default async function HomePage() {
  const { data, error } = await supabaseServer
    .from("noticias")
    .select(
      "id, titulo, slug, resumen, imagen_url, fecha_publicacion, created_at, categoria_id"
    )
    .eq("estado", "publicado")
    .order("fecha_publicacion", { ascending: false })
    .limit(24);

  const noticias: HomeNoticia[] = (data as HomeNoticia[]) ?? [];

  const principal = noticias[0] ?? null;
  const secundarias = noticias.slice(1, 5);
  const resto = noticias.slice(4);

  return (
    <div className="min-h-screen bg-background">
      <SocialSidebar />

      {/* Barra superior de Último Momento, igual que en la home general */}
      {noticias.length > 0 && (
        <section className="w-full bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 py-1">
            <Ticker
              noticias={noticias.map((n) => ({
                id: n.id,
                titulo: n.titulo,
              }))}
            />
          </div>
        </section>
      )}

      {/* HERO DEL DIARIO, limpio y centrado como en la imagen 2 */}
      <section className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-2">
          <div className="max-w-3xl mx-auto text-center space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-4">
              Jujuy Conecta Diario
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tu fuente de información más confiable
            </p>
          </div>
        </div>
      </section>

   

      <main className="container mx-auto px-4 py-8 space-y-10">
        {principal && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <article className="lg:col-span-2">
              <Link href={`/nota/${principal.slug}`}>
                <Card className="overflow-hidden border-2 border-primary/40 hover:border-primary transition-colors h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    {principal.imagen_url && (
                      <div className="relative h-64 md:h-80 overflow-hidden">
                        <img
                          src={principal.imagen_url}
                          alt={principal.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5 md:p-6 flex flex-col gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                        Portada
                      </p>
                      <h2 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
                        {principal.titulo}
                      </h2>
                      {principal.resumen && (
                        <p className="text-sm md:text-base text-muted-DEFAULT line-clamp-3">
                          {principal.resumen}
                        </p>
                      )}
                      <time className="text-xs text-primary font-bold">
                        {new Date(
                          principal.fecha_publicacion ?? principal.created_at
                        ).toLocaleString("es-AR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </article>

            <aside className="space-y-4">
              <RecentNewsList />
            </aside>

          </section>
        )}

           {/* BANNER  marketplace*/}
        <MarketplaceBanner />
        {!principal && !error && (
          <section className="py-20 text-center">
            <p className="text-muted-foreground">
              Todavía no hay noticias publicadas.
            </p>
          </section>
        )}

        {error && (
          <section className="py-10">
            <p className="text-destructive">
              Error al cargar noticias: {error.message}
            </p>
          </section>
        )}

        {/* {resto.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                Más noticias
              </h2>
              <Link
                href="/seccion/provinciales"
                className="text-sm text-primary hover:underline"
              >
                Ver todas las provinciales →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resto.map((nota) => (
                <Link key={nota.id} href={`/nota/${nota.slug}`}>
                  <Card className="overflow-hidden card-hover border h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      {nota.imagen_url && (
                        <div className="relative overflow-hidden h-40">
                          <img
                            src={nota.imagen_url}
                            alt={nota.titulo}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
                          {nota.titulo}
                        </h3>
                        {nota.resumen && (
                          <p className="text-sm text-DEFAULT mb-2 line-clamp-3">
                            {nota.resumen}
                          </p>
                        )}
                        <time className="text-xs text-primary font-bold mt-auto">
                          {new Date(
                            nota.fecha_publicacion ?? nota.created_at
                          ).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )} */}

        <div className="container mx-auto mt-10">

        <CategoryNewsBlock
          categorySlug="provinciales"
          titulo="Provinciales"
          limit={6}
        />

        <CategoryNewsBlock
          categorySlug="actualidad"
          titulo="Actualidad"
          limit={6}
        />

        <CategoryNewsBlock
          categorySlug="deportes"
          titulo="Deportes"
          limit={6}
        />

        <CategoryNewsBlock
          categorySlug="cultura"
          titulo="Cultura"
          limit={6}
        />

        <CategoryNewsBlock
          categorySlug="economia"
          titulo="Economía"
          limit={6}
        />
  
        <CosquinPromoBannerDiario />
        {/* Más noticias generales */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Más noticias</h2>
          <RecentNewsList />
        </section>

        </div>  
      </main>
    </div>
  );
}
