import { Flag, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { Match } from "../data/matches";
import { getFlagUrl } from "../data/team-flags";
import FixtureMatchCard from "./FixtureMatchCard";

type FixtureArgentinaProps = {
  matches: Match[];
};

export default function FixtureArgentina({ matches }: FixtureArgentinaProps) {
  const argentinaFlagUrl = getFlagUrl("Argentina");

  if (matches.length === 0) {
    return null;
  }

  return (
    <section
      id="argentina"
      className="relative overflow-hidden rounded-lg border border-emerald-300/20 bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-cyan-500/10 p-4 shadow-2xl shadow-emerald-950/20 sm:p-6 lg:p-8"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <Badge className="mb-4 border border-emerald-300/30 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/10">
            {argentinaFlagUrl ? (
              <img
                src={argentinaFlagUrl}
                alt="Bandera de Argentina"
                className="mr-2 h-3.5 w-5 rounded-[2px] border border-white/20 object-cover"
                loading="lazy"
              />
            ) : (
              <Flag className="mr-2 h-3.5 w-3.5" />
            )}
            Selección Argentina
          </Badge>

          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            La agenda de la Scaloneta
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
            Los cruces de Argentina aparecen destacados para seguir el camino
            del campeón defensor desde la fase de grupos.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          {matches.length} partidos
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {matches.map((match) => (
          <FixtureMatchCard key={match.id} match={match} compact />
        ))}
      </div>
    </section>
  );
}