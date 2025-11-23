import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

type Categoria = { id: number; nombre: string; slug: string };

type Props = {
  value?: string;                 // ⚠️ string para el Select
  onChange: (id: string) => void; // Select devuelve string
  disabled?: boolean;
  placeholder?: string;
};

export default function CategorySelect({
  value,
  onChange,
  disabled,
  placeholder = "Seleccioná una categoría",
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
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Cargando..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {items.map((cat) => (
          <SelectItem key={cat.id} value={String(cat.id)}>
            {cat.nombre}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
