// src/components/CategoryNewsBlock.tsx
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { ChevronRight } from "lucide-react";

type Props = {
  categorySlug: string;
  titulo: string;
  limit?: number;
};

export default async function CategoryNewsBlock({ categorySlug, titulo, limit = 6 }: Props) {
  // 1) Obtener ID de categoría
  const { data: categoria } = await supabase
    .from("categorias")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!categoria) return null;

  // 2) Obtener noticias
  const { data: noticias } = await supabase
    .from("noticias")
    .select("id, titulo, slug, imagen_url, fecha_publicacion")
    .eq("estado", "publicado")
    .eq("categoria_id", categoria.id)
    .order("fecha_publicacion", { ascending: false })
    .limit(limit);

  if (!noticias || noticias.length === 0) return null;

  return (
    <section className="mb-20">
      {/* Encabezado de Sección con estilo Deportivo/Moderno */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic">
            {titulo}
          </h2>
        </div>
        <Link 
          href={`/seccion/${categorySlug}`} 
          className="group flex items-center gap-1 text-primary font-bold text-xs tracking-widest uppercase transition-all hover:gap-2"
        >
          Explorar sección <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid de Noticias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {noticias.map(n => (
          <Link 
            key={n.id} 
            href={`/nota/${n.slug}`} 
            className="group flex flex-col transition-all duration-300"
          >
            {/* Contenedor de Imagen con Efecto Glass */}
            <div className="relative w-full h-56 rounded-[2rem] overflow-hidden mb-5 border border-white/10 shadow-lg transition-transform duration-500 group-hover:-translate-y-2 group-hover:border-primary/30 group-hover:shadow-primary/10">
              {n.imagen_url && (
                <img
                  src={n.imagen_url}
                  alt={n.titulo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              {/* Overlay gradiente más profundo para contraste */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-80" />
              
              {/* Fecha flotante estilo badge */}
              <div className="absolute bottom-4 left-4">
                <p className="bg-black/60 backdrop-blur-md text-[10px] font-bold text-white px-3 py-1 rounded-full border border-white/10 uppercase tracking-tighter">
                  {new Date(n.fecha_publicacion || "").toLocaleDateString("es-AR", {
                    day: "numeric", month: "short"
                  })}
                </p>
              </div>
            </div>
            
            {/* Texto de la noticia */}
            <div className="px-2 space-y-3">
              <h3 className="font-bold text-lg md:text-xl leading-[1.2] text-slate-100 group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                {n.titulo}
              </h3>
              <div className="h-0.5 w-0 bg-primary group-hover:w-full transition-all duration-500 rounded-full" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}