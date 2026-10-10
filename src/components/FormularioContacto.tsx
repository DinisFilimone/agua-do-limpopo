"use client";

import { useState } from "react";
import { emailValido, telefoneValido } from "@/lib/validacao";
import { whatsappPara } from "@/lib/config";
import { Campo, Seletor } from "./ui";
import { useSite } from "./SiteProvider";

const ASSUNTOS = [
  { id: "duvida", nome: "Dúvidas e informações" },
  { id: "fornecimento", nome: "Fornecimento regular (empresas e instituições)" },
  { id: "entrega", nome: "Zona de entrega" },
  { id: "outro", nome: "Outro assunto" },
];

const VAZIO = { nome: "", telefone: "", email: "", entidade: "", consumo: "", mensagem: "" };

export default function FormularioContacto() {
  const { assunto, definirAssunto } = useSite();
  const [d, setD] = useState(VAZIO);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "erro" | "ok">("idle");
  const [armadilha, setArmadilha] = useState("");

  const mudar = (k: keyof typeof VAZIO) => (v: string) => setD((x) => ({ ...x, [k]: v }));
  const nomeAssunto = ASSUNTOS.find((a) => a.id === assunto)?.nome ?? "Outro assunto";

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (d.nome.trim().length < 2) er.nome = "Indique o seu nome.";
    if (!telefoneValido(d.telefone)) er.telefone = "Indique um número válido, por exemplo 84 123 4567.";
    if (d.email && !emailValido(d.email)) er.email = "Email inválido.";
    if (d.mensagem.trim().length < 10) er.mensagem = "Escreva uma mensagem com pelo menos 10 caracteres.";
    setErros(er);
    if (Object.keys(er).length) return;

    setEstado("enviando");
    try {
      const r = await fetch("/api/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "contacto", assunto: nomeAssunto, ...d, website: armadilha }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error();
      setD(VAZIO);
      setEstado("ok");
    } catch {
      setEstado("erro");
    }
  }

  if (estado === "ok") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center text-navy shadow-xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-folha/15 text-2xl text-folha">
          ✓
        </span>
        <h3 className="mt-4 text-xl font-extrabold">Mensagem enviada</h3>
        <p className="mt-2 text-sm text-navy/70">Obrigado pelo contacto. Respondemos o mais breve possível.</p>
        <button
          type="button"
          onClick={() => setEstado("idle")}
          className="mt-6 rounded-full border border-navy/20 px-6 py-2.5 text-sm font-semibold transition hover:bg-gelo"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="rounded-3xl bg-white p-6 text-navy shadow-xl sm:p-8">
      <h3 className="text-xl font-extrabold">Envie-nos uma mensagem</h3>

      <div className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="f-nome" rotulo="Nome" valor={d.nome} aoMudar={mudar("nome")} erro={erros.nome} autoComplete="name" />
          <Campo
            id="f-tel"
            rotulo="Telefone"
            valor={d.telefone}
            aoMudar={mudar("telefone")}
            erro={erros.telefone}
            tipo="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="84 123 4567"
          />
        </div>

        <Campo
          id="f-email"
          rotulo="Email"
          valor={d.email}
          aoMudar={mudar("email")}
          erro={erros.email}
          tipo="email"
          inputMode="email"
          autoComplete="email"
          opcional
        />

        <Seletor id="f-assunto" rotulo="Assunto" valor={assunto} aoMudar={definirAssunto} opcoes={ASSUNTOS} />

        {assunto === "fornecimento" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              id="f-entidade"
              rotulo="Empresa ou instituição"
              valor={d.entidade}
              aoMudar={mudar("entidade")}
              opcional
            />
            <Campo
              id="f-consumo"
              rotulo="Consumo estimado"
              valor={d.consumo}
              aoMudar={mudar("consumo")}
              placeholder="Ex.: 10 recargas por semana"
              opcional
            />
          </div>
        )}

        <Campo id="f-msg" rotulo="Mensagem" valor={d.mensagem} aoMudar={mudar("mensagem")} erro={erros.mensagem} area />

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={armadilha}
          onChange={(e) => setArmadilha(e.target.value)}
          className="absolute left-[-9999px]"
        />
      </div>

      {estado === "erro" && (
        <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">
          Não foi possível enviar a mensagem.{" "}
          <a
            href={whatsappPara(`Olá! ${d.mensagem}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            Enviar pelo WhatsApp
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="mt-6 w-full rounded-full bg-azul py-3 text-sm font-semibold text-white transition hover:bg-navy disabled:opacity-60"
      >
        {estado === "enviando" ? "A enviar…" : "Enviar mensagem"}
      </button>
    </form>
  );
}