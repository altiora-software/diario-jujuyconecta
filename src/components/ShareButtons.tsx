"use client";

import { useCallback, useEffect, useState } from "react";
import { Facebook, Twitter, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  titulo: string;
  slug: string;
};

export default function ShareButtons({ titulo, slug }: Props) {
  const [url, setUrl] = useState("");

  // Solo se corre en cliente, después de la hidratación
  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(`${window.location.origin}/nota/${slug}`);
    }
  }, [slug]);

  const handleNativeShare = useCallback(() => {
    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");

    if (!shareUrl) return;

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({
        title: titulo,
        text: titulo,
        url: shareUrl,
      });
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("Enlace copiado al portapapeles");
    }
  }, [titulo, url]);

  return (
    <div className="mt-8 border-t pt-6 pb-4 flex flex-col gap-3">
      <p className="text-sm text-muted-foreground font-medium">
        Compartir esta noticia
      </p>

      {/* Botón nativo */}
      <Button
        variant="outline"
        onClick={handleNativeShare}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Compartir
      </Button>

      {/* Redes */}
      <div className="flex items-center gap-3 mt-2">
        {/* Facebook */}
        <Button
          asChild
          variant="secondary"
          className="flex items-center gap-2"
          disabled={!url}
        >
          <a
            href={
              url
                ? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    url
                  )}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </a>
        </Button>

        {/* Twitter */}
        <Button
          asChild
          variant="secondary"
          className="flex items-center gap-2"
          disabled={!url}
        >
          <a
            href={
              url
                ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    url
                  )}&text=${encodeURIComponent(titulo)}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter className="w-4 h-4 text-sky-500" />
            Twitter
          </a>
        </Button>

        {/* WhatsApp */}
        <Button
          asChild
          variant="secondary"
          className="flex items-center gap-2"
          disabled={!url}
        >
          <a
            href={
              url
                ? `https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `${titulo} ${url}`
                  )}`
                : "#"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              className="w-4 h-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.472-.148-.67.15-.197.297-.768.967-.941 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.298-.346.447-.52.15-.174.198-.298.298-.497.099-.198.05-.373-.025-.52-.075-.148-.669-1.611-.916-2.205-.242-.579-.487-.5-.669-.51-.173-.007-.373-.009-.572-.009a1.1 1.1 0 0 0-.799.372c-.273.298-1.041 1.017-1.041 2.479 0 1.461 1.065 2.874 1.213 3.072.149.198 2.094 3.2 5.077 4.363a6.177 6.177 0 0 0 2.966.601c.594-.05 1.807-.739 2.063-1.453.256-.714.256-1.327.179-1.453-.074-.125-.272-.198-.569-.347zm-5.421 6.32h-.001A9.87 9.87 0 0 1 3.18 16.816 9.825 9.825 0 0 1 .379 4.237 9.872 9.872 0 0 1 7.971.38c2.604-.184 5.175.822 7.068 2.714a9.906 9.906 0 0 1 2.926 6.949c.057 2.177-.564 4.281-1.8 6.079l.621 2.27a1.443 1.443 0 0 1-1.734 1.734l-2.267-.621v.001zm11.999-9.976c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 1.989.484 3.908 1.405 5.643l-1.498 5.477a2.006 2.006 0 0 0 2.464 2.464l5.477-1.498a11.966 11.966 0 0 0 5.642 1.405c6.627 0 12-5.373 12-12z" />
            </svg>
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
