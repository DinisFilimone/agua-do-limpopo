"use client";

import { useEffect, useRef, useState } from "react";
import { PAGAMENTO_NUMEROS, PRECOS, whatsappPara } from "@/lib/config";
import { telefoneValido } from "@/lib/validacao";
import { Campo } from "./ui";
import Image from "next/image";

const FORMATOS = [5, 6, 10, 20];
const PASSOS = ["Pedido", "Entrega", "Pagamento"];

const PAGAMENTOS = [
  { id: "mpesa", nome: "M-Pesa", desc: "Pagamento pelo telemóvel" },
  { id: "emola", nome: "e-Mola", desc: "Pagamento pelo telemóvel" },
  { id: "dinheiro", nome: "Dinheiro na entrega", desc: "Pague quando receber" },
] as const;

type Pagamento = (typeof PAGAMENTOS)[number]["id"];
type Props = { aberto: boolean; litrosInicial?: number; aoFechar: () => void };

const mt = (v: number) => `${v.toLocaleString("pt-PT")} MT`;

export default function CheckoutModal({ aberto, litrosInicial, aoFechar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [passo, setPasso] = useState(1);
  const [qtd, setQtd] = useState<Record<number, number>>(() => ({
    5: 0,
    6: 0,
    10: 0,
    20: 0,
    ...(litrosInicial ? { [litrosInicial]: 1 } : {}),
  }));
  const [dados, setDados] = useState({ nome: "", telefone: "", bairro: "", ponto: "" });
  const [pagamento, setPagamento] = useState<Pagamento | "">("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "erro" | "ok">("idle");
  const [referencia, setReferencia] = useState("");
  const [simulado, setSimulado] = useState(false);
  const [armadilha, setArmadilha] = useState("");

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  const itens = FORMATOS.filter((l) => qtd[l] > 0).map((l) => ({ litros: l, quantidade: qtd[l] }));
  const total =
    itens.length > 0 && itens.every((i) => PRECOS[i.litros] != null)
      ? itens.reduce((s, i) => s + (PRECOS[i.litros] as number) * i.quantidade, 0)
      : null;
  const resumo = itens.map((i) => `${i.quantidade} × ${i.litros} L`).join(" · ");
  const metodo = PAGAMENTOS.find((p) => p.id === pagamento);

  const alterar = (l: number, d: number) =>
    setQtd((q) => ({ ...q, [l]: Math.min(50, Math.max(0, q[l] + d)) }));
  const mudar = (campo: keyof typeof dados) => (v: string) => setDados((x) => ({ ...x, [campo]: v }));

  function seguinte() {
    const e: Record<string, string> = {};
    if (passo === 1 && itens.length === 0) e.itens = "Escolha pelo menos um formato.";
    if (passo === 2) {
      if (dados.nome.trim().length < 2) e.nome = "Indique o seu nome.";
      if (!telefoneValido(dados.telefone)) e.telefone = "Indique um número válido, por exemplo 84 123 4567.";
      if (dados.bairro.trim().length < 2) e.bairro = "Indique o bairro.";
    }
    setErros(e);
    if (Object.keys(e).length === 0) setPasso((p) => p + 1);
  }

  async function enviar() {
    if (!pagamento) {
      setErros({ pagamento: "Escolha uma forma de pagamento." });
      return;
    }
    setErros({});
    setEstado("enviando");
    try {
      const r = await fetch("/api/enviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipo: "encomenda", itens, ...dados, pagamento, total, website: armadilha }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error();
      setReferencia(j.referencia);
      setSimulado(Boolean(j.simulado));
      setEstado("ok");
      setPasso(4);
    } catch {
      setEstado("erro");
    }
  }

  function instrucoes() {
    if (pagamento === "dinheiro")
      return `Vamos contactá-lo no ${dados.telefone} para confirmar a entrega. Pague em dinheiro quando receber.`;
    if (pagamento === "mpesa" || pagamento === "emola") {
      const numero = PAGAMENTO_NUMEROS[pagamento];
      if (numero && total != null)
        return `Envie ${mt(total)} por ${metodo?.nome} para o número ${numero}, indicando a referência ${referencia}.`;
      return `Vamos contactá-lo no ${dados.telefone} com as instruções para concluir o pagamento por ${metodo?.nome}.`;
    }
    return "";
  }

  const textoWhats = `Olá! Quero encomendar: ${resumo}. Nome: ${dados.nome}. Bairro: ${dados.bairro}. Pagamento: ${metodo?.nome ?? ""}.`;

  return (
    <dialog
      ref={dialogo}
      onClose={aoFechar}
      onClick={(e) => e.target === e.currentTarget && aoFechar()}
      className="m-auto w-[min(94vw,620px)] rounded-3xl bg-transparent p-0 backdrop:bg-[#04245c]/70 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 text-navy sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-azul">Encomendar</p>
            <h2 className="mt-1 text-2xl font-extrabold">
              {passo === 4 ? "Pedido registado" : "Recarga de água tratada"}
            </h2>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="rounded-full p-2 text-navy/60 transition hover:bg-gelo hover:text-navy"
          >
            ✕
          </button>
        </div>

        {passo < 4 && (
          <ol className="mt-6 flex items-center gap-2 text-xs font-semibold">
            {PASSOS.map((n, i) => (
              <li key={n} className="flex flex-1 items-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    passo >= i + 1 ? "bg-azul text-white" : "bg-navy/10 text-navy/50"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={passo >= i + 1 ? "text-navy" : "text-navy/40"}>{n}</span>
                {i < 2 && <span className={`h-px flex-1 ${passo > i + 1 ? "bg-azul" : "bg-navy/10"}`} />}
              </li>
            ))}
          </ol>
        )}

        {passo === 1 && (
          <div className="mt-6 space-y-3">
            {FORMATOS.map((l) => {
              const preco = PRECOS[l];
              return (
                <div key={l} className="flex items-center justify-between rounded-2xl border border-navy/10 p-4">
                                    <div className="flex items-center gap-3">
                    <Image
                      src={`/brand/garrafao-${l}l.png`}
                      alt=""
                      width={48}
                      height={72}
                      className="h-14 w-auto mix-blend-multiply"
                    />
                    <div>
                      <p className="text-lg font-extrabold">{l} L</p>
                      <p className="text-xs text-navy/60">
                        {preco != null ? `${mt(preco)} por recarga` : "Preço a confirmar"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Menos uma recarga de ${l} litros`}
                      onClick={() => alterar(l, -1)}
                      className="h-9 w-9 rounded-full border border-navy/15 text-lg transition hover:bg-gelo"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-bold" aria-live="polite">
                      {qtd[l]}
                    </span>
                    <button
                      type="button"
                      aria-label={`Mais uma recarga de ${l} litros`}
                      onClick={() => alterar(l, 1)}
                      className="h-9 w-9 rounded-full border border-navy/15 text-lg transition hover:bg-gelo"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
            {erros.itens && <p className="text-xs text-red-600">{erros.itens}</p>}
          </div>
        )}

        {passo === 2 && (
          <div className="mt-6 space-y-4">
            <Campo id="c-nome" rotulo="Nome" valor={dados.nome} aoMudar={mudar("nome")} erro={erros.nome} autoComplete="name" />
            <Campo
              id="c-tel"
              rotulo="Telefone"
              valor={dados.telefone}
              aoMudar={mudar("telefone")}
              erro={erros.telefone}
              tipo="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="84 123 4567"
            />
            <Campo id="c-bairro" rotulo="Bairro" valor={dados.bairro} aoMudar={mudar("bairro")} erro={erros.bairro} />
            <Campo
              id="c-ponto"
              rotulo="Ponto de referência"
              valor={dados.ponto}
              aoMudar={mudar("ponto")}
              opcional
              placeholder="Ex.: perto do mercado"
            />
          </div>
        )}

        {passo === 3 && (
          <fieldset className="mt-6">
            <legend className="sr-only">Forma de pagamento</legend>
            <div className="space-y-3">
              {PAGAMENTOS.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                    pagamento === p.id
                      ? "border-azul bg-azul/5 ring-2 ring-azul/30"
                      : "border-navy/10 hover:border-azul/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="pagamento"
                    value={p.id}
                    checked={pagamento === p.id}
                    onChange={() => setPagamento(p.id)}
                    className="h-4 w-4 accent-[#0b8ff0]"
                  />
                  <span>
                    <span className="block font-bold">{p.nome}</span>
                    <span className="block text-xs text-navy/60">{p.desc}</span>
                  </span>
                </label>
              ))}
            </div>
            {erros.pagamento && <p className="mt-2 text-xs text-red-600">{erros.pagamento}</p>}
            {(pagamento === "mpesa" || pagamento === "emola") && (
              <p className="mt-4 text-xs text-navy/60">
                Depois de confirmar o pedido, receberá as instruções para concluir o pagamento.
              </p>
            )}
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
          </fieldset>
        )}

        {passo === 4 && (
          <div className="mt-6">
            <div className="rounded-2xl bg-gelo p-5">
              <p className="text-sm text-navy/70">Referência do pedido</p>
              <p className="text-2xl font-extrabold tracking-wide text-azul">{referencia}</p>
              <p className="mt-3 text-sm font-semibold">{resumo}</p>
              <p className="text-sm text-navy/70">
                {total != null ? `Total: ${mt(total)}` : "Total a confirmar"} · Entrega em {dados.bairro}
              </p>
            </div>
            <p className="mt-5 text-sm text-navy/80">{instrucoes()}</p>
            {simulado && (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
                Modo de teste: o pedido não foi enviado por email porque o envio ainda não está configurado.
              </p>
            )}
            <button
              type="button"
              onClick={aoFechar}
              className="mt-6 w-full rounded-full bg-azul py-3 text-sm font-semibold text-white transition hover:bg-navy"
            >
              Fechar
            </button>
          </div>
        )}

        {passo < 4 && (
          <div className="mt-8 border-t border-navy/10 pt-5">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-navy/70">{resumo || "Nenhum formato escolhido"}</span>
              <span className="font-bold">{total != null ? mt(total) : "Total a confirmar"}</span>
            </div>

            {estado === "erro" && (
              <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">
                Não foi possível enviar o pedido.{" "}
                <a
                  href={whatsappPara(textoWhats)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline"
                >
                  Enviar pelo WhatsApp
                </a>
              </p>
            )}

            <div className="mt-4 flex gap-3">
              {passo > 1 && (
                <button
                  type="button"
                  onClick={() => setPasso((p) => p - 1)}
                  className="rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold transition hover:bg-gelo"
                >
                  Voltar
                </button>
              )}
              {passo < 3 ? (
                <button
                  type="button"
                  onClick={seguinte}
                  className="flex-1 rounded-full bg-azul py-3 text-sm font-semibold text-white transition hover:bg-navy"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={enviar}
                  disabled={estado === "enviando"}
                  className="flex-1 rounded-full bg-folha py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                >
                  {estado === "enviando" ? "A enviar…" : "Confirmar pedido"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}