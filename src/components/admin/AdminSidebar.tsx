import Link from "next/link"
import {
  BarChart3,
  FilePlus2,
  LayoutDashboard,
  Newspaper,
  Settings,
} from "lucide-react"

const navItems = [
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
    label: "Estadisticas",
    href: "/admin/estadisticas",
    icon: BarChart3,
  },
  {
    label: "Configuracion",
    href: "/admin/configuracion",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r bg-card text-card-foreground lg:flex lg:flex-col">
      <div className="border-b px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            JC
          </span>
          <span>
            <span className="block text-sm font-semibold">Jujuy Conecta</span>
            <span className="block text-xs text-muted-foreground">Administracion</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
