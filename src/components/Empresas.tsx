const CLIENTES = [
  { t: "Escolas", d: "Abastecimento regular para alunos e funcionários." },
  { t: "Hotéis e restaurantes", d: "Água tratada para clientes e cozinha." },
  { t: "Empresas", d: "Escritórios e armazéns com consumo recorrente." },
  { t: "Grandes consumidores", d: "Volumes maiores com entrega programada." },
];

export default function Empresas() {
  return (
    <section id="empresas" className="scroll-mt-20 bg-navy px-6 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-ciano">
            Para empresas
          </p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Fornecimento institucional com entregas regulares
          </h2>
          <p className="mt-4 text-white/75">
            Contratos para quem precisa de água tratada todos os dias.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CLIENTES.map((c, i) => (
            <div
              key={c.t}
              data-reveal
              data-delay={i * 0.1}
              className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:bg-white/10"
            >
              <h3 className="font-bold">{c.t}</h3>
              <p className="mt-2 text-sm text-white/70">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}