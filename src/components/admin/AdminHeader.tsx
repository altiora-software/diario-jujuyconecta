"use client"

import Link from "next/link"
import { ExternalLink, Newspaper } from "lucide-react"

import AdminMobileNavigation from "./AdminMobileNavigation"

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
    <header className="sticky top-0 z-30 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <AdminMobileNavigation
            identity={identity}
            signingOut={signingOut}
            onSignOut={onSignOut}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <Newspaper className="hidden h-4 w-4 sm:block" aria-hidden="true" />
              Admin
            </div>
            <h1 className="truncate text-base font-semibold sm:text-lg">
              Dashboard editorial
            </h1>
          </div>
        </div>

        <Link
          href="/"
          className="hidden h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:inline-flex"
        >
          Sitio público
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
