"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Categoria = { id: number; nombre: string; slug: string };

// Lista curada que se muestra siempre en el header principal
const CURATED = ["provinciales", "actualidad", "deportes", "cultura", "economia"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cats, setCats] = useState<Categoria[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileShowAll, setMobileShowAll] = useState(false); // <-- nuevo: controla "ver todas" en mobile
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
    <header className="sticky top-0 z-50 w-full border-b border-news-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img src="/jc-loguito.png" alt="Jujuy Conecta" className="h-10 w-10 rounded-full" />
            <div className="flex md:hidden lg:flex flex-col leading-tight">
              {/* Visible en mobile y lg+, oculto en md (tablet) */}
              <span className="text-2xl font-bold text-primary">Jujuy Conecta</span>
              <span className="text-xs text-text-secondary">Diario Digital</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4">
            {curatedCategories.map((cat) => (
              <Link key={cat.slug} href={`/seccion/${cat.slug}`} className="text-sm font-medium text-foreground hover:text-primary">
                {cat.nombre}
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="text-sm font-medium inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-muted"
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                Categorías <ChevronDown className="h-4 w-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-background border rounded shadow-lg p-2 z-50">
                  {loadingCats ? (
                    <div className="p-2 text-sm text-muted-foreground">Cargando...</div>
                  ) : (
                    <>
                      {otherCategories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/seccion/${c.slug}`}
                          className="block px-3 py-2 rounded hover:bg-muted text-sm"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {c.nombre}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Right: search + CTA + mobile menu */}
          <div className="flex items-center space-x-2">
            <Button asChild size="sm" className="hidden md:inline-flex shadow-sm">
              <a href="https://jujuyconecta.com" target="_blank" rel="noopener noreferrer">🚀 Plataforma</a>
            </Button>

            <form action="/buscar" method="GET" className="relative hidden sm:block">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" name="q" placeholder="Buscar noticias..." className="pl-8 w-48 lg:w-64" />
            </form>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => { setMenuOpen((v) => !v); setMobileShowAll(false); }} aria-label="Abrir menú">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile expanded menu: ahora muestra curated + botón para ver todas */}
        {menuOpen && (
          <div className="md:hidden bg-background border-t border-border shadow-lg rounded-b-xl">
            <nav className="flex flex-col py-2">
              {/* Mostrar solo las categorías curadas primero (evita lista gigante) */}
              {curatedCategories.map((c) => (
                <Link key={c.slug} href={`/seccion/${c.slug}`} className="px-4 py-2 text-sm font-medium hover:bg-muted" onClick={() => setMenuOpen(false)}>
                  {c.nombre}
                </Link>
              ))}

              {/* Botón para expandir y ver todas las categorías */}
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted font-medium"
                onClick={() => setMobileShowAll((v) => !v)}
                aria-expanded={mobileShowAll}
                aria-controls="mobile-all-categories"
              >
                {mobileShowAll ? "Ocultar categorías" : "Ver todas las categorías"}
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileShowAll ? "rotate-180" : ""}`} />
              </button>

              {/* Lista completa (colapsable) */}
              {mobileShowAll && (
                <div id="mobile-all-categories" className="border-t border-border mt-2">
                  {loadingCats ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">Cargando...</div>
                  ) : (
                    cats.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/seccion/${c.slug}`}
                        className="block px-4 py-2 text-sm hover:bg-muted"
                        onClick={() => { setMenuOpen(false); setMobileShowAll(false); }}
                      >
                        {c.nombre}
                      </Link>
                    ))
                  )}
                </div>
              )}

              <div className="px-4 py-3">
                <Button asChild size="sm" className="w-full">
                  <a href="https://jujuyconecta.com" target="_blank" rel="noopener noreferrer">🚀 Plataforma</a>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
