import Image from "next/image";
import { PRECOS } from "@/lib/config";
import { EncomendarButton } from "./Botoes";

type Formato = { litros: number; legenda: string; tam?: string; foto?: boolean };

const FORMATOS: Formato[] = [
  { litros: 5, legenda: "Ideal para uso diário", tam: "h-14 w-14 sm:h-20 sm:w-20" },
  { litros: 6, legenda: "Prático para o dia-a-dia", tam: "h-16 w-16 sm:h-24 sm:w-24" },
  { litros: 10, legenda: "Para a família e o escritório", tam: "h-20 w-20 sm:h-32 sm:w-32" },
  { litros: 20, legenda: "O garrafão clássico", foto: true },
];

export default function Formatos() {
  return (
    <section id="formatos" className="scroll-mt-20 bg-gelo px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-azul">Formatos</p>
          <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
            Recarga de água tratada, no tamanho que precisa
          </h2>
          <p className="mt-4 text-navy/70">
            Escolha o formato, indique a entrega e a forma de pagamento. Entregamos em sua casa.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:mt-14 sm:gap-6 lg:grid-cols-4">
          {FORMATOS.map((f, i) => {
            const preco = PRECOS[f.litros];
            return (
              <div
                key={f.litros}
                data-reveal
                data-delay={i * 0.1}
                className="flex flex-col items-center rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-navy/5 transition hover:-translate-y-1 hover:shadow-lg hover:ring-azul/40 sm:p-6"
              >
                <div className="flex h-32 items-end justify-center sm:h-56">
                  {f.foto ? (
                    <Image
                      src="/brand/garrafao-20l.png"
                      alt="Garrafão de 20 litros Água do Limpopo"
                      width={400}
                      height={600}
                      className="h-32 w-auto mix-blend-multiply sm:h-56"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className={`${f.tam} fill-none stroke-azul`}
                      strokeWidth={0.9}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 3h6v3l2 3v10a2 2 0 01-2 2H9a2 2 0 01-2-2V9l2-3z" />
                      <path d="M7 14c2-1.5 3.5 1.5 5 0s3-1.5 5 0" />
                    </svg>
                  )}
                </div>

                <p className="mt-3 text-4xl font-extrabold text-navy sm:mt-4 sm:text-5xl">
                  {f.litros}
                  <span className="ml-1 text-lg text-azul sm:text-xl">L</span>
                </p>
                <p className="mt-1 text-xs font-semibold text-navy/70 sm:text-sm">Recarga de água tratada</p>
                <p className="mt-1 text-[11px] text-navy/50 sm:text-xs">{f.legenda}</p>
                {preco != null && (
                  <p className="mt-2 text-base font-bold text-azul sm:text-lg">
                    {preco.toLocaleString("pt-PT")} MT
                  </p>
                )}

                <EncomendarButton
                  litros={f.litros}
                  className="mt-4 w-full rounded-full bg-azul py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy sm:mt-5"
                >
                  Encomendar
                </EncomendarButton>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}