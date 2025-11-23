import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Clock, Droplet, Wind } from "lucide-react";

type Clima = {
  temperature_2m?: number;
  weather_code?: number;
  windspeed?: number;
  relativehumidity?: number;
};

function weatherIcon(code?: number, size = 18) {
  // usamos el prop `size` nativo de lucide-react para mantener control exacto
  if (code === undefined) return <Cloud size={size} />;
  if (code === 0) return <Sun size={size} />;
  if ([1, 2, 3].includes(code)) return <Cloud size={size} />;
  if ([45, 48].includes(code)) return <Cloud size={size} />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain size={size} />;
  return <Cloud size={size} />;
}

export default function ClimaYHora() {
  const [clima, setClima] = useState<Clima | null>(null);
  const [hora, setHora] = useState<string>("--:--");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setError(null);
        const lat = -24.1857;
        const lon = -65.2995;

        const climaUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Argentina/Jujuy`;
        const [climaRes, timeRes] = await Promise.all([
          fetch(climaUrl),
          fetch("https://worldtimeapi.org/api/timezone/America/Argentina/Jujujy").catch(() => null), // fallback harmless
        ]);

        if (!climaRes.ok) throw new Error("Open-Meteo: respuesta no OK");

        const climaJson = await climaRes.json();

        const current = climaJson?.current_weather ?? null;
        const temp = current?.temperature ?? null;
        const weather_code = current?.weathercode ?? null;
        const windspeed = current?.windspeed ?? null;

        const newClima: Clima = {
          temperature_2m: typeof temp === "number" ? Math.round(temp) : undefined,
          weather_code,
          windspeed: typeof windspeed === "number" ? Math.round(windspeed) : undefined,
          // relativehumidity no está siempre en current_weather; lo omitimos si no existe
        };

        // hora local: creamos reloj basado en Date local (ya que la zona del usuario/servidor puede variar,
        // esto muestra la hora real del navegador, que suele ser lo que quiere ver el lector)
        const updateClock = () => {
          const now = new Date();
          const local = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
          if (!cancelled) setHora(local);
        };

        if (!cancelled) {
          setClima(newClima);
          updateClock();
        }

        // refresco de reloj cada minuto
        const clockInterval = setInterval(updateClock, 60_000);

        // refrescar clima cada 10 min
        const weatherInterval = setInterval(async () => {
          try {
            const r = await fetch(climaUrl);
            if (!r.ok) return;
            const j = await r.json();
            const c = j?.current_weather ?? null;
            if (!cancelled && c) {
              setClima({
                temperature_2m: typeof c.temperature === "number" ? Math.round(c.temperature) : undefined,
                weather_code: c.weathercode ?? undefined,
                windspeed: typeof c.windspeed === "number" ? Math.round(c.windspeed) : undefined,
                relativehumidity: undefined,
              });
            }
          } catch (e) {
            // noop
          }
        }, 600_000);

        setLoading(false);

        return () => {
          clearInterval(clockInterval);
          clearInterval(weatherInterval);
        };
      } catch (err: any) {
        if (!cancelled) {
          console.error("ClimaYHora:", err);
          setError("No se pudo obtener el clima.");
          setLoading(false);
        }
      }
    }

    const cleanupPromise = fetchData();

    return () => {
      cancelled = true;
      // si fetchData devolviera cleanup functions en el futuro, podríamos llamarlas, por ahora nothing.
    };
  }, []);

  // Barra fina y delicada — pensada para quedar entre header y contenido
  const wrapper =
    "w-full max-w-4xl mx-auto flex items-center justify-center gap-3 bg-card/60 border border-border rounded-full px-3 py-1 text-sm";

  return (
    <div className={wrapper} role="region" aria-label="Clima y hora - San Salvador de Jujuy">
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-slate-200" />
          <span className="text-xs text-muted-foreground">Cargando clima…</span>
        </div>
      ) : error ? (
        <div className="text-xs text-destructive">{error}</div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            {weatherIcon(clima?.weather_code, 18)}
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-sm font-medium leading-none">
              {clima?.temperature_2m ?? "--"}°C
            </div>

            <div className="flex items-center text-xs text-muted-foreground gap-2">
              <Clock size={14} />
              <span aria-live="polite">{hora}</span>
            </div>

            <div className="text-xs text-muted-foreground">| San Salvador de Jujuy</div>
          </div>

          <div className="ml-4 hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Droplet size={14} /> <span>{clima?.relativehumidity ?? "--"}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Wind size={14} /> <span>{clima?.windspeed ?? "--"} km/h</span>
            </div>
          </div>
        </>
      )}
      <div className="sr-only" aria-live="polite">
        {loading ? "Cargando clima" : error ? `Error: ${error}` : `Clima ${clima?.temperature_2m ?? "--"} grados, hora ${hora}`}
      </div>
    </div>
  );
}
