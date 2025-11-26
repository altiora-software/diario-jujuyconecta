"use client";

import Image from "next/image";
import { MessageCircle, ChevronRight } from "lucide-react";
import paseo from "../../public/guiajujuy.jpg";

export function EnviarHistoriaSection() {
  const whatsappLink =
    "https://wa.me/5493880000000?text=Hola%2C%20quiero%20enviar%20una%20historia%20para%20publicar%20en%20el%20diario.";

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden hidden">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={paseo}
          alt="Paisaje de Jujuy"
          fill
          priority
          className="object-cover object-center brightness-[0.8]"
        />
        {/* leve overlay para lectura */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 flex justify-center">
        <div className="w-full max-w-4xl rounded-3xl bg-white/95 backdrop-blur-md shadow-2xl border border-border/40 p-6 md:p-8 lg:p-10 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-8">
            {/* Bloque icono + texto corto */}
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 border border-green-200 text-[11px] md:text-xs font-medium text-green-700">
                <span className="h-6 w-6 rounded-full bg-green-600 text-white flex items-center justify-center">
                  <MessageCircle className="h-3.5 w-3.5" />
                </span>
                <span>Tu historia puede aparecer en el diario</span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
                Enviá tu historia por WhatsApp en segundos
              </h2>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                Viste algo que nadie más está mostrando, querés contar lo que pasa
                en tu barrio o compartir una situación importante, mandanos tu historia
                y nuestro equipo la revisa para publicarla.
              </p>

              <p className="text-[11px] md:text-xs text-muted-foreground">
                Podés sumar fotos, videos y tu nombre si querés que aparezca.  
                Si preferís, también podemos publicar de forma anónima.
              </p>
            </div>

            {/* Bloque CTA fuerte */}
            <div className="w-full max-w-xs md:max-w-sm">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block w-full rounded-2xl bg-green-600 text-white px-5 py-4 md:px-6 md:py-5 shadow-xl hover:bg-green-700 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center border border-white/30">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <span className="pointer-events-none absolute inset-0 rounded-full border border-white/40 animate-ping opacity-60" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        Enviar historia ahora
                      </span>
                      <span className="text-[11px] opacity-90">
                        Abrir WhatsApp y adjuntar texto, foto o video
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>

              <p className="mt-2 text-[11px] text-muted-foreground text-center md:text-left">
                Solo usamos tu contacto para responderte sobre esta historia. No enviamos spam.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
