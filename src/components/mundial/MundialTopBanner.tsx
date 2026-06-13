import Link from "next/link";
import { Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function MundialTopBanner() {
  return (
    <section className="w-full border-b border-white/10 bg-[#020817] text-white">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-none py-4 sm:py-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(16,185,129,0.18),transparent_30%),linear-gradient(90deg,rgba(2,8,23,1),rgba(15,23,42,0.94),rgba(2,8,23,1))]" />
          <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[linear-gradient(135deg,transparent,rgba(16,185,129,0.12))] sm:block" />

          <div className="relative flex min-h-20 flex-col gap-4 sm:min-h-24 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-emerald-400/25 bg-emerald-500/10 shadow-lg shadow-emerald-950/30 sm:size-14">
                <Trophy className="h-6 w-6 text-emerald-300 sm:h-7 sm:w-7" />
              </div>

              <div className="min-w-0">
                <Badge className="mb-2 border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300 hover:bg-emerald-500/10">
                  ESPECIAL MUNDIAL 2026
                </Badge>

                <h2 className="text-balance text-lg font-black leading-tight tracking-tight text-white sm:text-2xl">
                  Argentina juega el 16 de junio frente a Marruecos
                </h2>

                <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-slate-400 sm:text-base">
                  Fixture, grupos, resultados y toda la cobertura especial
                </p>
              </div>
            </div>

            <Button
              asChild
              className="h-11 w-full shrink-0 rounded-full bg-primary px-6 font-black uppercase tracking-wide text-black shadow-lg shadow-primary/20 hover:bg-primary/90 sm:w-auto"
            >
              <Link href="/mundial-2026">Ver cobertura</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
