import Link from "next/link"
import { ExternalLink, Newspaper } from "lucide-react"

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
            <Newspaper className="h-4 w-4" aria-hidden="true" />
            Admin
          </div>
          <h1 className="truncate text-lg font-semibold">Dashboard editorial</h1>
        </div>

        <Link
          href="/"
          className="inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Sitio publico
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
