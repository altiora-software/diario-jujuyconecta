"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Globe2,
  Shield,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { matches } from "../fixture/data/matches";
import { getFlagUrl } from "../fixture/data/team-flags";
import {
  cleanText,
  formatHeroMatchDate,
  formatMatchTime,
  getArgentinaGroup,
  getArgentinaGroupTeams,
  getMatchesForToday,
  getNextArgentinaMatch,
  getTournamentSummary,
} from "../fixture/components/fixture-utils";

const ROTATION_INTERVAL = 6000;

type BannerSlide = {
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  teams?: string[];
};

export default function MundialTopBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo(() => buildBannerSlides(), []);
  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (isPaused || slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <section
      className="w-full border-b border-white/10 bg-[#020817] text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-none py-4 sm:py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(16,185,129,0.18),transparent_30%),linear-gradient(90deg,rgba(2,8,23,1),rgba(15,23,42,0.94),rgba(2,8,23,1))]" />
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,transparent,rgba(16,185,129,0.12))] sm:block" />

          <div className="relative flex min-h-20 flex-col gap-4 sm:min-h-24 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex min-w-0 items-start gap-3 sm:items-center"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 shadow-lg shadow-emerald-950/30 sm:size-14">
                    {activeSlide.icon}
                  </div>

                  <div className="min-w-0">
                    <Badge className="mb-2 border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300 hover:bg-emerald-500/10">
                      ESPECIAL MUNDIAL 2026
                    </Badge>

                    <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                      <h2 className="text-balance text-lg font-black leading-tight tracking-tight text-white sm:text-2xl">
                        {activeSlide.title}
                      </h2>

                      {activeSlide.teams && (
                        <FlagStack teams={activeSlide.teams} />
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-slate-400 sm:text-base">
                      {activeSlide.subtitle}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <Button
              asChild
              className="h-11 w-full shrink-0 rounded-full bg-primary px-6 font-black uppercase tracking-wide text-black shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
            >
              <Link href="/mundial-2026">Ver cobertura</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function buildBannerSlides(): BannerSlide[] {
  const nextArgentinaMatch = getNextArgentinaMatch(matches);
  const todayMatches = getMatchesForToday(matches);
  const argentinaGroup = getArgentinaGroup(matches);
  const argentinaGroupTeams = getArgentinaGroupTeams(matches);
  const tournamentSummary = getTournamentSummary(matches);

  const argentinaTitle = nextArgentinaMatch
    ? `Argentina vs. ${cleanText(
        nextArgentinaMatch.homeTeam === "Argentina"
          ? nextArgentinaMatch.awayTeam
          : nextArgentinaMatch.homeTeam,
      )}`
    : "Argentina ya tiene fixture mundialista";

  const argentinaSubtitle = nextArgentinaMatch
    ? `${formatHeroMatchDate(nextArgentinaMatch.date)} - ${formatMatchTime(
        nextArgentinaMatch.time,
      )} - ${cleanText(nextArgentinaMatch.stadium)}`
    : "Todos los partidos de la Seleccion en la cobertura especial";

  return [
    {
      id: "argentina-next",
      title: argentinaTitle,
      subtitle: argentinaSubtitle,
      icon: <Shield className="h-6 w-6 text-emerald-300 sm:h-7 sm:w-7" />,
      teams: nextArgentinaMatch
        ? [
            cleanText(nextArgentinaMatch.homeTeam),
            cleanText(nextArgentinaMatch.awayTeam),
          ]
        : ["Argentina"],
    },
    {
      id: "today",
      title:
        todayMatches.length === 1
          ? "Hoy se juega 1 partido"
          : `Hoy se juegan ${todayMatches.length} partidos`,
      subtitle:
        todayMatches.length > 0
          ? todayMatches
              .map(
                (match) =>
                  `${formatMatchTime(match.time)} ${cleanText(
                    match.homeTeam,
                  )} vs. ${cleanText(match.awayTeam)}`,
              )
              .join(" | ")
          : "La agenda sigue con el proximo dia de partidos",
      icon: (
        <CalendarDays className="h-6 w-6 text-emerald-300 sm:h-7 sm:w-7" />
      ),
      teams: todayMatches
        .slice(0, 2)
        .flatMap((match) => [cleanText(match.homeTeam), cleanText(match.awayTeam)]),
    },
    {
      id: "argentina-group",
      title: `Argentina integra el ${argentinaGroup}`,
      subtitle: argentinaGroupTeams.join(" | "),
      icon: <UsersRound className="h-6 w-6 text-emerald-300 sm:h-7 sm:w-7" />,
      teams: argentinaGroupTeams,
    },
    {
      id: "summary",
      title: `${tournamentSummary.matchesCount} partidos y ${tournamentSummary.groupsCount} grupos`,
      subtitle: `${tournamentSummary.stadiumsCount} sedes en la agenda completa, desde fase de grupos hasta la final`,
      icon: <Globe2 className="h-6 w-6 text-emerald-300 sm:h-7 sm:w-7" />,
    },
  ];
}

function FlagStack({ teams }: { teams: string[] }) {
  const uniqueTeams = Array.from(new Set(teams)).slice(0, 4);

  return (
    <span className="flex shrink-0 items-center -space-x-1.5">
      {uniqueTeams.map((team) => {
        const flagUrl = getFlagUrl(team);

        if (!flagUrl) {
          return null;
        }

        return (
          <img
            key={team}
            src={flagUrl}
            alt={`Bandera de ${team}`}
            className="h-5 w-7 rounded-[3px] border border-white/30 object-cover shadow-sm shadow-black/30 sm:h-6 sm:w-8"
            loading="lazy"
          />
        );
      })}
    </span>
  );
}
