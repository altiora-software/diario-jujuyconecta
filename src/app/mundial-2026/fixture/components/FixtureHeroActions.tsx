"use client";

import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";

import Link from "next/link";

export default function FixtureHeroActions() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button
        type="button"
        onClick={() => scrollToSection("partidos-hoy")}
        className="bg-emerald-500 text-slate-950 hover:bg-emerald-400"
      >
        Ver partidos de hoy
        <ArrowDown className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        onClick={() => scrollToSection("argentina")}
        variant="outline"
        className="border-cyan-400/40 bg-transparent text-cyan-100 hover:bg-cyan-500/10 hover:text-white"
      >
         <Link href="/mundial-2026/fixture">
          Ver fixture completo
        </Link>
      </Button>
    </div>
  );
}
