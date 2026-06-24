import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Team = {
  name: string;
  score?: number;
  winner?: boolean;
};

type Match = {
  id: string;
  date: string;
  venue: string;
  teams: [Team, Team];
};

type BracketRound = {
  title: string;
  shortTitle: string;
  matches: Match[];
};

const bracketRounds: BracketRound[] = [
  {
    title: "Octavos",
    shortTitle: "8vos",
    matches: [
      {
        id: "r16-1",
        date: "29 JUN",
        venue: "Ciudad de Mexico",
        teams: [
          { name: "Argentina", score: 2, winner: true },
          { name: "Dinamarca", score: 0 },
        ],
      },
      {
        id: "r16-2",
        date: "29 JUN",
        venue: "Dallas",
        teams: [
          { name: "Francia", score: 1 },
          { name: "Croacia", score: 2, winner: true },
        ],
      },
      {
        id: "r16-3",
        date: "30 JUN",
        venue: "Miami",
        teams: [
          { name: "Brasil", score: 3, winner: true },
          { name: "Japon", score: 1 },
        ],
      },
      {
        id: "r16-4",
        date: "30 JUN",
        venue: "Atlanta",
        teams: [
          { name: "Portugal", score: 2, winner: true },
          { name: "Uruguay", score: 1 },
        ],
      },
      {
        id: "r16-5",
        date: "01 JUL",
        venue: "Los Angeles",
        teams: [
          { name: "Espana", score: 1, winner: true },
          { name: "Marruecos", score: 0 },
        ],
      },
      {
        id: "r16-6",
        date: "01 JUL",
        venue: "Toronto",
        teams: [
          { name: "Inglaterra", score: 2, winner: true },
          { name: "Colombia", score: 1 },
        ],
      },
      {
        id: "r16-7",
        date: "02 JUL",
        venue: "Houston",
        teams: [
          { name: "Alemania", score: 1 },
          { name: "Mexico", score: 2, winner: true },
        ],
      },
      {
        id: "r16-8",
        date: "02 JUL",
        venue: "Vancouver",
        teams: [
          { name: "Paises Bajos", score: 2, winner: true },
          { name: "Estados Unidos", score: 1 },
        ],
      },
    ],
  },
  {
    title: "Cuartos",
    shortTitle: "4tos",
    matches: [
      {
        id: "qf-1",
        date: "04 JUL",
        venue: "Boston",
        teams: [
          { name: "Argentina", score: 1, winner: true },
          { name: "Croacia", score: 0 },
        ],
      },
      {
        id: "qf-2",
        date: "04 JUL",
        venue: "Kansas City",
        teams: [
          { name: "Brasil", score: 2, winner: true },
          { name: "Portugal", score: 1 },
        ],
      },
      {
        id: "qf-3",
        date: "05 JUL",
        venue: "Nueva York / Nueva Jersey",
        teams: [
          { name: "Espana", score: 2 },
          { name: "Inglaterra", score: 3, winner: true },
        ],
      },
      {
        id: "qf-4",
        date: "05 JUL",
        venue: "Seattle",
        teams: [
          { name: "Mexico", score: 1 },
          { name: "Paises Bajos", score: 2, winner: true },
        ],
      },
    ],
  },
  {
    title: "Semifinal",
    shortTitle: "Semi",
    matches: [
      {
        id: "sf-1",
        date: "08 JUL",
        venue: "Dallas",
        teams: [
          { name: "Argentina", score: 2, winner: true },
          { name: "Brasil", score: 1 },
        ],
      },
      {
        id: "sf-2",
        date: "09 JUL",
        venue: "Atlanta",
        teams: [
          { name: "Inglaterra", score: 1 },
          { name: "Paises Bajos", score: 2, winner: true },
        ],
      },
    ],
  },
  {
    title: "Final",
    shortTitle: "Final",
    matches: [
      {
        id: "final",
        date: "12 JUL",
        venue: "Nueva York / Nueva Jersey",
        teams: [
          { name: "Argentina", score: 3, winner: true },
          { name: "Paises Bajos", score: 2 },
        ],
      },
    ],
  },
];

function MatchCard({ match }: { match: Match }) {
  return (
    <article className="relative overflow-hidden rounded-lg border border-white/10 bg-zinc-900/90 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-3 py-2">
        <span className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
          {match.date}
        </span>
        <span className="max-w-[58%] truncate text-[10px] font-bold uppercase tracking-[0.12em] text-zinc-500">
          {match.venue}
        </span>
      </div>

      <div className="divide-y divide-white/10">
        {match.teams.map((team) => (
          <div
            key={team.name}
            className={`flex items-center justify-between gap-3 px-3 py-3 ${
              team.winner ? "bg-emerald-400/[0.08]" : "bg-transparent"
            }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  team.winner ? "bg-emerald-300" : "bg-zinc-700"
                }`}
              />
              <span
                className={`truncate text-sm ${
                  team.winner
                    ? "font-black text-white"
                    : "font-semibold text-zinc-400"
                }`}
              >
                {team.name}
              </span>
            </div>
            <span
              className={`text-lg font-black tabular-nums ${
                team.winner ? "text-emerald-200" : "text-zinc-500"
              }`}
            >
              {team.score ?? "-"}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function MundialBracket() {
  return (
    <section className="w-full bg-zinc-950 px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Eliminacion directa
            </p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Llave del Mundial 2026
            </h2>
          </div>

          <Badge className="w-fit border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-zinc-200 hover:bg-white/10">
            Datos mock
          </Badge>
        </div>

        <div className="pb-2">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
            {bracketRounds.map((round) => (
              <div key={round.title} className="flex flex-col">
                <div className="mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-gradient-to-r from-cyan-500/15 via-zinc-900 to-emerald-500/10 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                      Ronda
                    </p>
                    <h3 className="text-lg font-black tracking-tight">
                      {round.title}
                    </h3>
                  </div>
                  <span className="grid size-9 place-items-center rounded-full bg-white/10">
                    <Trophy className="h-4 w-4 text-cyan-300" />
                  </span>
                </div>

                <div
                  className={`relative flex flex-1 flex-col justify-around gap-4 ${
                    round.matches.length === 1 ? "xl:py-28" : ""
                  } ${round.matches.length === 2 ? "xl:py-16" : ""} ${
                    round.matches.length === 4 ? "xl:py-8" : ""
                  }`}
                >
                  {round.matches.map((match) => (
                    <div key={match.id} className="relative">
                      {round.shortTitle !== "Final" && (
                        <span className="absolute -right-5 top-1/2 hidden h-px w-5 bg-white/15 xl:block" />
                      )}
                      <MatchCard match={match} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
