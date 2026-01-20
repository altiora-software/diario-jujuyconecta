"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Categoria = { id: number; nombre: string; slug: string };
const CURATED = ["provinciales", "actualidad", "deportes", "cultura", "economia"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileShowAll, setMobileShowAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoadingCats(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nombre, slug")
        .order("nombre", { ascending: true });

      if (error) console.error("Header load cats:", error);
      if (!mounted) return;
      setCats((data ?? []) as Categoria[]);
      setLoadingCats(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const curatedCategories = CURATED
    .map((s) => cats.find((c) => c.slug === s))
    .filter(Boolean) as Categoria[];

  const otherCategories = cats.filter((c) => !CURATED.includes(c.slug));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020817]/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo y Branding */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
               <img src="/jc.png" alt="Jujuy Conecta" className="h-12 w-12 transition-transform group-hover:scale-110 duration-300" />
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl lg:text-2xl font-black tracking-tighter text-white">
                JUJUY<span className="text-primary">CONECTA</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                Diario Digital
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {curatedCategories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/seccion/${cat.slug}`} 
                className="text-sm font-bold uppercase tracking-wider text-slate-300 hover:text-primary transition-colors"
              >
                {cat.nombre}
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="text-sm font-bold uppercase tracking-wider inline-flex items-center gap-1 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
              >
                Más <ChevronDown className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-[#0a0f1d] border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in duration-200">
                  {loadingCats ? (
                    <div className="p-2 text-sm text-slate-500 animate-pulse">Cargando secciones...</div>
                  ) : (
                    <div className="grid grid-cols-1 gap-1">
                      {otherCategories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/seccion/${c.slug}`}
                          className="block px-4 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary text-sm font-medium text-slate-300 transition-all"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {c.nombre}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Right: search + CTA */}
          <div className="flex items-center space-x-3">
            <form action="/buscar" method="GET" className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <Input 
                type="search" 
                name="q" 
                placeholder="Buscar noticia..." 
                className="pl-10 w-48 bg-white/5 border-white/10 focus:border-primary/50 rounded-full text-secondary placeholder:text-secondary" 
              />
            </form>

            <Button asChild size="sm" className="hidden md:flex bg-primary hover:bg-primary/90 text-black font-bold rounded-full px-5">
              <a href="https://jujuyconecta.com" target="_blank" rel="noopener noreferrer">
                <Rocket className="mr-2 h-4 w-4" /> PLATAFORMA
              </a>
            </Button>

            <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => { setMenuOpen((v) => !v); setMobileShowAll(false); }}>
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-[#020817] border-t border-white/10 pb-8 animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col p-4 gap-2">
              {curatedCategories.map((c) => (
                <Link key={c.slug} href={`/seccion/${c.slug}`} className="px-4 py-4 text-lg font-bold text-slate-200 border-b border-white/5" onClick={() => setMenuOpen(false)}>
                  {c.nombre}
                </Link>
              ))}
              
              <button
                className="flex items-center justify-between px-4 py-4 text-lg font-bold text-primary"
                onClick={() => setMobileShowAll((v) => !v)}
              >
                TODAS LAS SECCIONES
                <ChevronDown className={`h-5 w-5 transition-transform ${mobileShowAll ? "rotate-180" : ""}`} />
              </button>

              {mobileShowAll && (
                <div className="grid grid-cols-2 gap-2 p-2 bg-white/5 rounded-2xl">
                  {cats.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/seccion/${c.slug}`}
                      className="px-4 py-3 text-sm font-medium text-slate-400 hover:text-white"
                      onClick={() => { setMenuOpen(false); }}
                    >
                      {c.nombre}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <Button asChild className="w-full bg-primary text-black font-bold py-6 rounded-2xl">
                  <a href="https://jujuyconecta.com">ACCEDER A PLATAFORMA</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}