import Link from "next/link";
import { Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface CardNoticiaProps {
  noticia: {
    id: number;
    slug: string;
    titulo: string;
    subtitulo?: string;
    imagen_url: string;
    categoria: string;
    fecha: string;
    vistas?: number;
  };
  variant?: "hero" | "secondary" | "small" | "list";
}

const CardNoticia = ({ noticia, variant = "small" }: CardNoticiaProps) => {
  const isHero = variant === "hero";
  const isSecondary = variant === "secondary";
  const isList = variant === "list";
  return (
    <Link href={`/nota/${noticia.slug}`}>
      <Card className={`overflow-hidden card-hover border-news-border`}>
        <CardContent className={`p-0 ${isList ? "flex flex-row" : "flex flex-col"}`}>
          <div className={`relative overflow-hidden ${
            isHero ? "aspect-[16/9]" : 
            isSecondary ? "aspect-[4/3]" : 
            isList ? "w-32 h-24 flex-shrink-0" : "h-48"
          }`}>
            <img
              src={noticia.imagen_url}
              alt={noticia.titulo}
              className="w-full h-full object-cover hover:scale-105 editorial-transition"
            />
            <div className="absolute top-2 left-2">
              <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded">
                {noticia.categoria}
              </span>
            </div>
          </div>
          <div className={`p-4 flex flex-col flex-1 ${isList ? "justify-center" : ""}`}>
            <h3 className={`font-bold mb-2 line-clamp-2 text-balance ${
              isHero ? "text-2xl md:text-3xl" : 
              isSecondary ? "text-xl" : 
              isList ? "text-sm" : "text-lg"
            }`}>
              {noticia.titulo}
            </h3>
            {noticia.subtitulo && !isList && (
              <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                {noticia.subtitulo}
              </p>
            )}
            <div className="flex items-center space-x-4 text-xs text-text-muted mt-auto">
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{noticia.fecha}</span>
              </span>
              {noticia.vistas && (
                <span className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{noticia.vistas}</span>
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CardNoticia;
