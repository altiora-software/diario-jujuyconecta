"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast as sonner } from "sonner"

import NoticiaPreview from "@/components/NoticiaPreview"
import NuevaNoticiaForm from "@/components/NuevaNoticiaForm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"

type Role = "admin" | "editor" | "colaborador" | null

type DraftNoticia = {
  titulo: string
  resumen: string
  contenido: string
  categoriaId: string
  imagenFile: File | null
}

export default function AdminNuevaNoticiaEditor() {
  const router = useRouter()

  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [role, setRole] = useState<Role>(null)
  const [draft, setDraft] = useState<DraftNoticia>({
    titulo: "",
    resumen: "",
    contenido: "",
    categoriaId: "",
    imagenFile: null,
  })

  useEffect(() => {
    ;(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.replace("/login")
        return
      }

      setUserEmail(user.email ?? null)

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      setRole((profile?.role ?? null) as Role)
    })()
  }, [router])

  const handleCreated = async () => {
    sonner.success("Borrador creado", {
      description: "Ya esta disponible en Noticias",
    })
    router.push("/admin/noticias")
  }

  const displayName = userEmail?.split("@")[0] ?? "Usuario"

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold">
            Hola <span className="text-primary">{displayName}</span>
          </h2>
          <p className="text-muted-foreground">Rol: {role ?? "..."}</p>
        </div>
        <Button variant="destructive" onClick={() => supabase.auth.signOut()}>
          Cerrar sesion
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Nueva Noticia</CardTitle>
            <CardDescription>Redacta y previsualiza</CardDescription>
          </CardHeader>
          <CardContent>
            <NuevaNoticiaForm
              data={draft}
              setData={setDraft}
              onCreated={handleCreated}
            />
          </CardContent>
        </Card>

        <div className="hidden xl:block xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Vista previa</CardTitle>
            </CardHeader>
            <CardContent>
              <NoticiaPreview data={draft} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
