import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function MundialHero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,1))]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div className="max-w-3xl">
          <Badge className="mb-5 border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 hover:bg-emerald-500/10">
            ESPECIAL MUNDIAL 2026
          </Badge>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Toda la cobertura del Mundial 2026
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Fixture, grupos, resultados, estadísticas y noticias actualizadas
            del torneo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button className="bg-emerald-500 text-slate-950 hover:bg-emerald-400">
              Ver partidos de hoy
            </Button>
            <Button
              variant="outline"
              className="border-emerald-400/40 bg-transparent text-emerald-100 hover:bg-emerald-500/10 hover:text-white"
            >
              Últimas noticias
            </Button>
          </div>
        </div>

        <Card className="border-emerald-400/20 bg-slate-900/80 text-white shadow-2xl shadow-emerald-950/30 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/10">
              <Trophy className="h-9 w-9 text-emerald-300" />
            </div>

            <div className="grid gap-4">
              {[
                ["48", "Selecciones"],
                ["104", "Partidos"],
                ["3", "Países"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
                    {label}
                  </span>
                  <span className="text-3xl font-black text-emerald-300">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}