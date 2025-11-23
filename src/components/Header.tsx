"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Menu,
  X,
  Cloud,
  Sun,
  CloudRain,
  Clock,
  Droplet,
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** ---------- Weather + Clock (inline) ---------- */

type Clima = {
  temperature_2m?: number;
  weather_code?: number;
  windspeed?: number;
  relativehumidity?: number;
};

function WeatherIcon({ code, size = 18 }: { code?: number; size?: number }) {
  if (code === undefined) return <Cloud size={size} />;
  if (code === 0) return <Sun size={size} />;
  if ([1, 2, 3].includes(code)) return <Cloud size={size} />;
  if ([45, 48].includes(code)) return <Cloud size={size} />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return <CloudRain size={size} />;
  return <Cloud size={size} />;
}

function WeatherClockPill() {
  const [clima, setClima] = useState<Clima | null>(null);
  const [hora, setHora] = useState<string>("--:--");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const lat = -24.1857;
    const lon = -65.2995;
    const climaUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=America/Argentina/Jujuy`;

    const updateClock = () => {
      const now = new Date();
      const local = now.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
        if (!cancelled) setHora(local);
    };

    async function fetchWeather() {
      try {
        setError(null);
        const r = await fetch(climaUrl);
        if (!r.ok) throw new Error("Open-Meteo no respondió OK");
        const j = await r.json();
        const c = j?.current_weather ?? null;

        if (!cancelled && c) {
          setClima({
            temperature_2m:
              typeof c.temperature === "number"
                ? Math.round(c.temperature)
                : undefined,
            weather_code: c.weathercode ?? undefined,
            windspeed:
              typeof c.windspeed === "number"
                ? Math.round(c.windspeed)
                : undefined,
            relativehumidity: undefined,
          });
        }
        if (!cancelled) {
          updateClock();
          setLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          console.error("WeatherClockPill:", e);
          setError("No se pudo obtener el clima.");
          setLoading(false);
        }
      }
    }

    fetchWeather();
    const clockInterval = setInterval(updateClock, 60_000);
    const weatherInterval = setInterval(fetchWeather, 600_000);

    return () => {
      cancelled = true;
      clearInterval(clockInterval);
      clearInterval(weatherInterval);
    };
  }, []);

  return (
    <div
      role="region"
      aria-label="Clima y hora - San Salvador de Jujuy"
      className="w-full md:w-auto max-w-full mx-auto md:mx-0 flex items-center justify-between md:justify-center gap-2 md:gap-3
                 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1.5 text-xs md:text-sm"
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-slate-200" />
          <span className="text-[11px] md:text-xs text-muted-foreground">
            Cargando clima…
          </span>
        </div>
      ) : error ? (
        <div className="text-[11px] md:text-xs text-destructive">{error}</div>
      ) : (
        <>
          <div className="flex items-center gap-1.5 md:gap-2">
            <WeatherIcon code={clima?.weather_code} size={18} />
            <span className="font-medium leading-none">
              {clima?.temperature_2m ?? "--"}°C
            </span>
          </div>

          <span className="hidden md:inline text-muted-foreground">|</span>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={14} />
            <span aria-live="polite" className="tabular-nums">
              {hora}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-muted-foreground">
            <span className="hidden md:inline">
              | San Salvador de Jujuy
            </span>
            <div className="hidden lg:flex items-center gap-1.5">
              <Droplet size={14} />{" "}
              <span>{clima?.relativehumidity ?? "--"}%</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <Wind size={14} />{" "}
              <span>{clima?.windspeed ?? "--"} km/h</span>
            </div>
          </div>
        </>
      )}
      <div className="sr-only" aria-live="polite">
        {loading
          ? "Cargando clima"
          : error
          ? `Error: ${error}`
          : `Clima ${clima?.temperature_2m ?? "--"} grados, hora ${hora}`}
      </div>
    </div>
  );
}

/** ---------- Header integrado ---------- */

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const categorias = [
    { nombre: "Provinciales", slug: "provinciales" },
    { nombre: "Nacionales", slug: "nacionales" },
    { nombre: "Deportes", slug: "deportes" },
    { nombre: "Cultura", slug: "cultura" },
    { nombre: "Radio", slug: "radio" },
    { nombre: "Mundo", slug: "mundo" },
  ];

  const toggleMenu = () => setMenuOpen((v) => !v);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-news-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* Top row: Logo + Nav + Search/Menu */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2"
            onClick={closeMenu}
          >
            <img
              src="/jc-logo.png"
              alt="Jujuy Conecta"
              className="h-10 w-10 rounded-full"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold text-primary">
                Jujuy Conecta
              </span>
              <span className="text-xs text-text-secondary">
                Diario Digital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categorias.map((cat) => (
              <Link
                key={cat.slug}
                href={`/seccion/${cat.slug}`}
                className="text-sm font-medium text-foreground hover:text-primary editorial-transition"
              >
                {cat.nombre}
              </Link>
            ))}
          </nav>

          {/* Search & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Abrir menú"
            >
              {menuOpen ? (
                <X className="h-5 w-5 text-green" />
              ) : (
                <Menu className="h-5 w-5 text-green" />
              )}
            </Button>

            <div className="relative hidden sm:block">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar noticias..."
                className="pl-8 w-48 lg:w-64"
              />
            </div>
          </div>
        </div>

        <div className="pb-3">
          <WeatherClockPill />
        </div>

        {menuOpen && (
          <div className="md:hidden animate-slide-down bg-background border-t border-border shadow-lg rounded-b-xl">
            <nav className="flex flex-col py-2 space-y-2">
              {categorias.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/seccion/${cat.slug}`}
                  onClick={closeMenu}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                >
                  {cat.nombre}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
