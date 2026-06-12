"use client";

import { useEffect, useState } from "react";
import { Eye, Clock } from "lucide-react";

export default function NoticiaPreview({ data }: { data: any }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Manejo de la URL de previsualización de imagen
  useEffect(() => {
    if (data.imagenFile) {
      const objectUrl = URL.createObjectURL(data.imagenFile);
      setImageUrl(objectUrl);
      // Limpiamos la memoria cuando el componente se desmonta o la imagen cambia
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setImageUrl(null);
    }
  }, [data.imagenFile]);

  return (
    <div className="space-y-4">
      {/* Etiqueta de control */}
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
          Modo Previsualización Directa
        </span>
      </div>

      <article className="rounded-3xl overflow-hidden bg-[#0a0f1d] border border-white/10 shadow-2xl transition-all duration-500">
        {/* Contenedor de Imagen */}
        <div className="relative aspect-video bg-slate-900 overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="w-full h-full object-cover animate-in fade-in duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-700">
              <Eye className="h-10 w-10 mb-2 opacity-20" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Sin imagen de portada</span>
            </div>
          )}
          
          {/* Gradiente estilo diario */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1d] via-transparent to-transparent" />
        </div>

        {/* Contenido de la Nota */}
        <div className="p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-5 w-20 bg-primary/20 rounded-full border border-primary/30 flex items-center justify-center">
                <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Categoría</span>
             </div>
             <div className="flex items-center gap-1 text-slate-500 text-[9px] font-bold uppercase tracking-widest">
                <Clock className="h-3 w-3" />
                Hoy
             </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tighter italic uppercase break-words">
            {data.titulo || "Escribe un título..."}
          </h1>

          <p className="text-slate-400 text-sm md:text-base line-clamp-2 font-medium border-l-2 border-primary/30 pl-4 italic">
            {data.resumen || "Aquí aparecerá el resumen o bajada de la noticia para captar la atención del lector."}
          </p>

          <div className="pt-4 border-t border-white/5">
            <div className="prose prose-invert prose-sm max-w-none text-slate-300 line-clamp-4 leading-relaxed">
              {data.contenido || "El cuerpo de la noticia se visualizará aquí con el formato editorial del diario..."}
            </div>
          </div>
        </div>
      </article>

      <p className="text-center text-[10px] text-slate-600 font-medium">
        * Nota: El diseño final en la web puede variar ligeramente según el dispositivo.
      </p>
    </div>
  );
}