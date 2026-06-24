import { CalendarClock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Match } from "../data/matches";
import { getFlagUrl } from "../data/team-flags";
import { cleanText, formatMatchTime, isArgentinaMatch } from "./fixture-utils";

type FixtureMatchCardProps = {
  match: Match;
  compact?: boolean;
};

export default function FixtureMatchCard({
  match,
  compact = false,
}: FixtureMatchCardProps) {
  const argentinaMatch = isArgentinaMatch(match);

  return (
    <Card
      className={cn(
        "group overflow-hidden border-white/10 bg-zinc-900/80 text-white shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/45",
        argentinaMatch &&
          "border-emerald-300/45 bg-gradient-to-br from-emerald-500/15 via-zinc-900 to-cyan-500/10 shadow-emerald-950/30",
      )}
    >
      <CardContent className={cn("p-0", compact && "h-full")}>
        <div
          className={cn(
            "flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3",
            argentinaMatch &&
              "bg-gradient-to-r from-emerald-400/20 via-cyan-400/10 to-transparent",
          )}
        >
          <Badge className="border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/10">
            {cleanText(match.group)}
          </Badge>

          <div className="flex items-center gap-2 text-sm font-black tabular-nums text-emerald-200">
            <CalendarClock className="h-4 w-4 text-cyan-300" />
            <time>{formatMatchTime(match.time)}</time>
          </div>
        </div>

        <div className="space-y-5 p-4 sm:p-5">
          {argentinaMatch && (
            <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200">
              Juega Argentina
            </span>
          )}

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamName name={cleanText(match.homeTeam)} align="right" />
            <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black text-zinc-400">
              VS
            </span>
            <TeamName name={cleanText(match.awayTeam)} align="left" />
          </div>

          <div className="flex items-start gap-2 rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-zinc-300">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
            <span className="leading-5">{cleanText(match.stadium)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamName({
  name,
  align,
}: {
  name: string;
  align: "left" | "right";
}) {
  const flagUrl = getFlagUrl(name);

  return (
    <span
      className={cn(
        "flex min-w-0 items-center gap-2 text-base font-black leading-tight text-white sm:text-lg",
        align === "right"
          ? "justify-end text-right"
          : "justify-start text-left",
      )}
    >
      {align === "right" && <FlagImage url={flagUrl} team={name} />}
      <span className="min-w-0 text-balance">{name}</span>
      {align === "left" && <FlagImage url={flagUrl} team={name} />}
    </span>
  );
}

function FlagImage({ url, team }: { url: string | null; team: string }) {
  if (!url) {
    return null;
  }

  return (
    <img
      src={url}
      alt={`Bandera de ${team}`}
      className="h-5 w-7 shrink-0 rounded-[3px] border border-white/20 object-cover shadow-sm shadow-black/30 sm:h-6 sm:w-8"
      loading="lazy"
    />
  );
}
