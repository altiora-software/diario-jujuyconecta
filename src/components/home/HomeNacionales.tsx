// src/components/home/HomeNacionales.tsx
import NoticiasGlobales from "@/components/NoticiasGlobales";

export default function HomeNacionales() {
  return (
    <section className="container mx-auto px-4 pb-10 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">
          Argentina hoy
        </h2>
        <span className="text-xs text-muted-foreground">
          Noticias nacionales seleccionadas automáticamente
        </span>
      </div>

      {/* Usamos tu componente global, pero con menos resultados */}
      <NoticiasGlobales
        country="ar"
        category="general"
        pageSize={6}
      />
    </section>
  );
}
