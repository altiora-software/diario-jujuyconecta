// src/data/mockData.ts

export type Programa = {
    id: number;
    nombre: string;
    conductor: string;
    descripcion: string;
    horario: string;
    cover_url: string;
    stream_url?: string;
  };
  
  export const programas: Programa[] = [
    {
      id: 1,
      nombre: "Amanecer Conectado",
      conductor: "María López",
      descripcion:
        "Noticias rápidas, clima, tráfico y las primeras novedades del día. Ideal para arrancar informado.",
      horario: "06:00 - 09:00",
      cover_url:
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200",
      stream_url: "https://stream.jujuyconecta.com/vivo",
    },
    {
      id: 2,
      nombre: "La Mesa del Mediodía",
      conductor: "Sergio Molina",
      descripcion:
        "Debates, entrevistas y análisis de lo que pasa en Jujuy, Argentina y el mundo.",
      horario: "12:00 - 14:00",
      cover_url:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200",
      stream_url: "https://stream.jujuyconecta.com/vivo",
    },
    {
      id: 3,
      nombre: "Tarde Andina",
      conductor: "Lucía Fernández",
      descripcion:
        "Música, cultura, historias y mensajes de los oyentes en un programa cálido y relajado.",
      horario: "16:00 - 18:00",
      cover_url:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
      stream_url: "https://stream.jujuyconecta.com/vivo",
    },
    {
      id: 4,
      nombre: "Zona Deportiva",
      conductor: "Gustavo Morales",
      descripcion:
        "Todo el deporte local, nacional e internacional con análisis, datos y entrevistas.",
      horario: "18:00 - 20:00",
      cover_url:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=1200",
      stream_url: "https://stream.jujuyconecta.com/vivo",
    },
    {
      id: 5,
      nombre: "Noches en Jujuy",
      conductor: "Valeria Torres",
      descripcion:
        "Música suave, historias, relatos y compañía para cerrar el día.",
      horario: "22:00 - 00:00",
      cover_url:
        "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1200",
      stream_url: "https://stream.jujuyconecta.com/vivo",
    },
  ];
  