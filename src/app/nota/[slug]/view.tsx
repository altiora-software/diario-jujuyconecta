// src/app/nota/[slug]/view.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import RecentNewsList from "@/components/RecentNewsList";
import Script from "next/script";

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
};

export function NoticiaView({ nota }: NoticiaViewProps) {
  const [isLogged, setIsLogged] = useState(false);
  const [fromAdmin, setFromAdmin] = useState(false);
  const pathname = usePathname();

  // Chequeo de sesión (como antes)
  useEffect(() => { 
    supabase.auth.getUser().then((result: { data: { user: any; }; }) => {
      const user = (result.data && 'user' in result.data) ? result.data.user : undefined;
      setIsLogged(!!user);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setFromAdmin(params.get("from") === "admin");
  }, [pathname]);

  const mostrarLinkAdmin = isLogged || fromAdmin;

  const fechaISO = new Date(
    nota.fecha_publicacion || nota.created_at
  ).toISOString();

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: nota.titulo,
    datePublished: fechaISO,
    dateModified: fechaISO,
    description:
      nota.resumen ??
      (nota.contenido
        ? nota.contenido.replace(/<[^>]+>/g, "").slice(0, 160)
        : ""),
    image: nota.imagen_url ? [nota.imagen_url] : undefined,
    author: nota.autor
      ? { "@type": "Person", name: nota.autor }
      : { "@type": "Organization", name: "Jujuy Conecta Diario" },
    publisher: {
      "@type": "Organization",
      name: "Jujuy Conecta Diario",
      logo: {
        "@type": "ImageObject",
        url: "https://jujuyconecta.online/diario/jc-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://jujuyconecta.online/diario/nota/${nota.slug}`,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://jujuyconecta.online/diario",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Noticias",
        item: "https://jujuyconecta.online/diario",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: nota.titulo,
        item: `https://jujuyconecta.online/diario/nota/${nota.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {mostrarLinkAdmin && (
        <div className="container mx-auto px-4 pt-6">
          <Link
            href="/admin"
            className="inline-flex items-center px-3 py-1.5 rounded-md border text-sm hover:bg-accent"
          >
            ← Ir al panel
          </Link>
        </div>
      )}

      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* MAIN */}
          <article className="xl:col-span-8 mx-auto w-full">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-primary hover:underline mb-6"
            >
              ← Volver al inicio
            </Link>

            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
                {nota.titulo}
              </h1>

              <div className="flex items-center gap-4 text-muted-foreground text-sm">
                <time dateTime={nota.fecha_publicacion || nota.created_at}>
                  {new Date(
                    nota.fecha_publicacion || nota.created_at
                  ).toLocaleDateString("es-AR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
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
                <img
                  src={nota.imagen_url}
                  alt={nota.titulo}
                  className="w-full h-auto object-cover"
                />
              </figure>
            )}

            {nota.resumen && (
              <div className="bg-muted/50 border-l-4 border-primary p-6 mb-8 rounded-r-lg">
                <p className="text-lg text-foreground/80 leading-relaxed italic">
                  {nota.resumen}
                </p>
              </div>
            )}

            <div className="mx-auto max-w-[72ch]">
              <div
                className="prose prose-lg max-w-none text-foreground leading-relaxed prose-headings:text-foreground prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: nota.contenido ?? "" }}
              />
            </div>
          </article>

          {/* ASIDE */}
          <aside className="xl:col-span-4">
            <div className="sticky top-28">
              <RecentNewsList />
            </div>
          </aside>
        </div>
        <Script
          id="ld-article"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdArticle),
          }}
        />
        <Script
          id="ld-breadcrumb"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdBreadcrumb),
          }}
        />
      </main>
    </div>
  );
}
