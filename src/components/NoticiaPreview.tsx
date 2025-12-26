export default function NoticiaPreview({ data }: { data: any }) {
  const imageUrl = data.imagenFile
    ? URL.createObjectURL(data.imagenFile)
    : null;

  return (
    <article className="border rounded-xl p-4 bg-background space-y-4">
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          className="w-full h-48 object-cover rounded-lg"
        />
      )}

      <h1 className="text-2xl font-bold">
        {data.titulo || "Título de la noticia"}
      </h1>

      <p className="text-muted-foreground">
        {data.resumen || "Resumen de la noticia"}
      </p>

      <div className="prose prose-sm max-w-none">
        {data.contenido || "Contenido de la noticia..."}
      </div>
    </article>
  );
}
