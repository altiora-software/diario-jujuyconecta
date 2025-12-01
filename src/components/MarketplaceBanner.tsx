// src/components/MarketplaceBanner.tsx
"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

export default function MarketplaceBanner() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  // URL hardcodeada según solicitaste
  const marketplaceUrl = "https://www.jujuyconecta.com/servicios/marketplace";
  const registroUrl = "https://www.jujuyconecta.com/servicios/marketplace/registro";

  return (
    <section aria-label="Marketplace Jujuy Conecta" className="w-full">
      <div ref={ref} className="container mx-auto px-4 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.995 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 18, scale: 0.995 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden shadow-2xl border border-news-border bg-gradient-to-r from-primary/90 to-accent/85 p-4 md:p-6 lg:p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Texto */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                En Jujuy, encontrás todo en un solo lugar.
              </h2>

              <p className="mt-2 text-sm md:text-base text-primary-foreground/90 max-w-2xl">
                Descubrí emprendimientos, comercios y servicios de toda la provincia y hablales directo por WhatsApp en un toque. Sin vueltas.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-3">
                {/* Botón principal: abre en nueva pestaña, pulso repetitivo cada 2s */}
                <motion.a
                  href={marketplaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Explorar emprendimientos - abre en nueva pestaña"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8, repeatType: "loop", ease: "easeInOut" }}
                  whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.28)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-4 md:px-5 py-2.5 rounded-full text-sm md:text-base font-semibold bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-md transition"
                >
                  Explorar emprendimientos
                </motion.a>

                {/* Botón secundario: registro - abrir en nueva pestaña */}
                {/* <motion.button
                  onClick={() => window.open(registroUrl, "_blank", "noopener")}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center px-3 py-2 rounded-full text-sm md:text-base font-medium border border-primary/30 text-primary-foreground/95 hover:bg-white/3 transition"
                >
                  Quiero aparecer en el mapa
                </motion.button> */}
              </div>

              <div className="mt-3 text-xs text-primary-foreground/80">
                <span className="font-medium text-white">102</span> emprendimientos • <span className="font-medium text-white">18</span> rubros • Toda la provincia
              </div>
            </div>

    
            {/* Right: Visual */}
<div className=" lg:col-span-5 flex items-center justify-center">
  <div className="w-full max-w-[320px]">
    <div className="relative rounded-xl bg-white/3 border border-white/6 p-3">
      <div className="relative h-40 w-full rounded-md overflow-hidden">
        <Image
          src="/jc-banner.png"        // archivo en public/
          alt="Mapa y emprendimientos de Jujuy Conecta"
          fill                                 // hace que ocupe todo el contenedor relativo
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 280px, 220px"
          style={{ objectFit: "cover" }}       // object-cover
          priority={false}                     // poné true si querés que cargue inmediatamente
        />
      </div>
    </div>
  </div>
</div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
