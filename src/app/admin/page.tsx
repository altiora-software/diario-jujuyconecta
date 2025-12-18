"use client";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/integrations/supabase/client";
import NuevaNoticiaForm from "@/components/NuevaNoticiaForm";
import NoticiaPreview from "@/components/NoticiaPreview";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useToast } from "@/hooks/use-toast";
import {
  Pencil,
  Trash2,
  CheckCircle,
  Search,
  Loader2,
  Eye,
} from "lucide-react";
import { toast as sonner } from "sonner";

type Noticia = {
  id: number;
  titulo: string;
  estado: string;
  fecha_publicacion: string | null;
  slug: string;
  owner_id: string | null;
};

type Role = "admin" | "editor" | "colaborador" | null;

type DraftNoticia = {
  titulo: string;
  resumen: string;
  contenido: string;
  categoriaId: string;
  imagenFile: File | null;
};

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [highlightedId, setHighlightedId] = useState<number | null>(null);

  // ---------------- BORRADOR ----------------
  const [draft, setDraft] = useState<DraftNoticia>({
    titulo: "",
    resumen: "",
    contenido: "",
    categoriaId: "",
    imagenFile: null,
  });

  // ---------------- USER ----------------
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  // ---------------- NOTICIAS ----------------
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [filteredNoticias, setFilteredNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------- UI STATE ----------------
  const [filterEstado, setFilterEstado] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // ---------------- USERS ----------------
  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteLoading, setPromoteLoading] = useState(false);

  // SCROL HACIA NUEVA NOTICIA 
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const handleCreated = async (id: number) => {

    const { data, error } = await supabase
      .from("noticias")
      .select("id, titulo, estado, slug, fecha_publicacion, owner_id")
      .eq("id", id)
      .single()

    if (error || !data) return


    // 1️⃣ agregar al estado
    setNoticias(prev => [data, ...prev])
    setHighlightId(data.id)

    setTimeout(() => {
      const el = document.getElementById(`noticia-${data.id}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)

  }


  // ---------- CARGA INICIAL ----------
  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email ?? null);
      setUserId(user.id ?? null);

      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const r = (prof?.role ?? null) as Role;
      setRole(r);

      let q = supabase
        .from("noticias")
        .select("id,titulo,estado,fecha_publicacion,slug,owner_id")
        .order("fecha_publicacion", { ascending: false });

      if (!(r === "admin" || r === "editor")) {
        q = q.eq("owner_id", user.id);
      }

      const { data } = await q;
      if (data) {
        setNoticias(data as Noticia[]);
        setFilteredNoticias(data as Noticia[]);
      }

      setLoading(false);
    })();
  }, [router]);

  // ---------- FILTROS ----------
  useEffect(() => {
    let filtered = noticias;

    if (filterEstado !== "todos") {
      filtered = filtered.filter((n) => n.estado === filterEstado);
    }

    if (searchTerm) {
      filtered = filtered.filter((n) =>
        n.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNoticias(filtered);
  }, [filterEstado, searchTerm, noticias]);

  // ---------- ACCIONES ----------
  const handleEdit = (id: number) => {
    router.push(`/admin/editar/${id}`);
  };

  const publicar = async (id: number) => {
    if (!(role === "admin" || role === "editor")) return;

    const { error, data } = await supabase
      .from("noticias")
      .update({
        estado: "publicado",
        fecha_publicacion: new Date().toISOString(),
      })
      .eq("id", id)
      .select("slug")
      .single();

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }

    setNoticias((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, estado: "publicado", fecha_publicacion: new Date().toISOString() }
          : n
      )
    );

    sonner.success("Noticia publicada", {
      action: data?.slug
        ? {
          label: "Ver nota",
          onClick: () => window.open(`/nota/${data.slug}`, "_blank"),
        }
        : undefined,
    });
  };

  const eliminar = async (id: number) => {
    await supabase.from("noticias").delete().eq("id", id);
    setNoticias((prev) => prev.filter((n) => n.id !== id));
    setDeleteId(null);
  };

  const promote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== "admin") return;

    setPromoteLoading(true);

    const { error } = await (supabase.rpc as any)("promote_user", {
      p_email: promoteEmail.trim(),
      p_role: "editor",
    });

    setPromoteLoading(false);

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
      return;
    }

    toast({
      title: "Usuario promovido",
      description: `${promoteEmail} ahora es editor`,
    });

    setPromoteEmail("");
  };

  // ---------- PERMISOS ----------
  const canEdit = (n: Noticia) =>
    userId === n.owner_id || role === "admin" || role === "editor";
  const canPublish = () => role === "admin" || role === "editor";
  const canDelete = (n: Noticia) =>
    userId === n.owner_id || role === "admin";

  const getEstadoBadge = (estado: string) =>
    estado === "publicado" ? (
      <Badge className="bg-green-600 text-white">Publicado</Badge>
    ) : (
      <Badge variant="secondary">Borrador</Badge>
    );

  const displayName = userEmail?.split("@")[0] ?? "Usuario";

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">
              Hola <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-muted-foreground">Rol: {role ?? "..."}</p>
          </div>
          <Button variant="destructive" onClick={() => supabase.auth.signOut()}>
            Cerrar sesión
          </Button>
        </div>

        {/* FORM + PREVIEW */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">

          <Card>
            <CardHeader>
              <CardTitle>Nueva Noticia</CardTitle>
              <CardDescription>Redactá y previsualizá</CardDescription>
            </CardHeader>
            <CardContent>
              <NuevaNoticiaForm data={draft}
                setData={setDraft}
                onCreated={handleCreated} />
            </CardContent>
          </Card>

          <div className="hidden xl:block sticky top-24">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Vista previa</CardTitle>
              </CardHeader>
              <CardContent>
                <NoticiaPreview data={draft} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* LISTADO */}
        {/* 👉 tu tabla queda EXACTAMENTE como ya la tenías */}
        <Card className="xl:col-span-2 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Gestión de Noticias</CardTitle>
            <CardDescription>
              {role === "admin" || role === "editor"
                ? "Todas las noticias del sistema"
                : "Tus noticias"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={filterEstado}
                onValueChange={(value: any) => setFilterEstado(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="borrador">Borradores</SelectItem>
                  <SelectItem value="publicado">Publicados</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabla */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredNoticias.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay noticias para mostrar
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead className="w-[120px]">Estado</TableHead>
                      <TableHead className="w-[140px] hidden md:table-cell">
                        Fecha
                      </TableHead>
                      <TableHead className="w-[180px] text-right">
                        Acciones
                      </TableHead>
                      <TableHead className="w-[80px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNoticias.map((noticia) => (
                      <TableRow key={noticia.id}
                        id={`noticia-${noticia.id}`}
                        className={
                          highlightId === noticia.id
                            ? "animate-highlight bg-primary/20"
                            : ""
                        }>
                        <TableCell className="font-medium">
                          <div className="max-w-[300px] truncate">
                            {noticia.titulo}
                          </div>
                        </TableCell>

                        <TableCell>{getEstadoBadge(noticia.estado)}</TableCell>

                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {noticia.fecha_publicacion
                            ? new Date(
                              noticia.fecha_publicacion
                            ).toLocaleDateString("es-AR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            : "--"}
                        </TableCell>

                        <TableCell className="font-medium">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit(noticia) && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(noticia.id)}
                                title="Editar noticia"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}

                            {noticia.estado === "borrador" &&
                              canPublish() && (
                                <Button
                                  size="sm"
                                  onClick={() => publicar(noticia.id)}
                                  title="Publicar"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}

                            {canDelete(noticia) && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => setDeleteId(noticia.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            {noticia.estado === "publicado" && noticia.slug && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  window.open(`/nota/${noticia.slug}`, "_blank")
                                }
                                title="Ver nota pública"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}

                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* DIALOG ELIMINAR */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && eliminar(deleteId)}
              className="bg-destructive"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
