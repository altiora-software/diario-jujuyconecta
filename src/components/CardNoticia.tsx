import Link from "next/link";
import Image from "next/image";
import { Clock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getOptimizedNewsImageUrl, CardVariant } from "@/lib/news-images";

interface CardNoticiaProps {
  noticia: {
    id: number;
    slug: string;
    titulo: string;
    subtitulo?: string;
    imagen_url: string;   // URL cruda de Supabase o externa
    categoria: string;
    fecha: string;
    vistas?: number;
  };
  variant?: CardVariant;
}

const CardNoticia = ({ noticia, variant = "small" }: CardNoticiaProps) => {
  const isHero = variant === "hero";
  const isSecondary = variant === "secondary";
  const isList = variant === "list";

  // Acá convertimos la URL cruda en una URL optimizada
  const optimizedImageUrl = getOptimizedNewsImageUrl(noticia.imagen_url, variant);
  const hasImage = Boolean(optimizedImageUrl);

  // Definimos tamaños para <Image> según variant
  const imageSizes =
    variant === "hero"
      ? "100vw"
      : variant === "secondary"
      ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      : variant === "list"
      ? "(max-width: 768px) 120px, 160px"
      : "(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw";

  return (
    <Link href={`/nota/${noticia.slug}`}>
      <Card className="overflow-hidden card-hover border-news-border">
        <CardContent className={`p-0 ${isList ? "flex flex-row" : "flex flex-col"}`}>
          {/* IMAGEN */}
          {hasImage && optimizedImageUrl && (
            <div
              className={`relative overflow-hidden ${
                isHero
                  ? "aspect-[16/9]"
                  : isSecondary
                  ? "aspect-[4/3]"
                  : isList
                  ? "w-32 h-24 flex-shrink-0"
                  : "h-48"
              }`}
            >
              <Image
                src={optimizedImageUrl}
                alt={noticia.titulo}
                fill
                sizes={imageSizes}
                className="object-cover editorial-transition group-hover:scale-105"
                // Solo la hero debería llegar a ser candidata a LCP
                priority={isHero}
              />

              <div className="absolute top-2 left-2">
                <span className="bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded">
                  {noticia.categoria}
                </span>
              </div>
            </div>
          )}

          {/* SI NO HAY IMAGEN, QUE NO ROMPA EL CARD */}
          {!hasImage && (
            <div className="bg-muted flex items-center justify-center h-32 sm:h-40">
              <span className="text-xs text-text-muted uppercase tracking-wide">
                {noticia.categoria}
              </span>
            </div>
          )}

          {/* CONTENIDO */}
          <div className={`p-4 flex flex-col flex-1 ${isList ? "justify-center" : ""}`}>
            <h3
              className={`font-bold mb-2 line-clamp-2 text-balance ${
                isHero
                  ? "text-2xl md:text-3xl"
                  : isSecondary
                  ? "text-xl"
                  : isList
                  ? "text-sm"
                  : "text-lg"
              }`}
            >
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
              {typeof noticia.vistas === "number" && noticia.vistas > 0 && (
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
