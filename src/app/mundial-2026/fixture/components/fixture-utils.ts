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
  return Object.entries(mojibakeMap).reduce(
    (text, [broken, fixed]) => text.replaceAll(broken, fixed),
    value,
  );
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
  const today = new Date();

  const todayString =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  return matches.filter(
    (match) => match.date === todayString
  );
}