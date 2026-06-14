"use client";

import { useEffect, useState } from "react";
import { CalendarClock, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { Match } from "../data/matches";
import {
  cleanText,
  formatMatchTime,
  formatShortMatchDate,
  type MatchDay,
} from "./fixture-utils";

type FixtureHeroCarouselProps = {
  day: MatchDay;
};

export default function FixtureHeroCarousel({ day }: FixtureHeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const matches = day.matches;
  const activeMatch = matches[activeIndex] ?? matches[0];

  useEffect(() => {
    setActiveIndex(0);
  }, [day.date]);

  useEffect(() => {
    if (matches.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % matches.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [matches.length]);

  if (!activeMatch) {
    return null;
  }

  return (
    <div className="relative mt-10 overflow-hidden rounded-lg border border-white/10 bg-zinc-950/55 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Partidos del d&iacute;a
          </p>
          <h2 className="mt-1 text-xl font-black capitalize tracking-tight text-white sm:text-2xl">
            {day.label}
          </h2>
        </div>

        <span className="text-sm font-semibold text-zinc-400">
          {matches.length} partidos
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <article className="rounded-md border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-zinc-900 to-emerald-400/10 p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <Badge className="border border-cyan-400/25 bg-cyan-400/10 text-cyan-100 hover:bg-cyan-400/10">
              {cleanText(activeMatch.group)}
            </Badge>
            <div className="flex items-center gap-2 text-sm font-black tabular-nums text-emerald-200">
              <CalendarClock className="h-4 w-4 text-cyan-300" />
              {formatMatchTime(activeMatch.time)}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <TeamLabel match={activeMatch} side="home" />
            <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs font-black text-zinc-400">
              VS
            </span>
            <TeamLabel match={activeMatch} side="away" />
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-zinc-300">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
            <span>{cleanText(activeMatch.stadium)}</span>
          </div>
        </article>

        <div className="flex gap-2 overflow-x-auto lg:max-w-[16rem] lg:flex-wrap lg:justify-end">
          {matches.map((match, index) => (
            <button
              key={match.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ver partido ${index + 1} del ${formatShortMatchDate(day.date)}`}
              aria-pressed={index === activeIndex}
              className={cn(
                "h-2.5 w-9 shrink-0 rounded-full bg-white/20 transition",
                index === activeIndex && "w-12 bg-emerald-300",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamLabel({ match, side }: { match: Match; side: "home" | "away" }) {
  const isHome = side === "home";
  const name = isHome ? match.homeTeam : match.awayTeam;

  return (
    <span
      className={cn(
        "min-w-0 text-balance text-lg font-black leading-tight text-white sm:text-2xl",
        isHome ? "text-right" : "text-left",
      )}
    >
      {cleanText(name)}
    </span>
  );
}