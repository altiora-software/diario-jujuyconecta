"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Clock } from "lucide-react";

type Noticia = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  resumen: string | null;
  categoria?: { nombre: string; slug: string } | null;
};

// --- SUB-COMPONENTE SKELETON (Para evitar el salto visual) ---
function HomeHeroSkeleton() {
  return (
    <div className="container mx-auto px-4 pt-6 pb-12 animate-pulse">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Mismo aspect-ratio que el original para reservar el espacio exacto */}
          <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:h-[550px] bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/5" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-6 w-32 bg-white/5 rounded-full" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HomeHero() {
  const [principal, setPrincipal] = useState<Noticia | null>(null);
  const [secundarias, setSecundarias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchHero() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("noticias")
          .select(`id, titulo, slug, imagen_url, fecha_publicacion, resumen, categoria:categoria_id ( nombre, slug ), destacado, estado`)
          .eq("estado", "publicado")
          .order("destacado", { ascending: false })
          .order("fecha_publicacion", { ascending: false })
          .limit(5);

        if (error) throw error;
        if (!data || data.length === 0) return;

        if (!cancelled) {
          const rows = data as unknown as Noticia[];
          setPrincipal(rows[0]);
          setSecundarias(rows.slice(1));
        }
      } catch (e) {
        console.error("[HomeHero] error:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchHero();
    return () => { cancelled = true; };
  }, []);

  // --- CAMBIO CLAVE: Si está cargando, mostramos el Skeleton ---
  if (loading || !principal) return <HomeHeroSkeleton />;

  return (
    <section className="container mx-auto px-4 pt-6 pb-12">
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Noticia Principal */}
        <div className="lg:col-span-2">
          <Link href={`/nota/${principal.slug}`} className="group block relative">
            <article className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#020817] border border-white/10 shadow-2xl transition-all duration-500 hover:border-primary/30">
              
              <div className="relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-auto lg:h-[550px] overflow-hidden bg-slate-900">
                {principal.imagen_url && (
                  <img
                    src={principal.imagen_url}
                    alt={principal.titulo}
                    // 'loading="eager"' y 'fetchpriority="high"' para que cargue lo antes posible
                    loading="eager"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
                
                {/* Gradiente fijo */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-[#020817]/70 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-10">
                <div className="flex flex-col gap-3 md:gap-5">
                  {principal.categoria?.nombre && (
                    <CategoryBadge
                      label={principal.categoria.nombre}
                      slug={principal.categoria.slug}
                      className="w-fit bg-primary text-[#020817] font-black border-none uppercase text-[10px] tracking-widest"
                    />
                  )}
                  
                  <h1 className="text-2xl md:text-5xl font-black text-white leading-[1.1] tracking-tighter group-hover:text-primary transition-colors duration-300 line-clamp-3 md:line-clamp-none italic uppercase">
                    {principal.titulo}
                  </h1>

                  {principal.resumen && (
                    <p className="hidden sm:block text-slate-300 text-base md:text-lg line-clamp-2 max-w-2xl font-medium">
                      {principal.resumen}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-primary/80 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
                    <Clock className="w-4 h-4" />
                    {new Date(principal.fecha_publicacion || "").toLocaleDateString("es-AR", {
                      day: "numeric", month: "long"
                    })}
                  </div>
                </div>
              </div>
            </article>
          </Link>
        </div>

        {/* Noticia Secundaria (Columna Lateral) */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <h2 className="text-xl font-black tracking-tighter text-white uppercase italic">
              En Jujuy ahora
            </h2>
          </div>

          <div className="grid gap-4">
            {secundarias.slice(0, 4).map((n) => (
              <Link 
                key={n.id} 
                href={`/nota/${n.slug}`} 
                className="group p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-slate-900">
                    {n.imagen_url && (
                      <img
                        src={n.imagen_url}
                        alt={n.titulo}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold text-slate-200 group-hover:text-primary leading-snug line-clamp-2 transition-colors italic uppercase">
                      {n.titulo}
                    </h3>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {new Date(n.fecha_publicacion || "").toLocaleDateString("es-AR")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}