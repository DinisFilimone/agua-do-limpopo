import { BotaoContacto } from "./Botoes";

const SEGMENTOS = [
  {
    t: "Residências",
    d: "Recarga regular para a sua família.",
    icon: <path d="M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6" />,
  },
  {
    t: "Empresas",
    d: "Escritórios e armazéns com consumo recorrente.",
    icon: <path d="M5 21V4h9v17M14 9h5v12M8 8h3M8 12h3M8 16h3M3 21h18" />,
  },
  {
    t: "Escolas",
    d: "Abastecimento para alunos e funcionários.",
    icon: <path d="M2 9l10-5 10 5-10 5zM6 11.5V16c3 2 9 2 12 0v-4.5" />,
  },
  {
    t: "Restaurantes",
    d: "Água tratada para clientes e cozinha.",
    icon: <path d="M7 3v7a2 2 0 002 2v9M11 3v7a2 2 0 01-2 2M17 21V3c-2 1-3 4-3 7s1 4 3 4" />,
  },
  {
    t: "Hotéis",
    d: "Água segura para hóspedes e equipas.",
    icon: <path d="M3 18V7M3 14h18v4M21 14v-3a3 3 0 00-3-3h-7v6" />,
  },
];

export default function ParaQuem() {
  return (
    <section id="clientes" className="scroll-mt-20 bg-navy px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-ciano">Para quem</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Para a sua casa e para o seu negócio
          </h2>
          <p className="mt-4 text-white/75">
            Entregas regulares para quem precisa de água tratada todos os dias.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {SEGMENTOS.map((s, i) => (
            <div
              key={s.t}
              data-reveal
              data-delay={i * 0.08}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 fill-none stroke-ciano"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {s.icon}
              </svg>
              <h3 className="mt-4 font-bold">{s.t}</h3>
              <p className="mt-2 text-sm text-white/70">{s.d}</p>
            </div>
          ))}
        </div>

        <div data-reveal className="mt-12">
          <BotaoContacto
            assunto="fornecimento"
            className="inline-block rounded-full bg-white px-8 py-3 font-semibold text-navy transition hover:bg-ciano"
          >
            Pedir proposta de fornecimento
          </BotaoContacto>
        </div>
      </div>
    </section>
  );
}