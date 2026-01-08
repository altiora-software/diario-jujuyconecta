"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ShoppingBag, MapPin } from "lucide-react";

export default function MarketplaceBanner() {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  const marketplaceUrl = "https://www.jujuyconecta.com/servicios/marketplace";

  return (
    <section aria-label="Marketplace Jujuy Conecta" className="w-full">
      <div ref={ref} className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[3rem] overflow-hidden border border-white/10 bg-[#020817] p-8 md:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)]"
        >
          {/* Decoración de fondo: Luces sutiles */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Texto y Contenido */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <ShoppingBag className="w-3 h-3" />
                Marketplace Local
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white leading-[0.9] uppercase tracking-tighter italic">
                En Jujuy, encontrás todo <br />
                <span className="text-primary">en un solo lugar.</span>
              </h2>

              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                Descubrí emprendimientos, comercios y servicios de toda la provincia. Contacto directo por WhatsApp, sin intermediarios.
              </p>

              <div className="flex flex-wrap items-center gap-6">
                <motion.a
                  href={marketplaceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-8 py-4 rounded-full bg-primary text-[#020817] font-black uppercase text-sm tracking-widest shadow-[0_10px_30px_rgba(16,185,129,0.3)] transition-all"
                >
                  Explorar ahora
                  <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </motion.a>

                <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    Toda la provincia
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-700" />
                  <div>+100 Comercios</div>
                </div>
              </div>
            </div>

            {/* Visual: El "Mockup" de la imagen */}
            <div className="lg:col-span-5 relative group">
              <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 rotate-2 group-hover:rotate-0 transition-transform duration-700 shadow-2xl">
                <Image
                  src="/jc-banner.png"
                  alt="Marketplace Jujuy Conecta"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                  priority
                />
                {/* Overlay de cristal en la imagen */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020817] via-transparent to-transparent opacity-60" />
              </div>
              
              {/* Elementos flotantes decorativos detrás de la imagen */}
              <div className="absolute -inset-4 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}