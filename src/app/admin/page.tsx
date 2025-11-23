"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/integrations/supabase/client";
import NuevaNoticiaForm from "@/components/NuevaNoticiaForm";

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
  owner_id: string | null; // 👈 CAMBIO: puede venir null desde Supabase
};

type Role = "admin" | "editor" | "colaborador" | null;

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(null);

  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [filteredNoticias, setFilteredNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [promoteEmail, setPromoteEmail] = useState("");
  const [promoteLoading, setPromoteLoading] = useState(false);

  // ---------- Carga inicial: usuario + rol + noticias ----------
  useEffect(() => {
    (async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email ?? null);
      setUserId(user.id ?? null);

      // Rol del usuario
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const r = (prof?.role ?? null) as Role;
      setRole(r);

      // Noticias
      let q = supabase
        .from("noticias")
        .select("id,titulo,estado,fecha_publicacion,slug,owner_id")
        .order("fecha_publicacion", { ascending: false });

      // Si no es admin/editor, solo sus propias noticias
      if (!(r === "admin" || r === "editor")) {
        q = q.eq("owner_id", user.id);
      }

      const { data, error } = await q;

      if (!error && data) {
        const casted = data as Noticia[];
        setNoticias(casted);
        setFilteredNoticias(casted);
      }

      setLoading(false);
    })();
  }, [router]);

  // ---------- Filtros (estado + búsqueda) ----------
  useEffect(() => {
    let filtered = noticias;

    if (filterEstado !== "todos") {
      filtered = filtered.filter((n) => n.estado === filterEstado);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((n) =>
        n.titulo.toLowerCase().includes(term)
      );
    }

    setFilteredNoticias(filtered);
  }, [filterEstado, searchTerm, noticias]);

  // ---------- Acciones ----------
  const publicar = async (id: number) => {
    if (!(role === "admin" || role === "editor")) {
      toast({
        variant: "destructive",
        title: "Permiso denegado",
        description: "No tenés permiso para publicar.",
      });
      return;
    }

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
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    // Actualizar la lista local
    const nowIso = new Date().toISOString();
    setNoticias((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, estado: "publicado", fecha_publicacion: nowIso }
          : n
      )
    );

    sonner.success("Noticia publicada", {
      description: "La noticia se publicó correctamente.",
      action: data?.slug
        ? {
            label: "Ver nota",
            onClick: () => window.open(`/nota/${data.slug}`, "_blank"),
          }
        : undefined,
      duration: 3000,
    });
  };

  const eliminar = async (id: number) => {
    const { error } = await supabase.from("noticias").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    setNoticias((prev) => prev.filter((n) => n.id !== id));
    setDeleteId(null);

    toast({
      title: "Noticia eliminada",
      description: "La noticia se eliminó correctamente.",
    });
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/editar/${id}`);
  };

  const promote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role !== "admin") {
      toast({
        variant: "destructive",
        title: "Permiso denegado",
        description: "Solo admin puede promover usuarios.",
      });
      return;
    }

    setPromoteLoading(true);

    const { error } = await (supabase.rpc as any)("promote_user", {
      p_email: promoteEmail.trim(),
      p_role: "editor",
    });

    setPromoteLoading(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Usuario promovido",
      description: `${promoteEmail} ahora es editor.`,
    });
    setPromoteEmail("");
  };

  const salir = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ---------- Helpers de permisos ----------
  const canEdit = (noticia: Noticia) =>
    userId === noticia.owner_id || role === "admin" || role === "editor";

  const canPublish = () => role === "admin" || role === "editor";

  const canDelete = (noticia: Noticia) =>
    userId === noticia.owner_id || role === "admin";

  const getEstadoBadge = (estado: string) => {
    if (estado === "publicado") {
      return <Badge className="bg-green-500/90 text-white">Publicado</Badge>;
    }
    return <Badge variant="secondary">Borrador</Badge>;
  };

  const displayName = userEmail ? userEmail.split("@")[0] : "Usuario";

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-border gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-1">
              👋 Hola <span className="text-primary">{displayName}</span>
            </h1>
            <p className="text-muted-foreground">
              Tu rol es{" "}
              <span className="font-semibold capitalize">
                {role ?? "..."}
              </span>{" "}
              • gestioná noticias y usuarios desde aquí
            </p>
          </div>
          <Button
            onClick={salir}
            variant="destructive"
            className="whitespace-nowrap"
          >
            Cerrar sesión
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Crear nueva noticia */}
          <Card className="xl:col-span-1 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Nueva Noticia</CardTitle>
              <CardDescription>
                Crear un borrador para revisar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NuevaNoticiaForm />
            </CardContent>
          </Card>

          {/* Listado de noticias */}
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
                        <TableRow key={noticia.id}>
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
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  window.open(
                                    `/nota/${noticia.slug}`,
                                    "_blank"
                                  )
                                }
                                title="Ver nota pública"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
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

        {/* Promover usuarios (solo admin) */}
        {role === "admin" && (
          <Card className="mt-8 shadow-sm hover:shadow-md transition-all">
            <CardHeader>
              <CardTitle>Gestión de Usuarios</CardTitle>
              <CardDescription>
                Promover usuarios a roles superiores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={promote} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={promoteEmail}
                      onChange={(e) => setPromoteEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={promoteLoading}
                    className="whitespace-nowrap"
                  >
                    {promoteLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Promover a Editor
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar noticia?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La noticia se eliminará
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && eliminar(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
