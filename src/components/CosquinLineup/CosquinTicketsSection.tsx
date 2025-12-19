'use client'
const cosquinTickets = [
    {
      id: "abono-general",
      title: "Abono general",
      badge: "2 días de festival",
      description:
        "Acceso a ambos días del festival (14 y 15 de febrero de 2026), todos los escenarios y área gastronómica, a excepción de los espacios FANATIC.",
      imageSrc: "/cosquin/cosquin-abono-general.webp", // reemplazá por tu ruta real
      officialUrl: "https://cosquinrock.net", // link a la venta oficial
    },
    {
      id: "entrada-dia",
      title: "Entrada general por día",
      badge: "Elegís tu jornada",
      description:
        "Permite el acceso al día que elijas (14 o 15 de febrero de 2026). Incluye shows y espacios gastronómicos de la jornada seleccionada, salvo áreas exclusivas.",
      imageSrc: "/cosquin/cosquin-entrada-general.webp",
      officialUrl: "https://cosquinrock.net",
    },
    {
      id: "fanatic-abono",
      title: "Fanatic abono",
      badge: "Experiencia mejorada",
      description:
        "Similar al abono general pero con beneficios especiales: sectores preferenciales, accesos diferenciados y propuestas gastronómicas exclusivas según la producción.",
      imageSrc: "/cosquin/cosquin-fanatic.webp",
      officialUrl: "https://cosquinrock.net",
    },
    {
      id: "fanatic-individual",
      title: "Fanatic individual",
      badge: "Un día en modo premium",
      description:
        "Entrada FANATIC para un solo día del festival, con acceso a sectores diferenciales y servicios especiales, según lo dispuesto por la organización.",
      imageSrc: "/cosquin/fanatic-individual.webp",
      officialUrl: "https://cosquinrock.net",
    },
  ];
  
  export function CosquinTicketsSection() {
    return (
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">
              Entradas y tipos de pase
            </h2>
            <p className="text-sm md:text-base text-slate-700 max-w-2xl">
              A continuación, un resumen de las modalidades de ingreso difundidas
              por la organización del festival. La compra de tickets se realiza
              siempre en los canales oficiales de Cosquín Rock.
            </p>
          </div>
          <a
            href="https://cosquinrock.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800 hover:text-emerald-600"
          >
            Ir al sitio oficial ↗
          </a>
        </div>
  
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cosquinTickets.map((ticket) => (
            <article
              key={ticket.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[3/4] w-full bg-slate-100">
                {/* Acá ponés tus imágenes recortadas del arte oficial */}
                <img
                  src={ticket.imageSrc}
                  alt={ticket.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
  
              <div className="flex flex-1 flex-col p-4 space-y-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {ticket.badge}
                </p>
                <h3 className="text-base font-bold text-slate-900">
                  {ticket.title}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {ticket.description}
                </p>
  
                <div className="mt-3 pt-3 border-t border-slate-200">
                  {ticket.officialUrl ? (
                    <a
                      href={ticket.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-emerald-600 transition"
                    >
                      Ir a venta oficial
                    </a>
                  ) : (
                    <span className="inline-flex w-full items-center justify-center rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Próximamente
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
  
        <p className="text-[0.7rem] text-slate-500 leading-relaxed">
          Los precios, cargos de servicio, medios de pago y políticas de
          devolución son definidos exclusivamente por la producción y las
          ticketeras oficiales del festival. Jujuy Conecta sólo enlaza a esos
          canales como servicio informativo para la audiencia del NOA.
        </p>
      </section>
    );
  }
  