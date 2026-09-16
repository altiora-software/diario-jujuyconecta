"use client"

import Image from "next/image"
import Link from "next/link"
import { Loader2, LogOut } from "lucide-react"

import type { AdminIdentity } from "./AdminHeader"
import AdminNavigation from "./admin-navigation"
import { Button } from "@/components/ui/button"

type AdminSidebarProps = {
  identity: AdminIdentity | null
  signingOut: boolean
  onSignOut: () => void
}

export default function AdminSidebar({
  identity,
  signingOut,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card text-card-foreground lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
      <div className="flex h-16 shrink-0 items-center border-b px-5">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Image
            src="/jc.png"
            alt=""
            width={652}
            height={644}
            sizes="40px"
            className="h-10 w-auto shrink-0 object-contain"
            priority
          />
          <span className="min-w-0">
            <span className="block text-sm font-semibold">Jujuy Conecta</span>
            <span className="block text-xs text-muted-foreground">Administración</span>
          </span>
        </Link>
      </div>

      <AdminNavigation className="min-h-0 flex-1 overflow-y-auto px-3 py-5" />

      <div className="shrink-0 space-y-4 border-t p-4">
        {identity ? (
          <div className="min-w-0 px-1 leading-tight">
            <p className="truncate text-sm font-medium" title={identity.displayName}>
              {identity.displayName}
            </p>
            {identity.email !== identity.displayName ? (
              <p className="mt-1 truncate text-xs text-muted-foreground" title={identity.email}>
                {identity.email}
              </p>
            ) : null}
            <p className="mt-2 truncate text-[11px] uppercase tracking-wide text-muted-foreground">
              {identity.role}
            </p>
          </div>
        ) : null}

        <Button
          type="button"
          variant="outline"
          onClick={onSignOut}
          disabled={signingOut || !identity}
          className="w-full justify-start"
        >
          {signingOut ? (
            <Loader2 className="animate-spin" aria-hidden="true" />
          ) : (
            <LogOut aria-hidden="true" />
          )}
          {signingOut ? "Saliendo..." : "Cerrar sesión"}
        </Button>
      </div>
    </aside>
  )
}
