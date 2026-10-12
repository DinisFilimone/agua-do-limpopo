import Image from "next/image";
import { PRECOS } from "@/lib/config";
import { EncomendarButton } from "./Botoes";

type Formato = {
  litros: number;
  legenda: string;
  imagem: string;
  altura: string;
};

const FORMATOS: Formato[] = [
  {
    litros: 5,
    legenda: "Ideal para uso diário e compacto",
    imagem: "/brand/garrafao-5l.png",
    altura: "h-28 sm:h-44",
  },
  {
    litros: 6,
    legenda: "Prático e fácil de manusear",
    imagem: "/brand/garrafao-6l.png",
    altura: "h-32 sm:h-48",
  },
  {
    litros: 10,
    legenda: "Perfeito para a família e escritórios",
    imagem: "/brand/garrafao-10l.png",
    altura: "h-36 sm:h-52",
  },
  {
    litros: 20,
    legenda: "O garrafão clássico de maior capacidade",
    imagem: "/brand/garrafao-20l.png",
    altura: "h-40 sm:h-56",
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
                className="group flex flex-col items-center rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-navy/5 transition hover:-translate-y-1 hover:shadow-xl hover:ring-azul/40 sm:p-6"
              >
                {/* Contentor da imagem: as garrafas apoiam na mesma base */}
                <div className="relative flex h-44 w-full items-end justify-center rounded-xl bg-linear-to-b from-gelo to-white px-2 pb-2 sm:h-64">
                  <div className="absolute bottom-1 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-navy/15 blur-sm sm:w-24" />
                  <Image
                    src={f.imagem}
                    alt={`Garrafa de ${f.litros} litros Água do Limpopo`}
                    width={300}
                    height={450}
                    className={`${f.altura} relative w-auto mix-blend-multiply transition-transform duration-300 group-hover:scale-105`}
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

                {/* Botão de encomenda */}
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