import Image from "next/image";
import FormularioContacto from "./FormularioContacto";
import { BotaoContacto, EncomendarButton } from "./Botoes";
import {
  EMAIL_CONTACTO,
  HORARIO,
  MORADA,
  WHATSAPP_NUMBER,
  telefoneFormatado,
  whatsappPara,
} from "@/lib/config";

const NAV = [
  { href: "#formatos", t: "Formatos" },
  { href: "#qualidade", t: "Qualidade" },
  { href: "#clientes", t: "Para quem" },
  { href: "#xai-xai", t: "Xai-Xai" },
];

const PAGAMENTOS = ["M-Pesa", "e-Mola", "Dinheiro na entrega"];

function Info({ titulo, icon, children }: { titulo: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ciano/15">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-ciano"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/50">{titulo}</p>
        <div className="mt-1 font-semibold">{children}</div>
      </div>
    </div>
  );
}

export default function Contactos() {
  return (
    <section id="contactos" className="relative scroll-mt-20 bg-[#04245c] pt-24 sm:pt-32 text-white">
      <svg
        className="absolute inset-x-0 top-0 h-16 w-full"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 0H1440V40C1200 90 960 0 720 40S240 90 0 40Z" fill="#ffffff" />
      </svg>

      <div className="mx-auto max-w-6xl px-6">
        <div data-reveal className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-ciano">Contactos</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Fale connosco</h2>
          <p className="mt-4 text-white/70">
            Dúvidas, fornecimento para a sua empresa ou zona de entrega? Escreva-nos e respondemos o mais
            breve possível.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5">
          <div data-reveal className="space-y-4 lg:col-span-2">
            <Info
              titulo="Telefone e WhatsApp"
              icon={
                <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z" />
              }
            >
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="transition hover:text-ciano">
                {telefoneFormatado()}
              </a>
              <a
                href={whatsappPara("Olá! Gostaria de mais informações.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm font-normal text-ciano hover:underline"
              >
                Abrir conversa no WhatsApp
              </a>
            </Info>

            {EMAIL_CONTACTO && (
              <Info titulo="Email" icon={<path d="M3 5h18v14H3zM3 7l9 6 9-6" />}>
                <a href={`mailto:${EMAIL_CONTACTO}`} className="transition hover:text-ciano">
                  {EMAIL_CONTACTO}
                </a>
              </Info>
            )}

            <Info
              titulo="Localização"
              icon={
                <>
                  <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </>
              }
            >
              {MORADA}
            </Info>

            {HORARIO && (
              <Info
                titulo="Horário"
                icon={
                  <>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </>
                }
              >
                {HORARIO}
              </Info>
            )}
          </div>

          <div data-reveal className="lg:col-span-3">
            <FormularioContacto />
          </div>
        </div>

        <footer className="mt-20 border-t border-white/10 py-12">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white p-2">
                  <Image src="/brand/gota.png" alt="" width={120} height={97} className="h-8 w-auto" />
                </span>
                <span className="text-lg font-extrabold">
                  Água do <span className="text-ciano">Limpopo</span>
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm text-white/60">
                Água de qualidade para um futuro melhor. Água tratada e purificada, com entrega ao domicílio
                em Xai-Xai, Gaza.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {PAGAMENTOS.map((p) => (
                  <span key={p} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Navegação</p>
              <ul className="mt-4 space-y-3 text-sm">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <a href={n.href} className="text-white/80 transition hover:text-ciano">
                      {n.t}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-white/50">Encomendas</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <EncomendarButton className="text-white/80 transition hover:text-ciano">
                    Fazer uma encomenda
                  </EncomendarButton>
                </li>
                <li>
                  <BotaoContacto assunto="fornecimento" className="text-white/80 transition hover:text-ciano">
                    Fornecimento regular
                  </BotaoContacto>
                </li>
                <li>
                  <BotaoContacto assunto="entrega" className="text-white/80 transition hover:text-ciano">
                    Zona de entrega
                  </BotaoContacto>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
            © 2026 Água do Limpopo. Todos os direitos reservados.
          </div>
        </footer>
      </div>
    </section>
  );
}