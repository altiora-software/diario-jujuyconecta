"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type NotaResumida = {
  id: number;
  titulo: string;
  slug: string;
  imagen_url: string | null;
  resumen?: string | null;
  fecha_publicacion: string | null;
  created_at: string;
};

type Props = {
  noticiaId: number;
  categoriaId?: number | null;
};

const HighlightedRelatedStory = ({ noticiaId, categoriaId }: Props) => {
  const [nota, setNota] = useState<NotaResumida | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchRandomRelated() {
      let pool: NotaResumida[] = [];

      // 1) obtener set de misma categoría
      if (categoriaId) {
        const { data, error } = await supabase
          .from("noticias")
          .select(
            "id, titulo, slug, imagen_url, resumen, fecha_publicacion, created_at"
          )
          .eq("estado", "publicado")
          .eq("categoria_id", categoriaId)
          .neq("id", noticiaId)
          .order("fecha_publicacion", { ascending: false })
          .limit(6);

        if (!error && data) {
          pool = data as NotaResumida[];
        }
      }

      // 2) fallback si categoría está vacía
      if (pool.length < 2) {
        const { data, error } = await supabase
          .from("noticias")
          .select(
            "id, titulo, slug, imagen_url, resumen, fecha_publicacion, created_at"
          )
          .eq("estado", "publicado")
          .neq("id", noticiaId)
          .order("fecha_publicacion", { ascending: false })
          .limit(6);

        if (!error && data) {
          // mezclamos sin repetir los ya obtenidos
          const ids = new Set(pool.map((n) => n.id));
          const extra = (data as NotaResumida[]).filter((n) => !ids.has(n.id));
          pool = [...pool, ...extra];
        }
      }

      // 3) elegir aleatoriamente
      if (pool.length > 0 && !cancelled) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        setNota(pool[randomIndex]);
      }
    }

    fetchRandomRelated();

    return () => {
      cancelled = true;
    };
  }, [noticiaId, categoriaId]);

  if (!nota) return null;

  const fecha = new Date(
    nota.fecha_publicacion || nota.created_at
  ).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <section className="mt-14 mb-6">
      <Link
        href={`/nota/${nota.slug}`}
        className="group block relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-primary/15 via-background to-secondary/20 px-5 py-7 sm:px-7 sm:py-9 md:px-9 md:py-10 shadow-lg hover:shadow-2xl transition-shadow"
      >
        {/* Glow de fondo */}
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-primary/25 blur-3xl" />
          <div className="absolute -left-24 bottom-0 h-48 w-48 rounded-full bg-secondary/25 blur-3xl" />
        </div>

        {/* Cintillo */}
        <div className="relative mb-5">
          <span className="inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-1 text-[11px] font-semibold tracking-widest uppercase shadow-sm">
            Quizás te interese esta historia
          </span>
        </div>

        {/* Contenido */}
        <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">

          {/* Imagen */}
          {nota.imagen_url && (
            <div className="relative w-full md:w-72 lg:w-80 aspect-[16/10] md:aspect-[4/3] rounded-xl overflow-hidden border border-news-border/70 shadow-md flex-shrink-0">
              <Image
                src={nota.imagen_url}
                alt={nota.titulo}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* Texto */}
          <div className="flex-1 flex flex-col justify-between gap-4 md:gap-5 mt-2 md:mt-0">
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-headline-primary leading-snug group-hover:text-primary transition-colors">
                {nota.titulo}
              </h2>

              {nota.resumen && (
                <p className="text-sm md:text-base text-text-secondary line-clamp-4 md:line-clamp-3">
                  {nota.resumen}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                {fecha}
              </p>

              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs md:text-sm font-semibold text-primary-foreground group-hover:bg-primary/90 transition-colors">
                Leer esta historia
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default HighlightedRelatedStory;
