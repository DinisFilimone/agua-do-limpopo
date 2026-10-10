import { WHATSAPP_LINK } from "@/lib/config";

export default function Contactos() {
  return (
    <section id="contactos" className="scroll-mt-20 bg-white px-6 pt-24">
      <div data-reveal className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-azul">
          Contactos
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
          Faça a sua encomenda hoje
        </h2>
        <p className="mt-4 text-navy/70">
          Fale connosco pelo WhatsApp e receba água tratada em sua casa ou no seu negócio.
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-folha px-9 py-3.5 font-semibold text-white shadow-lg transition hover:brightness-110"
        >
          Encomendar no WhatsApp
        </a>
        <p className="mt-6 text-sm font-semibold text-navy/60">Xai-Xai | Gaza</p>
      </div>

      <footer className="mt-20 border-t border-navy/10 py-6 text-center text-xs text-navy/50">
        © 2026 Água do Limpopo. Todos os direitos reservados.
      </footer>
    </section>
  );
}