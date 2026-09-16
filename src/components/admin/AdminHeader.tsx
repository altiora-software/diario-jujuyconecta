"use client"

import Link from "next/link"
import { ExternalLink, Loader2, LogOut, Newspaper } from "lucide-react"

import { Button } from "@/components/ui/button"

export type AdminIdentity = {
  displayName: string
  email: string
  role: string
}

type AdminHeaderProps = {
  identity: AdminIdentity | null
  signingOut: boolean
  onSignOut: () => void
}

export default function AdminHeader({
  identity,
  signingOut,
  onSignOut,
}: AdminHeaderProps) {
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

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <div className="min-w-0 text-right leading-tight">
            {identity ? (
              <>
                <p className="max-w-40 truncate text-sm font-medium" title={identity.email}>
                  {identity.displayName}
                </p>
                <p className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                  {identity.role}
                </p>
              </>
            ) : null}
          </div>

          <Link
            href="/"
            className="inline-flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <span className="hidden md:inline">Sitio publico</span>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </Link>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSignOut}
            disabled={signingOut || !identity}
            className="gap-2"
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden sm:inline">
              {signingOut ? "Saliendo..." : "Cerrar sesion"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
