"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ExternalLink, Loader2, LogOut, Menu } from "lucide-react"

import type { AdminIdentity } from "./AdminHeader"
import AdminNavigation from "./admin-navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type AdminMobileNavigationProps = {
  identity: AdminIdentity | null
  signingOut: boolean
  onSignOut: () => void
}

export default function AdminMobileNavigation({
  identity,
  signingOut,
  onSignOut,
}: AdminMobileNavigationProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1024px)")
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false)
    }

    desktopMedia.addEventListener("change", closeOnDesktop)
    return () => desktopMedia.removeEventListener("change", closeOnDesktop)
  }, [])

  const handleSignOut = () => {
    setOpen(false)
    onSignOut()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 lg:hidden"
          aria-label="Abrir navegacion del panel"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-[min(20rem,85vw)] flex-col gap-0 p-0 lg:hidden"
      >
        <SheetHeader className="border-b px-5 py-5 text-left">
          <SheetTitle className="flex items-center gap-3 pr-8">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm text-primary-foreground">
              JC
            </span>
            <span>
              <span className="block text-sm font-semibold">Jujuy Conecta</span>
              <span className="block text-xs font-normal text-muted-foreground">
                Administracion
              </span>
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navegacion principal del panel de administracion
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
          <AdminNavigation onNavigate={() => setOpen(false)} />
        </div>

        <div className="space-y-4 border-t p-4">
          {identity ? (
            <div className="min-w-0 px-1 leading-tight">
              <p className="truncate text-sm font-medium" title={identity.email}>
                {identity.displayName}
              </p>
              <p className="mt-1 truncate text-[11px] uppercase tracking-wide text-muted-foreground">
                {identity.role}
              </p>
            </div>
          ) : null}

          <div className="grid gap-2">
            <Button asChild type="button" variant="outline" className="justify-start">
              <Link href="/" onClick={() => setOpen(false)}>
                <ExternalLink aria-hidden="true" />
                Sitio publico
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSignOut}
              disabled={signingOut || !identity}
              className="justify-start"
            >
              {signingOut ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <LogOut aria-hidden="true" />
              )}
              {signingOut ? "Saliendo..." : "Cerrar sesion"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
