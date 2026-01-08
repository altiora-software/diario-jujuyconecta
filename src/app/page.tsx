// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SocialSidebar from "@/components/SocialSidebar";
import Ticker from "@/components/Ticker";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/supabase";
import RecentNewsList from "@/components/RecentNewsList";
import MarketplaceBanner from "@/components/MarketplaceBanner";
import CategoryNewsBlock from "@/components/CategoryNewsBlock";
import CosquinPromoBannerDiario from "@/components/CosquinLineup/CosquinPromoBannerDiario";
import { HomeHero } from "@/components/home/HomeHero"; // Importamos el Hero que arreglamos antes

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
  const { data } = await supabaseServer
    .from("noticias")
    .select("id, titulo, slug, resumen, imagen_url, fecha_publicacion, created_at, categoria_id")
    .eq("estado", "publicado")
    .order("fecha_publicacion", { ascending: false })
    .limit(24);

  const noticias: HomeNoticia[] = (data as HomeNoticia[]) ?? [];

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <SocialSidebar />

      {/* Barra superior de Último Momento */}
      {noticias.length > 0 && (
        <section className="w-full">
          <Ticker
            noticias={noticias.map((n) => ({
              id: n.id,
              titulo: n.titulo,
            }))}
          />
        </section>
      )}

      {/* HERO SECTION */}
      {/* Usamos el HomeHero que ya tiene el diseño premium configurado */}
      <HomeHero />

      <main className="container mx-auto px-4 pb-20 space-y-16">

        {/* MARKETPLACE BANNER - Estilo tarjeta flotante */}
        <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
          <MarketplaceBanner />
        </section>

        {/* BLOQUES POR CATEGORÍA */}
        <div className="grid grid-cols-1 gap-16">
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

          {/* Sección con Sidebar de noticias recientes a mitad de página */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <CategoryNewsBlock
                categorySlug="deportes"
                titulo="Deportes"
                limit={6}
              />
            </div>
            <aside className="lg:pt-14">
              <RecentNewsList />
            </aside>
          </div>

          <CategoryNewsBlock
            categorySlug="cultura"
            titulo="Cultura"
            limit={6}
          />

          <CosquinPromoBannerDiario />

          <CategoryNewsBlock
            categorySlug="economia"
            titulo="Economía"
            limit={6}
          />
        </div>

        {/* FOOTER DE NOTICIAS */}
        <section className="pt-10 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">
              Sigue Informado
            </h2>
            <Link href="/archivo" className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-full text-sm font-bold transition-all">
              Ver Archivo de Noticias
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}