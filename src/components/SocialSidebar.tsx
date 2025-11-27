'use client';
import { Facebook, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useState } from "react";

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    url: "https://facebook.com/jujuyconecta",
    color: "#1877F2",
  },
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/jujuyconecta",
    color: "#E4405F",
  },
  {
    name: "X",
    icon: () => (
      <svg
        viewBox="0 0 24 24"
        className="w-5 h-5"
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    url: "https://twitter.com/jujuyconecta",
    color: "#000000",
  },
  {
    name: "YouTube",
    icon: Youtube,
    url: "https://youtube.com/jujuyconecta",
    color: "#FF0000",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    url: "https://wa.me/3884488888",
    color: "#25D366",
  },
];

export default function SocialSidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Desktop: Sidebar izquierdo flotante */}
      <div className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-50 flex-col gap-3">
        {socialLinks.map((social, index) => {
          const Icon = social.icon;
          const isHovered = hoveredIndex === index;
          
          return (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={social.name}
            >
              <div
                className="w-12 h-12 rounded-full bg-background border border-border shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                style={{
                  backgroundColor: isHovered ? social.color : undefined,
                  borderColor: isHovered ? social.color : undefined,
                }}
              >
                <Icon
                  className="transition-colors duration-300"
                  style={{
                    color: isHovered ? "#ffffff" : "currentColor",
                  }}
                />
              </div>
              {/* Tooltip */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-foreground text-background px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {social.name}
              </div>
            </a>
          );
        })}
      </div>

      {/* Mobile: Barra inferior con scroll horizontal */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
        <div className="overflow-x-auto">
          <div className="flex gap-4 px-4 py-3 justify-center min-w-max">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              const isHovered = hoveredIndex === index;
              
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onTouchStart={() => setHoveredIndex(index)}
                  onTouchEnd={() => setHoveredIndex(null)}
                  aria-label={social.name}
                >
                  <div
                    className="w-12 h-12 rounded-full bg-background border border-border shadow-md flex items-center justify-center transition-all duration-300 active:scale-95"
                    style={{
                      backgroundColor: isHovered ? social.color : undefined,
                      borderColor: isHovered ? social.color : undefined,
                    }}
                  >
                    <Icon
                      className="transition-colors duration-300"
                      style={{
                        color: isHovered ? "#ffffff" : "currentColor",
                      }}
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
