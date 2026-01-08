'use client';

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Ticker = ({ noticias }: { noticias: Array<{ id: number; titulo: string }> }) => {
  const [isPaused, setIsPaused] = useState(false);

  if (!noticias || noticias.length === 0) return null;

  return (
    <div 
      className="bg-primary w-full py-2 overflow-hidden border-y border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 flex items-center">
        {/* Etiqueta de Título con contraste invertido */}
        <div className="flex items-center space-x-2 mr-6 flex-shrink-0 bg-black px-3 py-1 rounded-sm shadow-lg">
          <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-[10px] font-black whitespace-nowrap text-white uppercase tracking-tighter">
            Último Momento
          </span>
        </div>

        {/* Contenedor del Marquee */}
        <div className="flex-1 overflow-hidden">
          <div className={`flex items-center space-x-12 ${!isPaused ? 'animate-marquee' : ''}`}>
            {/* Duplicamos las noticias para el loop infinito */}
            {[...noticias, ...noticias].map((noticia, index) => (
              <span 
                key={`${noticia.id}-${index}`} 
                className="text-sm font-bold whitespace-nowrap text-black hover:underline cursor-pointer transition-all"
              >
                <span className="opacity-30 mr-3 text-black">/</span>
                {noticia.titulo}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Ticker;