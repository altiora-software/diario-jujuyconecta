import FixtureArgentina from "./components/FixtureArgentina";
import FixtureDateSelector from "./components/FixtureDateSelector";
import FixtureHero from "./components/FixtureHero";
import {
  getArgentinaGroup,
  getCurrentOrNextMatchDay,
  getNextArgentinaMatch,
  groupMatchesByDate,
  isArgentinaMatch,
} from "./components/fixture-utils";
import { matches } from "./data/matches";

export default function FixturePage() {
  const argentinaMatches = matches.filter(isArgentinaMatch);
  const matchDays = groupMatchesByDate(matches);
  const featuredDay = getCurrentOrNextMatchDay(matches);
  const nextArgentinaMatch = getNextArgentinaMatch(matches);
  const argentinaGroup = getArgentinaGroup(matches);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <FixtureHero
        argentinaGroup={argentinaGroup}
        featuredDay={featuredDay}
        nextArgentinaMatch={nextArgentinaMatch}
      />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <FixtureArgentina matches={argentinaMatches} />

        <section id="fixture-completo" className="space-y-8">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Calendario completo
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Explor&aacute; el fixture por fecha
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              Seleccion&aacute; una jornada para ver solo los partidos de ese d&iacute;a y
              moverte por el calendario sin recorrer una lista interminable.
            </p>
          </div>

          <FixtureDateSelector days={matchDays} />
        </section>
      </div>
    </main>
  );
}
