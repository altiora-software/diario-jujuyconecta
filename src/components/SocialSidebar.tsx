'use client';
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useState } from "react";

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "https://facebook.com/jujuyconecta", color: "#1877F2" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/jujuyconecta", color: "#E4405F" },
  {
    name: "X",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    url: "https://twitter.com/jujuyconecta",
    color: "#ffffff", // X en blanco queda mejor en fondo oscuro
  },
  { name: "YouTube", icon: Youtube, url: "https://youtube.com/jujuyconecta", color: "#FF0000" },
  { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/3884488888", color: "#25D366" },
];

export default function SocialSidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Desktop: Sidebar izquierdo flotante con efecto cristal */}
      <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          const isHovered = hoveredIndex === index;
          
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={social.name}
            >
              <div
                className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center 
                  transition-all duration-500 ease-out backdrop-blur-md
                  border border-white/10 shadow-2xl
                  ${isHovered ? 'scale-110 -translate-x-1' : 'bg-white/5'}
                `}
                style={{
                  backgroundColor: isHovered ? `${social.color}33` : undefined, // Color con 20% opacidad
                  borderColor: isHovered ? social.color : undefined,
                  boxShadow: isHovered ? `0 0 20px ${social.color}44` : undefined,
                }}
              >
                <Icon
                  className="transition-all duration-300"
                  size={20}
                  style={{
                    color: isHovered ? social.color : "#94a3b8", // Slate-400 por defecto
                    filter: isHovered ? `drop-shadow(0 0 8px ${social.color})` : 'none'
                  }}
                />
              </div>

              {/* Tooltip con estilo Premium */}
              <div className={`
                absolute left-full ml-4 px-4 py-2 rounded-xl 
                bg-[#0f172a] border border-white/10 text-white text-[10px] 
                font-black uppercase tracking-[0.2em] whitespace-nowrap
                transition-all duration-300 pointer-events-none shadow-2xl
                ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
              `}>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: social.color }} />
                  {social.name}
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Mobile: Barra inferior minimalista */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex gap-2 justify-between items-center">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl transition-all active:scale-90 bg-white/5 border border-white/5"
                  aria-label={social.name}
                >
                  <Icon size={20} style={{ color: social.color }} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}