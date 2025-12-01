import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  categorySlug: string;
  titulo: string;
  limit?: number;
};

export default async function CategoryNewsBlock({ categorySlug, titulo, limit = 6 }: Props) {
  // 1) obtener id de categoria
  const { data: categoria } = await supabase
    .from("categorias")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!categoria) return null;

  // 2) obtener noticias
  const { data: noticias } = await supabase
    .from("noticias")
    .select("id, titulo, slug, imagen_url, fecha_publicacion")
    .eq("estado", "publicado")
    .eq("categoria_id", categoria.id)
    .order("fecha_publicacion", { ascending: false })
    .limit(limit);

  if (!noticias || noticias.length === 0) return null;

  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{titulo}</h2>
        <Link href={`/seccion/${categorySlug}`} className="text-primary font-semibold text-sm">
          Ver más →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {noticias.map(n => (
          <Link key={n.id} href={`/nota/${n.slug}`} className="group">
            <div className="w-full h-44 rounded-md overflow-hidden mb-2">
              {n.imagen_url && (
                <img
                  src={n.imagen_url}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              )}
            </div>
            <h3 className="font-medium">{n.titulo}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(n.fecha_publicacion || "").toLocaleDateString("es-AR")}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
