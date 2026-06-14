import { matches } from "./data/matches";
import FixtureArgentina from "./components/FixtureArgentina";
import FixtureDaySection from "./components/FixtureDaySection";
import FixtureHero from "./components/FixtureHero";
import { groupMatchesByDate, isArgentinaMatch } from "./components/fixture-utils";

export default function FixturePage() {
  const totalGroups = new Set(
    matches
      .filter((match) => match.group.startsWith("Grupo "))
      .map((match) => match.group),
  ).size;
  const argentinaMatches = matches.filter(isArgentinaMatch);
  const matchDays = groupMatchesByDate(matches);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <FixtureHero totalMatches={matches.length} totalGroups={totalGroups} />

      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <FixtureArgentina matches={argentinaMatches} />

        <section id="fixture-completo" className="space-y-8">
          <div className="max-w-3xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Calendario completo
            </p>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Todos los partidos, agrupados por fecha
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
              La agenda se ordena automáticamente por día para seguir la fase de
              grupos y el cuadro final sin perder detalle.
            </p>
          </div>

          <div className="space-y-10">
            {matchDays.map((day) => (
              <FixtureDaySection key={day.date} day={day} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
