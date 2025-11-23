type CategoryBadgeProps = {
    label: string;
    slug?: string | null;
    className?: string;
  };
  
  const SECTION_COLORS: Record<string, string> = {
    politica: "bg-red-500/10 text-red-600 border-red-400/60",
    policiales: "bg-rose-500/10 text-rose-600 border-rose-400/60",
    deportes: "bg-emerald-500/10 text-emerald-600 border-emerald-400/60",
    economia: "bg-amber-500/10 text-amber-700 border-amber-400/70",
    cultura: "bg-violet-500/10 text-violet-600 border-violet-400/60",
    espectaculos: "bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-400/60",
    // default
    default: "bg-primary/10 text-primary border-primary/40",
  };
  
  export function CategoryBadge({ label, slug, className = "" }: CategoryBadgeProps) {
    const base =
      SECTION_COLORS[slug ?? ""] || SECTION_COLORS.default;
  
    return (
      <span
        className={`
          inline-block text-[11px] font-semibold uppercase tracking-wide
          px-2 py-[2px] rounded-full border
          ${base} ${className}
        `}
      >
        {label}
      </span>
    );
  }
  