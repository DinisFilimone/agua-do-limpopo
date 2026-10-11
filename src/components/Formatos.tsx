import Image from "next/image";
import { PRECOS } from "@/lib/config";
import { EncomendarButton } from "./Botoes";

type Formato = {
  litros: number;
  legenda: string;
  imagem: string;
};

const FORMATOS: Formato[] = [
  {
    litros: 5,
    legenda: "Ideal para uso diário e compacto",
    imagem: "/brand/Água do Limpopo 5L Jug.png",
  },
  {
    litros: 6,
    legenda: "Prático e fácil de manusear",
    imagem: "/brand/6L Água do Limpopo Water Jug.png",
  },
  {
    litros: 10,
    legenda: "Perfeito para a família e escritórios",
    imagem: "/brand/Garrafa de Água 10L Água do Limpopo.png",
  },
  {
    litros: 20,
    legenda: "O garrafão clássico de maior capacidade",
    imagem: "/brand/Fresh 20L Água do Limpopo Jug.png",
  },
];

export default function Formatos() {
  return (
    <section id="formatos" className="scroll-mt-20 bg-gelo px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-azul">Formatos de Recarga</p>
          <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
            Água tratada e purificada, no tamanho que precisa
          </h2>
          <p className="mt-4 text-navy/70">
            Escolha o formato ideal, indique a morada de entrega e receba em casa com total comodidade.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 items-stretch gap-4 sm:mt-14 sm:gap-6 lg:grid-cols-4">
          {FORMATOS.map((f, i) => {
            const preco = PRECOS[f.litros];
            return (
              <div
                key={f.litros}
                data-reveal
                data-delay={i * 0.1}
                className="flex flex-col items-center rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-navy/5 transition hover:-translate-y-1 hover:ring-azul/40 hover:shadow-xl sm:p-6"
              >
                {/* Contentor da Imagem */}
                <div className="relative flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-b from-slate-50/50 to-transparent p-2 sm:h-56">
                  <Image
                    src={f.imagem}
                    alt={`Garrafa de ${f.litros} litros Água do Limpopo`}
                    width={300}
                    height={450}
                    className="max-h-full w-auto object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Capacidade */}
                <p className="mt-4 text-4xl font-extrabold text-navy sm:text-5xl">
                  {f.litros}
                  <span className="ml-1 text-lg text-azul sm:text-xl">L</span>
                </p>

                <p className="mt-1 text-xs font-semibold text-navy/70 sm:text-sm">Recarga Disponível</p>
                <p className="mt-1 text-[11px] text-navy/50 sm:text-xs">{f.legenda}</p>

                {/* Preço */}
                {preco != null && (
                  <p className="mt-3 text-base font-bold text-azul sm:text-lg">
                    {preco.toLocaleString("pt-PT")} MT
                  </p>
                )}

                {/* Botão de Encomenda */}
                <EncomendarButton
                  litros={f.litros}
                  className="mt-4 w-full rounded-full bg-azul py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy sm:mt-5"
                >
                  Encomendá-la
                </EncomendarButton>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}