import Image from "next/image";
import { HORARIO, MORADA, TAXA_ENTREGA } from "@/lib/config";
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
    <section id="formatos" className="scroll-mt-20 bg-gelo px-6 pb-10 pt-16 sm:pb-12 sm:pt-24">
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
          {FORMATOS.map((f, i) => (
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
                  sizes="(min-width: 1024px) 220px, 160px"
                  className={`${f.altura} relative w-auto mix-blend-multiply transition-transform duration-300 group-hover:scale-105`}
                />
              </div>

              {/* Capacidade */}
              <p className="mt-4 text-4xl font-extrabold text-navy sm:text-5xl">
                {f.litros}
                <span className="ml-1 text-lg text-azul sm:text-xl">L</span>
              </p>
              <p className="mt-1 flex-1 text-[11px] text-navy/50 sm:text-xs">{f.legenda}</p>

              <EncomendarButton
                litros={f.litros}
                className="pressionar mt-4 w-full rounded-full bg-azul py-2.5 text-sm font-semibold text-white hover:bg-navy sm:mt-5"
              >
                Encomendar
              </EncomendarButton>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Recarga no local",
                            d: `Traga o seu garrafão vazio à nossa unidade (${MORADA}) e pague só a recarga. Aberto ${HORARIO}. Não precisa de encomendar aqui.`,
            },
            {
              t: "Troca ao domicílio",
              d: "Encomende aqui e tenha o garrafão vazio pronto. Entregamos um garrafão cheio e higienizado do mesmo formato e levamos o vazio.",
            },
            {
              t: "Garrafão com água",
              d: "Ainda não tem garrafão? Compre-o já cheio. Nas próximas vezes, paga só a recarga ou a troca.",
            },
          ].map((o, i) => (
            <div
              key={o.t}
              data-reveal
              data-delay={i * 0.1}
              className="rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-navy/5"
            >
              <p className="font-bold text-navy">{o.t}</p>
              <p className="mt-2 text-sm text-navy/70">{o.d}</p>
            </div>
          ))}
        </div>

                <p data-reveal className="mx-auto mt-6 max-w-2xl text-center text-xs text-navy/50">
          Aceitamos garrafões dos nossos formatos (5, 6, 10 e 20 L), que higienizamos. Garrafões danificados não
                    são aceites: nesse caso, paga o preço do garrafão com água. Entrega ao domicílio em Xai-Xai: grátis na
          baixa da cidade e no Bairro 11; nos restantes bairros, {TAXA_ENTREGA} MT.
        </p>
      </div>
    </section>
  );
}