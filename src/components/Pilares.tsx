const PILARES = [
  {
    titulo: "Água tratada e purificada",
    texto: "Osmose reversa e esterilização UV.",
    icon: <path d="M12 2C12 2 5 10 5 15a7 7 0 0014 0c0-5-7-13-7-13z" />,
  },
  {
    titulo: "Qualidade garantida",
    texto: "Controlo de qualidade em cada enchimento.",
    icon: (
      <>
        <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
  {
    titulo: "Mais saúde para a sua família",
    texto: "Água segura para o consumo de todos os dias.",
    icon: <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19c2-5 5-8 9-10" />,
  },
  {
    titulo: "Entrega ao domicílio",
    texto: "Receba em casa, no escritório ou no seu negócio.",
    icon: (
      <>
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </>
    ),
  },
];

export default function Pilares() {
  return (
    <section className="bg-white px-6 pb-16 pt-20">
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PILARES.map((p, i) => (
          <div
            key={p.titulo}
            data-reveal
            data-delay={i * 0.1}
            className="rounded-2xl bg-gelo p-7 text-center shadow-sm ring-1 ring-navy/5 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-azul/10">
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 fill-none stroke-azul"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {p.icon}
              </svg>
            </div>
            <h3 className="font-bold text-navy">{p.titulo}</h3>
            <p className="mt-2 text-sm text-navy/70">{p.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}