// src/app/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import SocialSidebar from "@/components/SocialSidebar";
import RadioPlayer from "@/components/RadioPlayer";
import Ticker from "@/components/Ticker";
import { Card, CardContent } from "@/components/ui/card";
import type { Database } from "@/integrations/supabase/supabase";

// 👇 Cliente SERVER-SIDE (sin localStorage, sin import.meta.env)
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
  const secundarias = noticias.slice(1, 4);
  const resto = noticias.slice(4);

  return (
    <div className="min-h-screen bg-background">
      <SocialSidebar />

      <section className="border-b bg-muted/40">
        <div className="container mx-auto px-4 py-6 flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-1">
              Diario digital de Jujuy
            </p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight text-headline-primary">
              Jujuy Conecta Diario
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl">
              Noticias de Jujuy y Argentina, con foco en transporte, obras,
              comunidad y todo lo que pasa en la provincia.
            </p>
          </div>

          <div className="w-full lg:w-[340px] flex flex-col gap-3">
            <div className="rounded-lg border bg-background p-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Radio en vivo
              </h2>
              <RadioPlayer />
            </div>
            <div className="rounded-lg border bg-background p-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Último momento
              </h2>
              <Ticker
                noticias={noticias.map((n) => ({
                  id: n.id,
                  titulo: n.titulo,
                }))}
              />
            </div>
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
                        <p className="text-sm md:text-base text-muted-foreground line-clamp-3">
                          {principal.resumen}
                        </p>
                      )}
                      <time className="text-xs text-muted-foreground">
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
              {secundarias.map((nota) => (
                <Link href={`/nota/${nota.slug}`} key={nota.id} >
                  <Card className="h-full hover:bg-muted/60 transition-colors">
                    <CardContent className="p-3 flex gap-3">
                      {nota.imagen_url && (
                        <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={nota.imagen_url}
                            alt={nota.titulo}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-2">
                          {nota.titulo}
                        </h3>
                        <time className="text-[11px] text-muted-foreground">
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
            </aside>
          </section>
        )}

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

        {resto.length > 0 && (
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
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                            {nota.resumen}
                          </p>
                        )}
                        <time className="text-xs text-muted-foreground mt-auto">
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
        )}
      </main>
    </div>
  );
}
