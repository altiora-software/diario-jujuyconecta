'use client';

import { Facebook, Instagram, Youtube, MessageCircle, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "https://facebook.com", color: "#1877F2" },
  { name: "Instagram", icon: Instagram, url: "https://instagram.com", color: "#E4405F" },
  {
    name: "X",
    icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    url: "https://twitter.com",
    color: "#000000",
  },
  { name: "YouTube", icon: Youtube, url: "https://youtube.com", color: "#FF0000" },
  { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/1234567890", color: "#25D366" },
];

const quickLinks = [
  { name: "Inicio", path: "/" },
  { name: "Noticias", path: "/" },
  { name: "Política", path: "/seccion/politica" },
  { name: "Economía", path: "/seccion/economia" },
  { name: "Deportes", path: "/seccion/deportes" },
  { name: "Vivi Cosquik Rock 2026", path: "/seccion/cosquin-rock" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo y lema */}
          <div className="space-y-4">

<h2 className="flex items-center gap-3 text-3xl font-bold">
  <Image src="/jc-loguito.png" alt="Logo Jujuy Conecta" width={48} height={48} className="object-contain" sizes="100vw" />
  <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
    Jujuy Conecta
  </span>
</h2>
   <p className="text-slate-300 text-sm leading-relaxed">
              Información confiable desde Jujuy. Tu fuente de noticias locales y nacionales con
              credibilidad y compromiso.
            </p>
            <div className="pt-2">
              <p className="text-xs text-slate-400">
                Periodismo independiente desde 2025
              </p>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
              Enlaces Rápidos
            </h3>
            {/* <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                   href={link.path}
                    className="text-slate-300 hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul> */}
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={`${link.path}-${link.name}-${i}`}>
                  <Link
                  href={link.path}
                    className="text-slate-300 hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

          </div>

          {/* Contacto y redes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">
              Contacto
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:jujuyconecta@gmail.com"
                className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors duration-300 text-sm group"
              >
                <Mail className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span>jujuyconecta@gmail.com</span>
              </a>
              <a
                href="tel:+543884000000"
                className="flex items-center gap-3 text-slate-300 hover:text-primary transition-colors duration-300 text-sm group"
              >
                <Phone className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <span>+54 388 400-0000</span>
              </a>
              <div className="flex items-start gap-3 text-slate-300 text-sm">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>San Salvador de Jujuy, Argentina</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="pt-4">
              <h4 className="text-sm font-medium text-slate-400 mb-3">Seguinos en:</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                      style={{
                        ["--hover-color" as any]: social.color,
                      }}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors duration-300" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © 2025 Jujuy Conecta – Todos los derechos reservados
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/privacidad"
                className="text-slate-400 hover:text-primary transition-colors duration-300"
              >
                Privacidad
              </Link>
              <Link
                href="/terminos"
                className="text-slate-400 hover:text-primary transition-colors duration-300"
              >
                Términos
              </Link>
              <Link

                href="/login"
                className="text-slate-500 hover:text-primary transition-colors duration-300"
                rel="nofollow"
              >
                Acceso redacción
              </Link>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}
