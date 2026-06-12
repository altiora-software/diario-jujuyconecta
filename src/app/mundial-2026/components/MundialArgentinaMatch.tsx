import { CalendarDays, Clock, MapPin, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const argentinaMatch = {
  homeTeam: "Argentina",
  awayTeam: "Marruecos",
  date: "16 de junio de 2026",
  time: "19:00",
  stadium: "MetLife Stadium",
};

export default function MundialArgentinaMatch() {
  return (
    <section className="w-full bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <Card className="mx-auto max-w-7xl overflow-hidden border-emerald-400/30 bg-gradient-to-br from-slate-950 via-zinc-950 to-emerald-950/40 text-white shadow-2xl shadow-emerald-950/30">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_32%)]" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-10">
            <div>
              <Badge className="mb-5 border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-200 hover:bg-emerald-400/10">
                Proximo partido
              </Badge>

              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Seleccion Argentina
              </p>

              <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
                {argentinaMatch.homeTeam}
                <span className="mx-3 text-emerald-300">vs</span>
                {argentinaMatch.awayTeam}
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-300 sm:text-base">
                La campeona del mundo vuelve a escena en una cita clave de la
                cobertura especial de Jujuy Conecta.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                  <CalendarDays className="h-4 w-4 text-emerald-300" />
                  Fecha
                </div>
                <p className="text-lg font-black text-zinc-50">
                  {argentinaMatch.date}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                  <Clock className="h-4 w-4 text-cyan-300" />
                  Hora
                </div>
                <p className="text-lg font-black tabular-nums text-zinc-50">
                  {argentinaMatch.time}
                </p>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-zinc-400">
                  <MapPin className="h-4 w-4 text-emerald-300" />
                  Estadio
                </div>
                <p className="text-lg font-black text-zinc-50">
                  {argentinaMatch.stadium}
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-6 right-6 hidden opacity-10 lg:block">
              <Shield className="h-40 w-40 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}