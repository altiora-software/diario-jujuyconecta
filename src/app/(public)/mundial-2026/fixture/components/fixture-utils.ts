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

const shortDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const heroDateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export function cleanText(value: string) {
  const normalized = Object.entries(mojibakeMap).reduce(
    (text, [broken, fixed]) => text.replaceAll(broken, fixed),
    value,
  );

  if (!/[ÃÂ]/.test(normalized)) {
    return normalized;
  }

  try {
    const bytes = Uint8Array.from(normalized, (char) => char.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true })
      .decode(bytes)
      .replaceAll("1º", "1.º")
      .replaceAll("2º", "2.º")
      .replaceAll("3º", "3.º");
  } catch {
    return normalized;
  }
}

function getMatchDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function sortMatchesByTime(matches: Match[]) {
  return [...matches].sort((a, b) => {
    const timeA = a.time || "99:99";
    const timeB = b.time || "99:99";
    return timeA.localeCompare(timeB) || a.id - b.id;
  });
}

function sortMatchesBySchedule(matches: Match[]) {
  return [...matches].sort((a, b) => {
    const timeA = a.time || "99:99";
    const timeB = b.time || "99:99";
    return (
      a.date.localeCompare(b.date) ||
      timeA.localeCompare(timeB) ||
      a.id - b.id
    );
  });
}

export function isArgentinaMatch(match: Match) {
  return match.homeTeam === "Argentina" || match.awayTeam === "Argentina";
}

export function formatMatchDate(date: string) {
  return dateFormatter.format(new Date(`${date}T12:00:00Z`));
}

export function formatShortMatchDate(date: string) {
  return cleanText(shortDateFormatter.format(new Date(`${date}T12:00:00Z`)));
}

export function formatHeroMatchDate(date: string) {
  return cleanText(heroDateFormatter.format(new Date(`${date}T12:00:00Z`)));
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
      matches: sortMatchesByTime(dayMatches),
    }));
}

export function getMatchesForDate(matches: Match[], date = getMatchDateKey()) {
  return sortMatchesByTime(matches.filter((match) => match.date === date));
}

export function getCurrentOrNextMatchDay(matches: Match[], date = getMatchDateKey()) {
  const matchDays = groupMatchesByDate(matches);
  const currentDay = matchDays.find((day) => day.date === date);

  if (currentDay) {
    return currentDay;
  }

  return (
    matchDays.find((day) => day.date > date) ?? matchDays[matchDays.length - 1]
  );
}

export function getNextArgentinaMatch(matches: Match[], date = getMatchDateKey()) {
  return sortMatchesBySchedule(matches.filter(isArgentinaMatch)).find(
    (match) => match.date >= date,
  );
}

export function getArgentinaGroup(matches: Match[]) {
  return cleanText(matches.find(isArgentinaMatch)?.group ?? "A confirmar");
}

export function getMatchesForToday(matches: Match[]) {
  return getMatchesForDate(matches);
}

export function getArgentinaGroupTeams(matches: Match[]) {
  const argentinaGroup = getArgentinaGroup(matches);
  const teams = matches
    .filter((match) => cleanText(match.group) === argentinaGroup)
    .flatMap((match) => [cleanText(match.homeTeam), cleanText(match.awayTeam)])
    .filter((team) => !/Grupo|Ganador|Perdedor/.test(team));

  return Array.from(new Set(teams));
}

export function getTournamentSummary(matches: Match[]) {
  const groups = new Set(
    matches
      .map((match) => cleanText(match.group))
      .filter((group) => group.startsWith("Grupo ")),
  );
  const stadiums = new Set(matches.map((match) => cleanText(match.stadium)));

  return {
    matchesCount: matches.length,
    groupsCount: groups.size,
    stadiumsCount: stadiums.size,
  };
}
