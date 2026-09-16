"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Eye,
  FilePenLine,
  FilePlus2,
  Files,
  Loader2,
  Newspaper,
  Pencil,
  Star,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"

type DashboardMetrics = {
  total: number
  published: number
  drafts: number
  featured: number
}

type LatestNewsItem = {
  id: number
  titulo: string
  estado: string
  fecha_publicacion: string | null
  created_at: string
  slug: string
  owner_id: string | null
  categorias: { nombre: string } | null
}

type Role = "admin" | "editor" | "colaborador" | null

const metricCards = [
  { key: "total", label: "Total de noticias", icon: Files },
  { key: "published", label: "Publicadas", icon: Newspaper },
  { key: "drafts", label: "Borradores", icon: FilePenLine },
  { key: "featured", label: "Destacadas", icon: Star },
] as const

const dateFormatter = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function statusBadge(status: string) {
  if (status === "publicado") {
    return <Badge className="bg-green-600 text-white hover:bg-green-600">Publicada</Badge>
  }

  if (status === "borrador") {
    return <Badge variant="secondary">Borrador</Badge>
  }

  return <Badge variant="outline">{status}</Badge>
}

export default function AdminDashboardOverview() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [latestNews, setLatestNews] = useState<LatestNewsItem[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError(null)

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError("No se pudo verificar la sesión actual.")
      setLoading(false)
      return
    }

    setUserId(user.id)

    const [
      profileResult,
      totalResult,
      publishedResult,
      draftsResult,
      featuredResult,
      latestResult,
    ] = await Promise.all([
      supabase.from("profiles").select("role").eq("id", user.id).maybeSingle(),
      supabase.from("noticias").select("id", { count: "exact", head: true }),
      supabase
        .from("noticias")
        .select("id", { count: "exact", head: true })
        .eq("estado", "publicado"),
      supabase
        .from("noticias")
        .select("id", { count: "exact", head: true })
        .eq("estado", "borrador"),
      supabase
        .from("noticias")
        .select("id", { count: "exact", head: true })
        .eq("destacado", true),
      supabase
        .from("noticias")
        .select(
          "id,titulo,estado,fecha_publicacion,created_at,slug,owner_id,categorias(nombre)",
        )
        .order("created_at", { ascending: false })
        .limit(5),
    ])

    const queryError = [
      totalResult.error,
      publishedResult.error,
      draftsResult.error,
      featuredResult.error,
      latestResult.error,
    ].find(Boolean)

    if (queryError) {
      setError(queryError.message)
      setLoading(false)
      return
    }

    setRole((profileResult.data?.role ?? null) as Role)
    setMetrics({
      total: totalResult.count ?? 0,
      published: publishedResult.count ?? 0,
      drafts: draftsResult.count ?? 0,
      featured: featuredResult.count ?? 0,
    })
    setLatestNews((latestResult.data ?? []) as LatestNewsItem[])
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadDashboard()
  }, [loadDashboard])

  const canEdit = (item: LatestNewsItem) =>
    role === "admin" ||
    role === "editor" ||
    (role === "colaborador" && item.owner_id === userId && item.estado === "borrador")

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Un resumen de la actividad editorial y accesos para continuar trabajando.
        </p>
      </div>

      {loading ? (
        <Card>
          <CardContent className="flex min-h-48 items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
            Cargando información editorial...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-lg">No se pudo cargar el dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" variant="outline" onClick={() => void loadDashboard()}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section aria-labelledby="dashboard-summary-title">
            <h3 id="dashboard-summary-title" className="sr-only">
              Resumen editorial
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metricCards.map((item) => {
                const Icon = item.icon

                return (
                  <Card key={item.key}>
                    <CardContent className="flex items-center justify-between p-6">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-3xl font-bold tabular-nums">
                          {metrics?.[item.key] ?? 0}
                        </p>
                      </div>
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </section>

          <section aria-labelledby="dashboard-quick-actions-title">
            <div className="mb-4">
              <h3 id="dashboard-quick-actions-title" className="text-lg font-semibold">
                Accesos rápidos
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button asChild size="lg" className="h-auto justify-between px-5 py-4">
                <Link href="/admin/noticias/nueva">
                  <span className="flex items-center gap-3">
                    <FilePlus2 className="h-5 w-5" aria-hidden="true" />
                    Nueva noticia
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-auto justify-between px-5 py-4"
              >
                <Link href="/admin/noticias">
                  <span className="flex items-center gap-3">
                    <Newspaper className="h-5 w-5" aria-hidden="true" />
                    Gestionar noticias
                  </span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </section>

          <section aria-labelledby="latest-news-title">
            <Card>
              <CardHeader>
                <CardTitle id="latest-news-title" className="text-xl">
                  Noticias recientes
                </CardTitle>
                <CardDescription>
                  Las cinco noticias más recientes disponibles para tu usuario.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {latestNews.length === 0 ? (
                  <div className="rounded-md border border-dashed px-6 py-10 text-center">
                    <p className="font-medium">Todavía no hay noticias para mostrar</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Cuando tengas noticias accesibles aparecerán en este espacio.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {latestNews.map((item) => {
                      const editable = canEdit(item)
                      const actionHref =
                        item.estado === "publicado"
                          ? `/nota/${item.slug}`
                          : editable
                            ? `/admin/editar/${item.id}`
                            : `/admin/noticias/${item.id}/preview`
                      const actionLabel =
                        item.estado === "publicado" ? "Ver" : editable ? "Editar" : "Vista previa"
                      const ActionIcon = item.estado === "publicado" ? Eye : editable ? Pencil : Eye

                      return (
                        <article
                          key={item.id}
                          className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              {statusBadge(item.estado)}
                              {item.categorias?.nombre ? (
                                <span className="text-xs font-medium text-muted-foreground">
                                  {item.categorias.nombre}
                                </span>
                              ) : null}
                            </div>
                            <h4 className="font-semibold leading-snug">{item.titulo}</h4>
                            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                              <span>Creada: {formatDate(item.created_at)}</span>
                              {item.estado === "publicado" && item.fecha_publicacion ? (
                                <span>
                                  Publicada: {formatDate(item.fecha_publicacion)}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <Button asChild size="sm" variant="outline" className="shrink-0">
                            <Link href={actionHref}>
                              <ActionIcon className="h-4 w-4" aria-hidden="true" />
                              {actionLabel}
                            </Link>
                          </Button>
                        </article>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}
