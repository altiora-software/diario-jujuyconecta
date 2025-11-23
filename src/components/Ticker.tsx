'use client';

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

const Ticker = ({ noticias }: { noticias: Array<{ id: number; titulo: string }> }) => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div 
      className="bg-primary text-primary-foreground py-2 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 flex items-center">
        <div className="flex items-center space-x-2 mr-4 flex-shrink-0">
          <Clock className="h-4 w-4" />
          <span className="text-sm font-bold whitespace-nowrap">ÚLTIMO MOMENTO</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className={`flex space-x-8 ${!isPaused ? 'animate-marquee' : ''}`}>
            {[...noticias, ...noticias].map((noticia, index) => (
              <span key={`${noticia.id}-${index}`} className="text-sm whitespace-nowrap">
                • {noticia.titulo}
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Ticker;
