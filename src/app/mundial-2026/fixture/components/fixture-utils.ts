import type { Match } from "../data/matches";

export type MatchDay = {
  date: string;
  label: string;
  matches: Match[];
};

const mojibakeMap: Record<string, string> = {
  "MÃ©xico": "México",
  "SudÃ¡frica": "Sudáfrica",
  "RepÃºblica de Corea": "República de Corea",
  "RepÃºblica Checa": "República Checa",
  "CanadÃ¡": "Canadá",
  "Estadio Los Ãngeles": "Estadio Los Ángeles",
  "Catar": "Qatar",
  "BahÃ­a": "Bahía",
  "HaitÃ­": "Haití",
  "TurquÃ­a": "Turquía",
  "PaÃ­ses Bajos": "Países Bajos",
  "TÃºnez": "Túnez",
  "EspaÃ±a": "España",
  "BÃ©lgica": "Bélgica",
  "Arabia SaudÃ­": "Arabia Saudí",
  "RI de IrÃ¡n": "RI de Irán",
  "IrÃ¡n": "Irán",
  "PanamÃ¡": "Panamá",
  "UzbekistÃ¡n": "Uzbekistán",
  "JapÃ³n": "Japón",
  "2Âº": "2.º",
  "1Âº": "1.º",
  "3Âº": "3.º",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function cleanText(value: string) {
  return Object.entries(mojibakeMap).reduce(
    (text, [broken, fixed]) => text.replaceAll(broken, fixed),
    value,
  );
}

export function isArgentinaMatch(match: Match) {
  return match.homeTeam === "Argentina" || match.awayTeam === "Argentina";
}

export function formatMatchDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00Z`));
}

export function formatMatchTime(time: string) {
  return time || "A confirmar";
}

export function groupMatchesByDate(matches: Match[]): MatchDay[] {
  const days = matches.reduce<Record<string, Match[]>>((acc, match) => {
    acc[match.date] = [...(acc[match.date] ?? []), match];
    return acc;
  }, {});

  return Object.entries(days)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, dayMatches]) => ({
      date,
      label: formatMatchDate(date),
      matches: dayMatches.sort((a, b) => {
        const timeA = a.time || "99:99";
        const timeB = b.time || "99:99";
        return timeA.localeCompare(timeB);
      }),
    }));
}
