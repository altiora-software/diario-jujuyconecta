/* eslint-disable @next/next/no-img-element -- admin preview renders persisted external media */

import { Images, PlayCircle } from "lucide-react"

import type { NoticiaBloqueInput } from "@/types/noticia-bloques"

export default function NoticiaBloquesPreview({
  bloques,
}: {
  bloques: NoticiaBloqueInput[]
}) {
  return (
    <div className="space-y-6">
      {bloques.map((bloque, index) => {
        switch (bloque.tipo) {
          case "paragraph":
            return (
              <p key={index} className="whitespace-pre-wrap leading-7">
                {bloque.contenido.text || "Texto vacío"}
              </p>
            )

          case "image":
            return (
              <figure key={index} className="space-y-2">
                {bloque.contenido.url ? (
                  <img
                    src={bloque.contenido.url}
                    alt={bloque.contenido.alt}
                    className="w-full rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed text-muted-foreground">
                    Imagen pendiente
                  </div>
                )}
                {bloque.contenido.caption && (
                  <figcaption className="text-sm text-muted-foreground">
                    {bloque.contenido.caption}
                  </figcaption>
                )}
              </figure>
            )

          case "gallery":
            return (
              <div key={index} className="space-y-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  {bloque.contenido.images.map((image, imageIndex) =>
                    image.url ? (
                      <figure key={imageIndex} className="space-y-1">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="aspect-video w-full rounded-lg object-cover"
                        />
                        {image.caption && (
                          <figcaption className="text-xs text-muted-foreground">
                            {image.caption}
                          </figcaption>
                        )}
                      </figure>
                    ) : (
                      <div
                        key={imageIndex}
                        className="flex aspect-video items-center justify-center rounded-lg border border-dashed text-muted-foreground"
                      >
                        <Images className="mr-2 h-4 w-4" /> Imagen pendiente
                      </div>
                    )
                  )}
                </div>
              </div>
            )

          case "video":
            return (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border bg-muted/30 p-4"
              >
                <PlayCircle className="h-7 w-7 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wider">
                    Video · {bloque.contenido.provider}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {bloque.contenido.url || "URL pendiente"}
                  </p>
                </div>
              </div>
            )
        }
      })}
    </div>
  )
}
