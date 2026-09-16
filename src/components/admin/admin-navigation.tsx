"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FilePlus2,
  LayoutDashboard,
  Newspaper,
  Settings,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type AdminNavItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Noticias",
    href: "/admin/noticias",
    icon: Newspaper,
  },
  {
    label: "Nueva noticia",
    href: "/admin/noticias/nueva",
    icon: FilePlus2,
  },
  {
    label: "Estadísticas",
    href: "/admin/estadisticas",
    icon: BarChart3,
  },
  {
    label: "Configuración",
    href: "/admin/configuracion",
    icon: Settings,
  },
]

export function isAdminNavItemActive(pathname: string, href: string) {
  if (href === "/admin/noticias/nueva") {
    return pathname === href
  }

  if (href === "/admin/noticias") {
    return (
      pathname === href ||
      pathname.startsWith("/admin/editar/") ||
      (pathname.startsWith("/admin/noticias/") &&
        !pathname.startsWith("/admin/noticias/nueva"))
    )
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

type AdminNavigationProps = {
  className?: string
  onNavigate?: () => void
}

export default function AdminNavigation({
  className,
  onNavigate,
}: AdminNavigationProps) {
  const pathname = usePathname()

  return (
    <nav aria-label="Navegación del panel" className={cn("space-y-1", className)}>
      {adminNavItems.map((item) => {
        const Icon = item.icon
        const active = isAdminNavItemActive(pathname, item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              active && "border-primary bg-primary/10 font-semibold text-primary",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{item.label}</span>
            {active ? <span className="sr-only"> (sección actual)</span> : null}
          </Link>
        )
      })}
    </nav>
  )
}
