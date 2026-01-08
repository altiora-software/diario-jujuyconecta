'use client';

import { Facebook, Instagram, Youtube, MessageCircle, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
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
    color: "#ffffff",
  },
  { name: "YouTube", icon: Youtube, url: "https://youtube.com", color: "#FF0000" },
  { name: "WhatsApp", icon: MessageCircle, url: "https://wa.me/1234567890", color: "#25D366" },
];

const quickLinks = [
  { name: "Inicio", path: "/" },
  { name: "Política", path: "/seccion/politica" },
  { name: "Economía", path: "/seccion/economia" },
  { name: "Deportes", path: "/seccion/deportes" },
  { name: "Cosquín Rock 2026", path: "/seccion/cosquin-rock" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#020817] text-white mt-20 border-t border-white/5 overflow-hidden">
      {/* Glow decorativo de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Columna 1: Branding */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <Image 
                src="/jc-loguito.png" 
                alt="Logo Jujuy Conecta" 
                width={40} height={40} 
                className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
              />
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Jujuy<span className="text-primary">Conecta</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
              "El pulso de la provincia en tiempo real. Periodismo independiente con visión de futuro."
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all hover:border-primary/50 hover:bg-primary/10 group"
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Navegación</h3>
            <ul className="grid grid-cols-1 gap-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto Técnico */}
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Redacción</h3>
            <div className="space-y-4">
              <a href="mailto:jujuyconecta@gmail.com" className="block group">
                <span className="text-[10px] text-slate-600 block uppercase mb-1">Email</span>
                <span className="text-sm font-bold text-slate-300 group-hover:text-primary transition-colors">jujuyconecta@gmail.com</span>
              </a>
              <div className="block">
                <span className="text-[10px] text-slate-600 block uppercase mb-1">Ubicación</span>
                <span className="text-sm font-bold text-slate-300">San Salvador de Jujuy, Argentina</span>
              </div>
            </div>
          </div>

          {/* Columna 4: Newsletter o Acción */}
          <div className="space-y-6">
            <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors" />
              <h4 className="text-sm font-black uppercase tracking-widest mb-2 italic">Sumá tu negocio</h4>
              <p className="text-xs text-slate-500 mb-4 font-medium">Aparecé en nuestro Marketplace y conectá con miles de lectores.</p>
              <Link 
                href="/servicios/marketplace" 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-primary hover:gap-3 transition-all"
              >
                SABER MÁS <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              © 2026 JUJUY CONECTA
            </p>
            <span className="hidden md:block w-px h-4 bg-white/10" />
            <div className="flex gap-4">
              <Link href="/privacidad" className="text-[10px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Privacidad</Link>
              <Link href="/terminos" className="text-[10px] font-bold text-slate-600 hover:text-white uppercase tracking-widest transition-colors">Términos</Link>
            </div>
          </div>
          
          <Link 
            href="/login" 
            className="px-4 py-2 rounded-lg border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-primary hover:border-primary/20 transition-all"
          >
            Acceso Redacción
          </Link>
        </div>
      </div>
    </footer>
  );
}