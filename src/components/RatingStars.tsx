"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Props = {
  noticiaId: number;
};

export default function RatingStars({ noticiaId }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleRate(value: number) {
    if (loading) return;
    setLoading(true);

    // const { error } = await supabase.from("notas_rating").insert({
    //   noticia_id: noticiaId,
    //   rating: value,
    // });

    setLoading(false);

    // if (error) {
    //   toast.error("Error al guardar tu puntuación.");
    //   return;
    // }

    setRating(value);
    toast.success("Gracias por tu puntuación!");
  }

  return (
    <div className="flex flex-col gap-2 py-6">
      <p className="text-sm text-muted-foreground">Calificá esta noticia</p>

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => {
          const filled = hover >= value || rating >= value;

          return (
            <button
              key={value}
              type="button"
              disabled={loading}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleRate(value)}
              className="p-1"
            >
              <Star
                size={24}
                className={filled ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
