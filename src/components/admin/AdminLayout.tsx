"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import AdminHeader, { type AdminIdentity } from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

type AdminLayoutProps = {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [identity, setIdentity] = useState<AdminIdentity | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const redirectingToLoginRef = useRef(false)
  const redirectTimeoutRef = useRef<number | null>(null)

  const navigateToLogin = useCallback(() => {
    if (redirectingToLoginRef.current) return

    redirectingToLoginRef.current = true
    router.replace("/login")
  }, [router])

  const scheduleLoginRedirect = useCallback(() => {
    if (redirectingToLoginRef.current || redirectTimeoutRef.current !== null) return

    redirectTimeoutRef.current = window.setTimeout(() => {
      redirectTimeoutRef.current = null
      navigateToLogin()
    }, 0)
  }, [navigateToLogin])

  useEffect(() => {
    let cancelled = false

    const loadIdentity = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (
        cancelled ||
        redirectingToLoginRef.current ||
        redirectTimeoutRef.current !== null
      ) {
        return
      }

      if (userError || !user) {
        scheduleLoginRedirect()
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle()

      if (
        cancelled ||
        redirectingToLoginRef.current ||
        redirectTimeoutRef.current !== null
      ) {
        return
      }

      if (profileError) {
        console.error("Admin layout profile:", profileError.message)
      }

      const metadataName =
        typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name.trim()
          : typeof user.user_metadata?.name === "string"
            ? user.user_metadata.name.trim()
            : ""
      const email = user.email ?? "Usuario"

      setIdentity({
        displayName: profile?.full_name?.trim() || metadataName || email,
        email,
        role: profile?.role ?? "Sin rol",
      })
      setCheckingSession(false)
    }

    void loadIdentity()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setIdentity(null)
        setCheckingSession(true)
        scheduleLoginRedirect()
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()

      if (redirectTimeoutRef.current !== null) {
        window.clearTimeout(redirectTimeoutRef.current)
        redirectTimeoutRef.current = null
      }
    }
  }, [scheduleLoginRedirect])

  const handleSignOut = async () => {
    if (signingOut) return

    setSigningOut(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        setSigningOut(false)
        toast({
          variant: "destructive",
          title: "No se pudo cerrar la sesion",
          description: error.message,
        })
        return
      }

      setIdentity(null)
      setSigningOut(false)
      navigateToLogin()
    } catch (error) {
      setSigningOut(false)
      toast({
        variant: "destructive",
        title: "No se pudo cerrar la sesion",
        description: error instanceof Error ? error.message : "Ocurrio un error inesperado.",
      })
    }
  }

  if (checkingSession) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Verificando sesion...
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-muted/40">
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader
            identity={identity}
            signingOut={signingOut}
            onSignOut={handleSignOut}
          />
          <main className="flex-1 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </section>
  )
}
