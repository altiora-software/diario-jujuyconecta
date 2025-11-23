// src/components/home/HomeHero.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Link from "next/link";
import { CategoryBadge } from "@/components/ui/CategoryBadge";

type Noticia = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  fecha_publicacion: string | null;
  resumen: string | null;
  categoria?: { nombre: string; slug: string } | null;
};

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
          .select(
            `
            id,
            titulo,
            slug,
            imagen_url,
            fecha_publicacion,
            resumen,
            categoria:categoria_id ( nombre, slug ),
            destacado,
            estado
          `
          )
          .eq("estado", "publicado")
          .order("destacado", { ascending: false })
          .order("fecha_publicacion", { ascending: false })
          .limit(5);

        if (error) throw error;
        if (!data || data.length === 0) {
          if (!cancelled) setPrincipal(null);
          return;
        }

        if (!cancelled) {
          // casteamos a Noticia para TS
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
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return null;
  if (!principal) return null;

  return (
    <section className="container mx-auto px-4 pt-8 pb-4">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="lg:col-span-2">
          <Link href={`/nota/${principal.slug}`}>
            <article className="group rounded-2xl overflow-hidden bg-card border border-border/80 shadow-sm hover:shadow-xl hover:-translate-y-[4px] transition-all duration-300">
              {principal.imagen_url && (
                <div className="relative overflow-hidden max-h-[420px]">
                  <img
                    src={principal.imagen_url}
                    alt={principal.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                </div>
              )}
              <div className="p-6 relative -mt-10">
                <div className="inline-flex mb-3">
                  {principal.categoria?.nombre && (
                    <CategoryBadge
                      label={principal.categoria.nombre}
                      slug={principal.categoria.slug}
                      className="backdrop-blur-sm"
                    />
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold mb-3 group-hover:text-primary transition-colors">
                  {principal.titulo}
                </h1>
                {principal.resumen && (
                  <p className="text-muted-foreground text-base md:text-lg line-clamp-3">
                    {principal.resumen}
                  </p>
                )}
                {principal.fecha_publicacion && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    {new Date(principal.fecha_publicacion).toLocaleDateString(
                      "es-AR",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </p>
                )}
              </div>
            </article>
          </Link>
        </div>

        {/* Columna derecha (luego la llenamos mejor) */}
        {/* <div className="space-y-4">
          <h2 className="text-lg font-semibold">En Jujuy ahora</h2>
        
          {secundarias.slice(0, 3).map((n) => (
            <Link key={n.id} href={`/nota/${n.slug}`}>
              <div className="flex gap-3 items-start group">
                {n.imagen_url && (
                  <img
                    src={n.imagen_url}
                    alt={n.titulo}
                    className="w-16 h-16 mb-4 space-y-4 object-cover rounded-md border border-border/60"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold line-clamp-2 group-hover:text-primary">
                    {n.titulo}
                  </p>
                  {n.fecha_publicacion && (
                    <time className="text-[11px] text-muted-foreground">
                      {new Date(n.fecha_publicacion).toLocaleDateString("es-AR")}
                    </time>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div> */}

<div className="space-y-4"> 
  <h2 className="text-lg font-semibold">En Jujuy ahora</h2>

  {secundarias.slice(0, 3).map((n) => (
    <Link 
      key={n.id} 
      href={`/nota/${n.slug}`} 
      // Añadimos la clase "block" para que tome el ancho completo y "hover:opacity-75" para efecto visual.
      className="block hover:opacity-75 transition-opacity duration-200" 
    >
      {/* Aumentamos el gap y usamos `flex-none` en la imagen para evitar que se comprima */}
      <div className="flex gap-4 items-start group"> 
        {n.imagen_url && (
          <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md border border-border/60">
            <img
              src={n.imagen_url}
              alt={n.titulo}
              // Hacemos que la imagen llene el contenedor fijo de 80x80px
              className="w-full h-full object-cover" 
            />
          </div>
        )}
        <div className="min-w-0"> {/* Usamos min-w-0 para que el texto se trunque correctamente */}
          <p className="text-base font-semibold line-clamp-2 group-hover:text-primary leading-tight">
            {n.titulo}
          </p>
          {n.fecha_publicacion && (
            <time className="text-xs text-muted-foreground">
              {new Date(n.fecha_publicacion).toLocaleDateString("es-AR", { day: "numeric", month: "numeric", year: "numeric" })}
            </time>
          )}
        </div>
      </div>
    </Link>
  ))}
</div>
      </div>
    </section>
  );
}
