export function extractStoragePathFromUrl(url: string): string | null {
    const marker = "/storage/v1/object/public/";
    const index = url.indexOf(marker);
    if (index === -1) return null;
    return url.slice(index + marker.length); // ejemplo: "media/noticias/archivo.png"
  }