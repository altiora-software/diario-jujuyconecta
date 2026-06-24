import type { MatchDay } from "./fixture-utils";
import FixtureMatchCard from "./FixtureMatchCard";

type FixtureDaySectionProps = {
  day: MatchDay;
};

export default function FixtureDaySection({ day }: FixtureDaySectionProps) {
  return (
    <section className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-2 border-b border-white/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Jornada
          </p>
          <h2 className="mt-1 text-2xl font-black capitalize tracking-tight text-white sm:text-3xl">
            {day.label}
          </h2>
        </div>

        <span className="text-sm font-semibold text-zinc-400">
          {day.matches.length} partidos
        </span>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {day.matches.map((match) => (
          <FixtureMatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}
