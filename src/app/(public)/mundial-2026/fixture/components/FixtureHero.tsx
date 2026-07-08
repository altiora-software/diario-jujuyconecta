import { CalendarDays, Trophy } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import type { Match } from "../data/matches";
import {
  formatHeroMatchDate,
  formatMatchTime,
  type MatchDay,
} from "./fixture-utils";
import FixtureHeroActions from "./FixtureHeroActions";
import FixtureHeroCarousel from "./FixtureHeroCarousel";
import { getFlagUrl } from "../data/team-flags";

type FixtureHeroProps = {
  featuredDay: MatchDay;
  nextArgentinaMatch?: Match;
};

export default function FixtureHero({
  featuredDay,
  nextArgentinaMatch,
}: FixtureHeroProps) {
  const argentinaDate = nextArgentinaMatch
    ? `${formatHeroMatchDate(nextArgentinaMatch.date)} - ${formatMatchTime(
      nextArgentinaMatch.time,
    )}`
    : "A confirmar";

  const currentStage = featuredDay.matches[0]?.group ?? "Mundial 2026";

  const argentinaMatchLabel = nextArgentinaMatch
    ? `${nextArgentinaMatch.homeTeam} vs ${nextArgentinaMatch.awayTeam}`
    : "A confirmar";

  const homeFlag = nextArgentinaMatch
    ? getFlagUrl(nextArgentinaMatch.homeTeam)
    : null;

  const awayFlag = nextArgentinaMatch
    ? getFlagUrl(nextArgentinaMatch.awayTeam)
    : null;

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(16,185,129,0.22),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(6,182,212,0.16),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,1))]" />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <Badge className="mb-5 border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300 hover:bg-emerald-500/10">
              Agenda completa
            </Badge>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Fixture Mundial 2026
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              D&iacute;a por d&iacute;a, sede por sede y con el foco puesto en la
              agenda de Argentina: todos los partidos del Mundial 2026 en una
              gu&iacute;a clara, visual y lista para seguir el torneo.
            </p>

            <FixtureHeroActions />
          </div>
          {/* CARD DERECHA  */}
          <Card className="border-emerald-400/20 bg-slatz-900/80 text-white shadow-2xl shadow-emerald-950/30 backdrop-blur">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-500/10">
                  <Trophy className="h-9 w-9 text-emerald-300" />
                </div>

                {nextArgentinaMatch && (
                  <div className="flex items-center gap-3">
                    {homeFlag && (
                      <img
                        src={homeFlag}
                        alt={nextArgentinaMatch.homeTeam}
                        className="h-8 w-11 rounded border border-white/20 object-cover"
                      />
                    )}

                    <span className="text-sm font-black text-slate-400">VS</span>

                    {awayFlag && (
                      <img
                        src={awayFlag}
                        alt={nextArgentinaMatch.awayTeam}
                        className="h-8 w-11 rounded border border-white/20 object-cover"
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <StatRow
                  label="Fase actual"
                  value={currentStage}
                />

                <StatRow
                  label="Próximo partido"
                  value={argentinaDate}
                />

                <StatRow
                  label="Argentina"
                  value={argentinaMatchLabel}
                />

                <div className="rounded-md border border-cyan-400/20 bg-cyan-400/10 p-4">
                  <div className="flex items-center gap-3 text-cyan-100">
                    <CalendarDays className="h-5 w-5 text-cyan-300" />

                    <span className="text-sm font-bold uppercase tracking-[0.16em]">
                      Cobertura actualizada
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <FixtureHeroCarousel day={featuredDay} />
      </div>
    </section>
  );
}

function StatRow({
  label,
  value,
}: {
  label: ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-slate-800 pb-4">
      <span className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>

      <span className="max-w-[60%] text-right text-lg font-bold leading-tight text-emerald-300 sm:text-xl">
        {value}
      </span>
    </div>
  );
}
