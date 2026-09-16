// src/app/nota/[slug]/view.tsx
"use client";

import Image from "next/image";

export type Nota = {
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

type NoticiaViewProps = {
  nota: Nota;
  showBackLink?: boolean;
};

export function NoticiaView({ nota, showBackLink = false }: NoticiaViewProps) {
  const fecha = new Date(
    nota.fecha_publicacion || nota.created_at
  ).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="mx-auto w-full max-w-3xl">
      {showBackLink && (
        <a
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
        >
          ← Volver al inicio
        </a>
      )}

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {nota.titulo || "Título de la noticia"}
        </h1>

        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <time>{fecha}</time>
          {nota.autor && (
            <>
              <span>•</span>
              <span>Por {nota.autor}</span>
            </>
          )}
        </div>
      </header>

      {nota.imagen_url && (
        <figure className="mb-8 rounded-lg overflow-hidden border">
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={nota.imagen_url}
              alt={nota.titulo}
              fill
              className="object-cover"
            />
          </div>
        </figure>
      )}

      {nota.resumen && (
        <div className="bg-muted/50 border-l-4 border-primary p-6 mb-8 rounded-r-lg">
          <p className="text-lg italic">{nota.resumen}</p>
        </div>
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: nota.contenido ?? "" }}
      />
    </article>
  );
}
