"use client"

import Link from "next/link"

import AdminNavigation from "./admin-navigation"

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

      <AdminNavigation className="flex-1 px-3 py-5" />
    </aside>
  )
}
