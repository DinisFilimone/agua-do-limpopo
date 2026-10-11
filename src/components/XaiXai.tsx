import XaiXaiSlider from "./XaiXaiSlider";
import { BotaoContacto } from "./Botoes";

export default function XaiXai() {
  return (
    <section id="xai-xai" className="scroll-mt-20 overflow-hidden bg-white px-6 py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div data-reveal>
          <p className="text-sm font-bold uppercase tracking-widest text-azul">Xai-Xai | Gaza</p>
          <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
            Água tratada, <span className="text-azul">aqui em Xai-Xai</span>
          </h2>
          <p className="mt-5 text-navy/70">
            A nossa unidade fica em Xai-Xai e entregamos ao domicílio. Diga-nos o seu bairro e
            confirmamos a entrega.
          </p>
          <BotaoContacto
            assunto="entrega"
            className="mt-7 inline-block rounded-full bg-folha px-8 py-3 font-semibold text-white transition hover:brightness-110"
          >
            Confirmar entrega no meu bairro
          </BotaoContacto>
        </div>

        <div data-reveal>
          <XaiXaiSlider />
        </div>
      </div>
    </section>
  );
}