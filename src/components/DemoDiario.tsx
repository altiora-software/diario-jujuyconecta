import LoginBox from "@/components/LoginBox";
import NuevaNoticiaForm from "@/components/NuevaNoticiaForm";
import NoticiasPublicas from "@/components/NoticiasPublicas";

export default function DemoDiario() {
  return (
    <div className="p-6 grid gap-8 max-w-5xl mx-auto">
      <h1>Demo Diario Digital</h1>
      <section>
        <h2>Auth</h2>
        <LoginBox />
      </section>
      <section>
        <h2>Crear Noticia (borrador)</h2>
        <NuevaNoticiaForm />
      </section>
      <section>
        <h2>Noticias Publicadas</h2>
        <NoticiasPublicas />
      </section>
    </div>
  );
}
