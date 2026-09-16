"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Loader2,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Enums, Tables } from "@/integrations/supabase/supabase"

type UserRole = Enums<"user_role">
type ProfileRow = Pick<
  Tables<"profiles">,
  "id" | "full_name" | "avatar_url" | "role" | "created_at"
>

type PendingRoleChange = {
  profile: ProfileRow
  nextRole: UserRole
}

type AccessState = "loading" | "allowed" | "denied" | "error"

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: "admin", label: "Administrador" },
  { value: "editor", label: "Editor" },
  { value: "colaborador", label: "Colaborador" },
]

const ROLE_PRIORITY: Record<UserRole, number> = {
  admin: 0,
  editor: 1,
  colaborador: 2,
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function getRoleLabel(role: UserRole) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role
}

function getDisplayName(profile: ProfileRow) {
  return profile.full_name?.trim() || "Usuario sin nombre"
}

function getShortId(id: string) {
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

function getInitials(profile: ProfileRow) {
  const fullName = profile.full_name?.trim()

  if (!fullName) return profile.id.slice(0, 2).toUpperCase()

  return fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function formatCreatedAt(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "Sin fecha"
}

function sortProfiles(profiles: ProfileRow[]) {
  return [...profiles].sort((left, right) => {
    const roleOrder = ROLE_PRIORITY[left.role] - ROLE_PRIORITY[right.role]
    if (roleOrder !== 0) return roleOrder

    const leftName = left.full_name?.trim()
    const rightName = right.full_name?.trim()

    if (leftName && rightName) {
      const nameOrder = leftName.localeCompare(rightName, "es", {
        sensitivity: "base",
      })
      if (nameOrder !== 0) return nameOrder
    } else if (leftName) {
      return -1
    } else if (rightName) {
      return 1
    }

    return (left.created_at ?? "").localeCompare(right.created_at ?? "")
  })
}

function getFriendlyRoleError(message: string) {
  const normalized = message.toLowerCase()

  if (normalized.includes("admin role required")) {
    return "Tu cuenta ya no tiene permisos para administrar roles."
  }

  if (normalized.includes("cannot change their own role")) {
    return "No podés cambiar el rol de tu propia cuenta."
  }

  if (normalized.includes("cannot demote the last administrator")) {
    return "No se puede degradar al último administrador."
  }

  if (normalized.includes("target profile not found")) {
    return "El perfil seleccionado ya no existe."
  }

  return message || "No se pudo actualizar el rol."
}

function RoleBadge({ role }: { role: UserRole }) {
  if (role === "admin") {
    return <Badge>Administrador</Badge>
  }

  if (role === "editor") {
    return <Badge variant="outline">Editor</Badge>
  }

  return <Badge variant="secondary">Colaborador</Badge>
}

function ProfileIdentity({
  profile,
  isCurrentUser,
}: {
  profile: ProfileRow
  isCurrentUser: boolean
}) {
  const displayName = getDisplayName(profile)

  return (
    <div className="flex min-w-0 items-center gap-3">
      <Avatar className="h-10 w-10 border">
        {profile.avatar_url ? (
          <AvatarImage src={profile.avatar_url} alt={`Avatar de ${displayName}`} />
        ) : null}
        <AvatarFallback className="text-xs font-semibold">
          {getInitials(profile)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-medium" title={displayName}>
            {displayName}
          </p>
          {isCurrentUser ? (
            <Badge variant="outline" className="text-[10px]">
              Tu cuenta
            </Badge>
          ) : null}
        </div>
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
          ID {getShortId(profile.id)}
        </p>
      </div>
    </div>
  )
}

function RoleSelect({
  profile,
  disabled,
  onChange,
}: {
  profile: ProfileRow
  disabled: boolean
  onChange: (role: UserRole) => void
}) {
  return (
    <Select
      value={profile.role}
      onValueChange={(value) => onChange(value as UserRole)}
      disabled={disabled}
    >
      <SelectTrigger
        className="w-full min-w-[150px] sm:w-[170px]"
        aria-label={`Cambiar rol de ${getDisplayName(profile)}`}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function AdminUserManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [accessState, setAccessState] = useState<AccessState>("loading")
  const [loadError, setLoadError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<ProfileRow[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [pendingChange, setPendingChange] = useState<PendingRoleChange | null>(null)
  const [savingUserId, setSavingUserId] = useState<string | null>(null)
  const initialLoadStartedRef = useRef(false)
  const roleChangeInFlightRef = useRef(false)

  const loadProfiles = useCallback(async () => {
    setAccessState("loading")
    setLoadError(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!user) {
      if (userError) console.error("Admin users session:", userError.message)
      router.replace("/login")
      return
    }

    setCurrentUserId(user.id)

    const { data: ownProfile, error: ownProfileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (ownProfileError) {
      setLoadError("No se pudo verificar tu rol actual.")
      setAccessState("error")
      return
    }

    if (ownProfile?.role !== "admin") {
      setProfiles([])
      setAccessState("denied")
      return
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id,full_name,avatar_url,role,created_at")

    if (error) {
      setLoadError("No se pudo cargar la lista de usuarios.")
      setAccessState("error")
      return
    }

    setProfiles(sortProfiles(data ?? []))
    setAccessState("allowed")
  }, [router])

  useEffect(() => {
    if (initialLoadStartedRef.current) return
    initialLoadStartedRef.current = true
    void loadProfiles()
  }, [loadProfiles])

  const metrics = useMemo(
    () => ({
      total: profiles.length,
      admin: profiles.filter((profile) => profile.role === "admin").length,
      editor: profiles.filter((profile) => profile.role === "editor").length,
      colaborador: profiles.filter((profile) => profile.role === "colaborador").length,
    }),
    [profiles]
  )

  const requestRoleChange = (profile: ProfileRow, nextRole: UserRole) => {
    if (
      savingUserId !== null ||
      profile.id === currentUserId ||
      profile.role === nextRole
    ) {
      return
    }

    setPendingChange({ profile, nextRole })
  }

  const confirmRoleChange = async () => {
    if (!pendingChange || savingUserId !== null || roleChangeInFlightRef.current) return

    const { profile, nextRole } = pendingChange
    roleChangeInFlightRef.current = true
    setSavingUserId(profile.id)

    const { error } = await supabase.rpc("admin_set_user_role", {
      p_user_id: profile.id,
      p_role: nextRole,
    })

    if (error) {
      roleChangeInFlightRef.current = false
      setSavingUserId(null)
      setPendingChange(null)

      if (error.message.toLowerCase().includes("admin role required")) {
        setProfiles([])
        setAccessState("denied")
      }

      toast({
        variant: "destructive",
        title: "No se pudo cambiar el rol",
        description: getFriendlyRoleError(error.message),
      })
      return
    }

    setProfiles((current) =>
      sortProfiles(
        current.map((item) =>
          item.id === profile.id ? { ...item, role: nextRole } : item
        )
      )
    )
    roleChangeInFlightRef.current = false
    setSavingUserId(null)
    setPendingChange(null)
    toast({
      title: "Rol actualizado",
      description: `${getDisplayName(profile)} ahora es ${getRoleLabel(nextRole).toLowerCase()}.`,
    })
  }

  if (accessState === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-8">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Cargando usuarios...
        </div>
      </div>
    )
  }

  if (accessState === "denied") {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>Acceso restringido</CardTitle>
            <CardDescription>
              Sólo los administradores pueden gestionar usuarios y roles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => router.replace("/admin/dashboard")}>
              Volver al dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (accessState === "error") {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <CardTitle>No se pudo cargar la configuración</CardTitle>
            <CardDescription>{loadError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => void loadProfiles()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metricCards = [
    { label: "Usuarios", value: metrics.total, icon: Users },
    { label: "Administradores", value: metrics.admin, icon: ShieldCheck },
    { label: "Editores", value: metrics.editor, icon: UserCog },
    { label: "Colaboradores", value: metrics.colaborador, icon: Users },
  ]

  return (
    <div className="space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gestión de usuarios</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Administrá los roles editoriales de Jujuy Conecta.
        </p>
      </div>

      <section aria-label="Resumen de usuarios" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon

          return (
            <Card key={metric.label}>
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-1 text-2xl font-bold">{metric.value}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>
            Los cambios de rol requieren confirmación y se aplican sin recargar la página.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profiles.length === 0 ? (
            <div className="rounded-md border border-dashed px-6 py-10 text-center">
              <p className="font-medium">No hay usuarios para mostrar</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Los perfiles disponibles aparecerán en este espacio.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead className="w-[150px]">Rol actual</TableHead>
                      <TableHead className="w-[150px]">Creado</TableHead>
                      <TableHead className="w-[190px]">Cambiar rol</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => {
                      const isCurrentUser = profile.id === currentUserId
                      const disabled = isCurrentUser || savingUserId !== null

                      return (
                        <TableRow key={profile.id}>
                          <TableCell>
                            <ProfileIdentity profile={profile} isCurrentUser={isCurrentUser} />
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={profile.role} />
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatCreatedAt(profile.created_at)}
                          </TableCell>
                          <TableCell>
                            <RoleSelect
                              profile={profile}
                              disabled={disabled}
                              onChange={(role) => requestRoleChange(profile, role)}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-3 md:hidden">
                {profiles.map((profile) => {
                  const isCurrentUser = profile.id === currentUserId
                  const disabled = isCurrentUser || savingUserId !== null

                  return (
                    <article key={profile.id} className="rounded-lg border p-4">
                      <ProfileIdentity profile={profile} isCurrentUser={isCurrentUser} />
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Rol actual</p>
                          <div className="mt-1">
                            <RoleBadge role={profile.role} />
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Creado</p>
                          <p className="mt-1 font-medium">{formatCreatedAt(profile.created_at)}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="mb-1.5 text-xs text-muted-foreground">Cambiar rol</p>
                        <RoleSelect
                          profile={profile}
                          disabled={disabled}
                          onChange={(role) => requestRoleChange(profile, role)}
                        />
                      </div>
                    </article>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={pendingChange !== null}
        onOpenChange={(open) => {
          if (!open && savingUserId === null) setPendingChange(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar cambio de rol</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>
                  Vas a cambiar el rol de{" "}
                  <span className="font-medium text-foreground">
                    {pendingChange ? getDisplayName(pendingChange.profile) : "este usuario"}
                  </span>
                  .
                </p>
                {pendingChange ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <RoleBadge role={pendingChange.profile.role} />
                    <span aria-hidden="true">→</span>
                    <RoleBadge role={pendingChange.nextRole} />
                  </div>
                ) : null}
                <p>Este cambio modifica los permisos disponibles en el panel.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={savingUserId !== null}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={savingUserId !== null}
              onClick={(event) => {
                event.preventDefault()
                void confirmRoleChange()
              }}
            >
              {savingUserId !== null ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              {savingUserId !== null ? "Guardando..." : "Confirmar cambio"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
