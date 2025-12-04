// src/components/cosquin/CosquinPromoBannerDiario.tsx
"use client";

import Link from "next/link";

// If you don't have "@heroicons/react" installed or it's giving import errors based on context, use SVGs directly:
function MegaphoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 6.624V17.25A2.25 2.25 0 0118.75 19.5c-6.392 0-12.455-1.515-12.455-5.183V7.718C6.295 7.295 12.324 5.76 18.75 5.76c1.243 0 2.25.99 2.25 2.227zm0 0V5.25M3.75 21l.011-.011A2.249 2.249 0 006.02 19.5c.558 0 1.087.214 1.479.597A2.235 2.235 0 008.25 21H3.75z"
      />
    </svg>
  );
}

function MusicalNoteIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 18V5l12-2v13"
      />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export default function CosquinPromoBannerDiario() {
  return (
    <section className="mt-6">
      <Link
        href="/cosquin-rock"
        className="
          block w-full overflow-hidden rounded-2xl border border-emerald-100 
          bg-gradient-to-r from-emerald-50 via-white to-slate-50
          hover:shadow-md hover:border-emerald-200 transition
        "
      >
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-4 md:flex-row md:items-center">
          {/* Ícono / badge */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600">
              <MusicalNoteIcon className="h-6 w-6 text-white" />
            </div>
            <div className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600">
              <MusicalNoteIcon className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Especial · Verano 2026
              </p>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Cosquín Rock 2026
                <span className="hidden sm:inline"> · </span>
                <span className="block sm:inline text-emerald-700">
                  guía para jujeños que viajan a Punilla
                </span>
              </h2>
            </div>
          </div>

          {/* Copete + CTA */}
          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Información clave sobre grilla, viaje, ubicación y cobertura
              especial de Jujuy Conecta. Todo en un solo lugar.
            </p>

            <div className="flex items-center gap-2 md:justify-end">
              <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[0.7rem] font-semibold text-emerald-800">
                <MegaphoneIcon className="h-4 w-4" />
                Cobertura especial
              </span>
              <span
                className="
                  inline-flex items-center justify-center rounded-full 
                  bg-emerald-600 px-4 py-1.5 text-xs font-semibold 
                  uppercase tracking-[0.15em] text-white
                  hover:bg-emerald-500 transition
                "
              >
                Abrir especial
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
