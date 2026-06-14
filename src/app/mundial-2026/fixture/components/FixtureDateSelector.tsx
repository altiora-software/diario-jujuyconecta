"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";

import FixtureDaySection from "./FixtureDaySection";
import type { MatchDay } from "./fixture-utils";
import { formatShortMatchDate } from "./fixture-utils";

type FixtureDateSelectorProps = {
  days: MatchDay[];
};

export default function FixtureDateSelector({ days }: FixtureDateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(days[0]?.date ?? "");
  const selectedDay = days.find((day) => day.date === selectedDate) ?? days[0];

  if (!selectedDay) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-white/10 bg-zinc-900/70 p-3 shadow-xl shadow-black/20">
        <div className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          <CalendarDays className="h-4 w-4" />
          Eleg&iacute; una fecha
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const selected = day.date === selectedDate;

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDate(day.date)}
                className={cn(
                  "shrink-0 rounded-md border px-4 py-3 text-left transition duration-200",
                  "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-white",
                  selected &&
                    "border-emerald-300/60 bg-emerald-300/15 text-white shadow-lg shadow-emerald-950/30",
                )}
                aria-pressed={selected}
              >
                <span className="block text-sm font-black capitalize">
                  {formatShortMatchDate(day.date)}
                </span>
                <span className="mt-1 block text-xs font-semibold text-zinc-500">
                  {day.matches.length} partidos
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <FixtureDaySection day={selectedDay} />
    </div>
  );
}
