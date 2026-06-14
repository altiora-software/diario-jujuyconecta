import { ArrowDown, CalendarDays, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type FixtureHeroProps = {
  totalMatches: number;
  totalGroups: number;
};

export default function FixtureHero({
  totalMatches,
  totalGroups,
}: FixtureHeroProps) {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,0.16),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,1))]" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div className="max-w-3xl">
          <Badge className="mb-5 border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 hover:bg-emerald-500/10">
            Agenda completa
          </Badge>

          <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
            Fixture Mundial 2026
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Día por día, sede por sede y con el foco puesto en la agenda de
            Argentina: todos los partidos del Mundial 2026 en una guía clara,
            visual y lista para seguir el torneo.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="bg-emerald-500 text-slate-950 hover:bg-emerald-400"
            >
              <a href="#fixture-completo">
                Ver fixture completo
                <ArrowDown className="h-4 w-4" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-cyan-400/40 bg-transparent text-cyan-100 hover:bg-cyan-500/10 hover:text-white"
            >
              <a href="#argentina">Partidos de Argentina</a>
            </Button>
          </div>
        </div>

        <Card className="border-emerald-400/20 bg-slate-900/80 text-white shadow-2xl shadow-emerald-950/30 backdrop-blur">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/10">
              <Trophy className="h-9 w-9 text-emerald-300" />
            </div>

            <div className="grid gap-4">
              <StatRow label="Partidos" value={String(totalMatches)} />
              <StatRow label="Grupos" value={String(totalGroups)} />
              <div className="rounded-md border border-cyan-400/20 bg-cyan-400/10 p-4">
                <div className="flex items-center gap-3 text-cyan-100">
                  <CalendarDays className="h-5 w-5 text-cyan-300" />
                  <span className="text-sm font-bold uppercase tracking-[0.16em]">
                    Calendario oficial
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
      <span className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <span className="text-3xl font-black text-emerald-300">{value}</span>
    </div>
  );
}
