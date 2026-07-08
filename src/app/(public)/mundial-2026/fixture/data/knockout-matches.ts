export type Match = {
    id: number;
    date: string;
    time: string;
    homeTeam: string;
    awayTeam: string;
    stadium: string;
    group: string;
  };

  
export const knockoutMatches: Match[] = [
    {
      id: 97,
      date: "2026-07-09",
      time: "17:00",
      homeTeam: "Francia",
      awayTeam: "Marruecos",
      stadium: "Estadio Boston",
      group: "Cuartos de final",
    },
    {
      id: 98,
      date: "2026-07-10",
      time: "16:00",
      homeTeam: "España",
      awayTeam: "Bélgica",
      stadium: "Estadio Los Ángeles",
      group: "Cuartos de final",
    },
    {
      id: 99,
      date: "2026-07-11",
      time: "18:00",
      homeTeam: "Noruega",
      awayTeam: "Inglaterra",
      stadium: "Estadio Miami",
      group: "Cuartos de final",
    },
    {
      id: 100,
      date: "2026-07-11",
      time: "22:00",
      homeTeam: "Argentina",
      awayTeam: "Suiza",
      stadium: "Estadio Kansas City",
      group: "Cuartos de final",
    },
    {
      id: 101,
      date: "2026-07-14",
      time: "20:00", // completar cuando sea oficial
      homeTeam: "Ganador Francia vs Marruecos",
      awayTeam: "Ganador España vs Bélgica",
      stadium: "Estadio Dallas",
      group: "Semifinal",
    },
    {
      id: 102,
      date: "2026-07-15",
      time: "20:00",
      homeTeam: "Ganador Noruega vs Inglaterra",
      awayTeam: "Ganador Argentina vs Suiza",
      stadium: "Estadio Atlanta",
      group: "Semifinal",
    },
    {
      id: 103,
      date: "2026-07-18",
      time: "17:00",
      homeTeam: "Perdedor SF1",
      awayTeam: "Perdedor SF2",
      stadium: "Estadio Miami",
      group: "Tercer puesto",
    },
    {
      id: 104,
      date: "2026-07-19",
      time: "16:00",
      homeTeam: "Ganador SF1",
      awayTeam: "Ganador SF2",
      stadium: "Nueva York / Nueva Jersey",
      group: "Final",
    },
  ];