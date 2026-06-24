import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type TeamStanding = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
};
type GroupStanding = {
  group: string;
  teams: TeamStanding[];
};
const groups: GroupStanding[] = [
  {
    group: "Grupo A",
    teams: [
      { team: "Mexico", played: 3, won: 2, drawn: 1, lost: 0, points: 7 },
      { team: "Suiza", played: 3, won: 1, drawn: 2, lost: 0, points: 5 },
      { team: "Egipto", played: 3, won: 1, drawn: 0, lost: 2, points: 3 },
      { team: "Nueva Zelanda", played: 3, won: 0, drawn: 1, lost: 2, points: 1 },
    ],
  },
  {
    group: "Grupo B",
    teams: [
      { team: "Argentina", played: 3, won: 3, drawn: 0, lost: 0, points: 9 },
      { team: "Marruecos", played: 3, won: 1, drawn: 1, lost: 1, points: 4 },
      { team: "Japon", played: 3, won: 1, drawn: 0, lost: 2, points: 3 },
      { team: "Escocia", played: 3, won: 0, drawn: 1, lost: 2, points: 1 },
    ],
  },
  {
    group: "Grupo C",
    teams: [
      { team: "Brasil", played: 3, won: 2, drawn: 1, lost: 0, points: 7 },
      { team: "Croacia", played: 3, won: 2, drawn: 0, lost: 1, points: 6 },
      { team: "Canada", played: 3, won: 1, drawn: 0, lost: 2, points: 3 },
      { team: "Ghana", played: 3, won: 0, drawn: 1, lost: 2, points: 1 },
    ],
  },
  {
    group: "Grupo D",
    teams: [
      { team: "Francia", played: 3, won: 2, drawn: 1, lost: 0, points: 7 },
      { team: "Uruguay", played: 3, won: 1, drawn: 2, lost: 0, points: 5 },
      { team: "Corea del Sur", played: 3, won: 1, drawn: 0, lost: 2, points: 3 },
      { team: "Sudafrica", played: 3, won: 0, drawn: 1, lost: 2, points: 1 },
    ],
  },
];
const columns = ["PJ", "G", "E", "P", "PTS"];

export default function MundialGroups() {
  return (
    <section className="w-full bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Mundial 2026
            </p>
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
              Tablas de posiciones
            </h2>
          </div>
      <Badge className="w-fit border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200 hover:bg-emerald-400/10">
        Fase de grupos
      </Badge>
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      {groups.map((group) => (
        <Card
          key={group.group}
          className="overflow-hidden rounded-lg border-white/10 bg-zinc-900/80 text-white shadow-xl shadow-black/20"
        >
          <CardHeader className="border-b border-white/10 bg-gradient-to-r from-cyan-500/15 via-zinc-900 to-emerald-500/10 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-lg font-black tracking-tight">
                <span className="grid size-9 place-items-center rounded-full bg-white/10">
                  <Trophy className="h-4 w-4 text-cyan-300" />
                </span>
                {group.group}
              </CardTitle>

              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-zinc-300">
                Mock
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-black/25 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    <th className="px-4 py-3 text-left font-black">
                      Equipo
                    </th>
                    {columns.map((column) => (
                      <th
                        key={column}
                        className="w-14 px-2 py-3 text-center font-black"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {group.teams.map((team, index) => (
                    <tr
                      key={team.team}
                      className="border-b border-white/10 last:border-b-0 hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-black ${
                              index < 2
                                ? "bg-emerald-400 text-zinc-950"
                                : "bg-white/10 text-zinc-300"
                            }`}
                          >
                            {index + 1}
                          </span>
                          <span className="truncate font-bold text-zinc-100">
                            {team.team}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 text-center font-semibold tabular-nums text-zinc-300">
                        {team.played}
                      </td>
                      <td className="px-2 py-3 text-center font-semibold tabular-nums text-zinc-300">
                        {team.won}
                      </td>
                      <td className="px-2 py-3 text-center font-semibold tabular-nums text-zinc-300">
                        {team.drawn}
                      </td>
                      <td className="px-2 py-3 text-center font-semibold tabular-nums text-zinc-300">
                        {team.lost}
                      </td>
                      <td className="px-2 py-3 text-center font-black tabular-nums text-cyan-300">
                        {team.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
)}