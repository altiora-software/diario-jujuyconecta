type Match = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  time: string;
  stadium: string;
  phase: string;
};

const matches: Match[] = [
  {
    id: 1,
    homeTeam: "Argentina",
    awayTeam: "Marruecos",
    homeFlag: "🇦🇷",
    awayFlag: "🇲🇦",
    time: "13:00",
    stadium: "MetLife Stadium",
    phase: "Fase de grupos",
  },
  {
    id: 2,
    homeTeam: "Brasil",
    awayTeam: "Japón",
    homeFlag: "🇧🇷",
    awayFlag: "🇯🇵",
    time: "16:00",
    stadium: "SoFi Stadium",
    phase: "Fase de grupos",
  },
  {
    id: 3,
    homeTeam: "España",
    awayTeam: "Uruguay",
    homeFlag: "🇪🇸",
    awayFlag: "🇺🇾",
    time: "19:00",
    stadium: "AT&T Stadium",
    phase: "Fase de grupos",
  },
  {
    id: 4,
    homeTeam: "Francia",
    awayTeam: "México",
    homeFlag: "🇫🇷",
    awayFlag: "🇲🇽",
    time: "22:00",
    stadium: "Estadio Azteca",
    phase: "Fase de grupos",
  },
];

export default function MundialTodayMatches() {
  return (
    <section className="w-full bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Mundial 2026
            </p>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Partidos destacados de hoy
            </h2>
          </div>

          <span className="hidden rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 sm:inline-flex">
            En vivo y agenda
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {matches.map((match) => (
            <article
              key={match.id}
              className="group overflow-hidden rounded-lg border border-white/10 bg-zinc-900/80 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-zinc-900"
            >
              <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-zinc-900 to-emerald-500/10 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-200">
                    {match.phase}
                  </span>
                  <time className="text-lg font-black tabular-nums text-cyan-300">
                    {match.time}
                  </time>
                </div>
              </div>

              <div className="space-y-4 p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-white text-2xl shadow-md">
                        {match.homeFlag}
                      </span>
                      <span className="truncate text-base font-bold">
                        {match.homeTeam}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase text-zinc-500">
                      Local
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-full bg-white text-2xl shadow-md">
                        {match.awayFlag}
                      </span>
                      <span className="truncate text-base font-bold">
                        {match.awayTeam}
                      </span>
                    </div>
                    <span className="text-xs font-bold uppercase text-zinc-500">
                      Visitante
                    </span>
                  </div>
                </div>

                <div className="rounded-md border border-white/10 bg-black/25 px-3 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Estadio
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-zinc-200">
                    {match.stadium}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}