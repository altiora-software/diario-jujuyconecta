"use client";

import { useEffect, useState } from "react";
import CosquinLineup from "@/components/CosquinLineup/CosquinLineUp";
import {CosquinTicketsSection} from "@/components/CosquinLineup/CosquinTicketsSection";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const EVENT_TIMESTAMP = new Date("2026-02-14T15:00:00-03:00").getTime();

function getTimeLeft(): TimeLeft {
  const now = Date.now();
  const diff = Math.max(EVENT_TIMESTAMP - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

const CosquinRock2026Diario = () => {
  // Estado inicial estable para evitar descalce de SSR
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Primer cálculo solo en cliente
    setTimeLeft(getTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const countdownBlocks = [
    { label: "Días", value: timeLeft.days },
    { label: "Hs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  return (
    // pt-4 para que no se pegue con la navbar del diario si es fija
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-4 md:pt-6">
      {/* HERO / CABECERA DE NOTA */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:py-10 md:flex-row md:px-6 lg:px-8">
          <div className="flex-1 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              Verano 2026 · Cobertura especial
            </p>
            <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-[2.7rem]">
              Cosquín Rock 2026: cómo se prepara el festival y qué deben saber
              los jujeños que viajan a Punilla
            </h1>
            <p className="text-sm md:text-base text-slate-600">
              El histórico encuentro musical tendrá una nueva edición el 14 y 15
              de febrero en el Aeródromo Santa María de Punilla, Córdoba.
              Jujuy Conecta reúne en un solo lugar la información esencial para
              la audiencia del NOA, grilla, viaje, ubicación y cobertura
              especial.
            </p>

            {/* Countdown compacto estilo diario */}
            <div className="mt-3 inline-flex flex-wrap items-center gap-3 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 sm:px-4 sm:py-2.5">
              <span className="text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-800">
                Falta cada vez menos
              </span>
              <div className="flex items-center gap-2 text-center">
                {countdownBlocks.map((item) => (
                  <div
                    key={item.label}
                    className="px-2 py-1 rounded-full bg-white shadow-sm min-w-[3.2rem]"
                  >
                    <div className="text-sm sm:text-base font-bold tabular-nums text-slate-900">
                      {item.value.toString().padStart(2, "0")}
                    </div>
                    <div className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.14em] text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Foto + ficha técnica al estilo recuadro de diario */}
          <aside className="w-full max-w-sm self-stretch rounded-2xl border border-slate-200 bg-slate-50/60 shadow-sm overflow-hidden">
            <div
              className="h-36 sm:h-40 w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=1600')",
              }}
            />
            <div className="space-y-3 p-4">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Ficha del evento
              </p>
              <dl className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-slate-500">Fechas</dt>
                  <dd className="font-semibold">14 y 15 de febrero de 2026</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-slate-500">Lugar</dt>
                  <dd className="font-semibold">
                    Aeródromo Santa María de Punilla, Córdoba
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-20 shrink-0 text-slate-500">Formato</dt>
                  <dd>
                    Festival de música con múltiples escenarios, propuestas
                    gastronómicas y espacios de camping.
                  </dd>
                </div>
              </dl>
              <p className="text-[0.7rem] text-slate-500 leading-relaxed">
                Esta nota forma parte de una cobertura periodística
                independiente de Jujuy Conecta. La organización, venta de
                entradas y cambios de programación dependen exclusivamente de la
                producción oficial del festival.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* CUERPO PRINCIPAL DE LA NOTA */}
      <main className="mx-auto max-w-5xl px-4 py-10 space-y-14 md:px-6 lg:px-0">
        {/* Introducción / contexto */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Un clásico del verano cordobés con público jujeño asegurado
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-700">
            Cada año, miles de personas del NOA se trasladan hasta el valle de
            Punilla para ser parte de dos jornadas intensas de música en vivo.
            La edición 2026 vuelve al Aeródromo Santa María de Punilla, con una
            grilla que combina nombres históricos del rock argentino, artistas
            internacionales y nuevas escenas urbanas.
          </p>
          <p className="text-sm md:text-base leading-relaxed text-slate-700">
            Desde Jujuy Conecta, la cobertura se centra en las necesidades de la
            audiencia jujeña, cómo organizar el viaje, qué tener en cuenta en el
            predio, qué artistas se perfilan como infaltables y de qué manera
            seguir el minuto a minuto desde la provincia.
          </p>
        </section>

        {/* Módulo visual: grilla interactiva estilo Cosquín */}
        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Line up completo y bandas destacadas
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-700">
            A continuación, un módulo interactivo con la grilla artística
            completa de Cosquín Rock 2026. Las bandas y artistas señalados como{" "}
            <span className="font-semibold">“Destacado”</span> representan
            algunos de los shows de mayor peso en la programación.
          </p>
          <CosquinLineup />
        </section> 
        <CosquinTicketsSection />

        {/* Cómo viajar desde Jujuy */}
        <section className="space-y-5">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Cómo viajar desde Jujuy al Cosquín Rock
          </h2>
          <p className="text-sm md:text-base text-slate-700 max-w-3xl">
            El viaje forma parte de la experiencia, ruta, amigos, música y
            organización previa. Aquí, un panorama general de las opciones más
            utilizadas por el público jujeño. Los horarios y tarifas pueden
            variar, por lo que se recomienda consultar siempre con las empresas
            correspondientes.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
              <h3 className="text-base font-bold mb-2 text-emerald-800">
                Colectivo
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Alternativas con trasbordo en Salta o Tucumán y servicios
                directos a Córdoba capital según la temporada. Desde la
                terminal, la organización suele disponer de traslados hacia el
                predio o se pueden contratar servicios particulares.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
              <h3 className="text-base font-bold mb-2 text-emerald-800">
                Vehículo particular
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Opción elegida por grupos de amigos y familias. Es clave
                revisar el estado del vehículo, chequear rutas habilitadas,
                peajes y tiempos de viaje. Se sugiere conducir con descansos
                programados y respetar todas las normas de tránsito.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">
              <h3 className="text-base font-bold mb-2 text-emerald-800">
                Avión más traslado
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Una alternativa más rápida para quienes priorizan comodidad,
                vuelos a Córdoba capital y, desde allí, traslados en combis,
                remises o vehículos de alquiler hacia Santa María de Punilla.
              </p>
            </article>
          </div>
        </section>

        {/* Cobertura Jujuy Conecta como medio */}
        <section className="space-y-5">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            Cómo será la cobertura de Jujuy Conecta
          </h2>
          <p className="text-sm md:text-base text-slate-700 max-w-3xl">
            El equipo de Jujuy Conecta realizará una cobertura especial pensada
            para la audiencia del norte, crónicas, material audiovisual y
            contenidos útiles para quienes viajan o siguen el evento a
            distancia.
          </p>

          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold mb-2 text-emerald-800">
                Crónicas y análisis
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Notas con lectura posterior al show, impresiones del público,
                momentos destacados de cada jornada y recomendaciones para
                futuras ediciones.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold mb-2 text-emerald-800">
                Cobertura audiovisual
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Registros de ambiente, recorridos por el predio, testimonios de
                jujeños y fragmentos de la experiencia desde el público, pensados
                para redes y piezas especiales.
              </p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold mb-2 text-emerald-800">
                Guía práctica para el NOA
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Consejos sobre hidratación, horarios de ingreso y salida,
                puntos clave del predio y aspectos a tener en cuenta para un
                viaje seguro y ordenado desde Jujuy.
              </p>
            </article>
          </div>

          <p className="text-xs text-slate-500">
            Además, en la plataforma principal de Jujuy Conecta se publicará
            una guía interactiva con módulos especiales para el festival,
            transporte, experiencias y contenidos multimedia.
          </p>
        </section>

        {/* Ubicación / mapa */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              Dónde se realiza el festival
            </h2>
            <a
              href="https://maps.app.goo.gl/5EngGhNGGsL4s1RCA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 hover:text-emerald-600"
            >
              Abrir en Google Maps ↗
            </a>
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <iframe
              title="Mapa Cosquín Rock 2026"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4044.576240819121!2d-64.4560639!3d-31.284454899999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x942d7bfb5e944355%3A0x71c7e2a8989edd10!2sAeroclub%20Santa%20Mar%C3%ADa%20de%20Punilla!5e1!3m2!1ses-419!2sar!4v1764863432208!5m2!1ses-419!2sar"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-64 sm:h-72 w-full border-0"
            />
          </div>
        </section>

        {/* Disclaimer legal */}
        <section className="border-t border-slate-200 pt-6">
          <p className="text-[0.7rem] text-slate-500 leading-relaxed">
            Cosquín Rock es una marca registrada de sus respectivos titulares.
            Jujuy Conecta no organiza el evento ni vende entradas, únicamente
            brinda información periodística para la comunidad del NOA. La
            compra de tickets, las condiciones de ingreso y cualquier cambio de
            programación deben consultarse siempre en los canales oficiales del
            festival.
          </p>
        </section>
      </main>
    </div>
  );
};

export default CosquinRock2026Diario;
