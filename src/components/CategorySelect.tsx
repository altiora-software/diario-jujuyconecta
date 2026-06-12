"use client";

import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Tags } from "lucide-react";

type Categoria = { id: number; nombre: string; slug: string };

type Props = {
  value?: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function CategorySelect({
  value,
  onChange,
  disabled,
  placeholder = "Seleccioná una sección",
}: Props) {
  const [items, setItems] = React.useState<Categoria[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("categorias")
        .select("id, nombre, slug")
        .order("nombre", { ascending: true });

      if (!ignore) {
        if (error) {
          console.error("Error cargando categorías:", error.message);
          setItems([]);
        } else {
          setItems(data || []);
        }
        setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || loading || items.length === 0}
    >
      <SelectTrigger 
        className="w-full bg-white/5 border-white/10 focus:ring-primary/20 focus:border-primary/50 text-slate-200 transition-all duration-300"
      >
        <div className="flex items-center gap-2">
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          ) : (
            <Tags className="h-3 w-3 text-slate-500" />
          )}
          <SelectValue placeholder={loading ? "Cargando secciones..." : placeholder} />
        </div>
      </SelectTrigger>
      
      <SelectContent className="bg-[#0a0f1d] border-white/10 text-slate-200 shadow-2xl">
        {items.map((cat) => (
          <SelectItem 
            key={cat.id} 
            value={String(cat.id)}
            className="focus:bg-primary focus:text-black cursor-pointer uppercase text-[11px] font-bold tracking-wider py-2 transition-colors"
          >
            {cat.nombre}
          </SelectItem>
        ))}
        {items.length === 0 && !loading && (
          <div className="p-4 text-xs text-center text-slate-500 italic">
            No hay categorías disponibles
          </div>
        )}
      </SelectContent>
    </Select>
  );
}