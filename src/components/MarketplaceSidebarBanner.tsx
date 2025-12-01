// src/components/MarketplaceSidebarBanner.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * MarketplaceSidebarBanner
 * - Compact sidebar/banner vertical para mostrar en la columna derecha de la nota.
 * - Usa paleta del tema: from-primary -> to-accent (ver tailwind config).
 * - Animación on-scroll (aparece al entrar en viewport).
 * - CTA con pulso repetitivo y hover/tap interactions.
 * - Link hardcodeado a producción (abre en nueva pestaña).
 *
 * Uso: colocalo en el aside debajo de <RecentNewsList /> en la página de nota.
 * Asegurate que framer-motion esté instalado: npm i framer-motion
 */

export default function MarketplaceSidebarBanner() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  const marketplaceUrl = "https://www.jujuyconecta.com/servicios/marketplace";

  return (
    <aside ref={ref} aria-label="Publicidad Marketplace Jujuy Conecta" className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.995 }}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.995 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl overflow-hidden border border-news-border bg-gradient-to-b from-primary/90 to-accent/85 p-3 shadow-md"
      >
        <div className="flex flex-col items-stretch gap-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-white/6 flex items-center justify-center">
                {/* small svg icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2C7.03 2 3 6.03 3 11c0 3.86 2.5 7.13 6 8.48V22l3-1 3 1v-2.52c3.5-1.35 6-4.62 6-8.48 0-4.97-4.03-9-9-9z" fill="currentColor" opacity="0.95"/>
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">Marketplace de emprendedores</h3>
              <p className="mt-1 text-xs text-primary-foreground/90 max-w-[170px]">
                Encontrá comercios y servicios de Jujuy. Contacto directo por WhatsApp.
              </p>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-xs text-primary-foreground/80 mb-2">
              102 emprendimientos • 18 rubros • Toda la provincia
            </p>

            <motion.a
              href={marketplaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ir al marketplace - abre en nueva pestaña"
              className="block text-center rounded-md px-3 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold shadow-sm"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.9, ease: "easeInOut" }}
              whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.28)" }}
              whileTap={{ scale: 0.98 }}
            >
              Ver emprendimientos
            </motion.a>
          </div>

         
        </div>
      </motion.div>
    </aside>
  );
}
