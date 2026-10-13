"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  MODOS,
  TAXA_ENTREGA,
  modosDisponiveis,
  mt,
  preco,
  totalItens,
  whatsappPara,
  type Modo,
} from "@/lib/config";
import { telefoneValido } from "@/lib/validacao";
import { Campo } from "./ui";

const FORMATOS = [5, 6, 10, 20];
const PASSOS = ["Pedido", "Entrega", "Pagamento"];

const PAGAMENTOS = [
  { id: "mpesa", nome: "M-Pesa", desc: "Pagamento pelo telemóvel" },
  { id: "emola", nome: "e-Mola", desc: "Pagamento pelo telemóvel" },
  { id: "dinheiro", nome: "Dinheiro na entrega", desc: "Pague quando receber" },
] as const;

type Pagamento = (typeof PAGAMENTOS)[number]["id"];
type Props = { aberto: boolean; litrosInicial?: number; aoFechar: () => void };

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
  const [modo, setModo] = useState<Record<number, Modo | "">>({ 5: "", 6: "", 10: "", 20: "" });
  const [dados, setDados] = useState({ nome: "", telefone: "", bairro: "", ponto: "" });
  const [pagamento, setPagamento] = useState<Pagamento | "">("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<"idle" | "enviando" | "erro" | "ok">("idle");
  const [referencia, setReferencia] = useState("");
  const [totalFinal, setTotalFinal] = useState<number | null>(null);
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

  const itens = FORMATOS.filter((l) => qtd[l] > 0).map((l) => ({
    litros: l,
    modo: modo[l] as Modo,
    quantidade: qtd[l],
  }));
  const completos = itens.every((i) => i.modo);
  const total = completos ? totalItens(itens) : null;
  const resumo = itens
    .map((i) => `${i.quantidade} × ${i.litros} L${i.modo ? ` (${MODOS[i.modo].curto})` : ""}`)
    .join(" · ");
  const metodo = PAGAMENTOS.find((p) => p.id === pagamento);

  const alterar = (l: number, d: number) => {
    setErros({});
    setQtd((q) => ({ ...q, [l]: Math.min(50, Math.max(0, q[l] + d)) }));
  };
  const escolher = (l: number, m: Modo) => {
    setErros({});
    setModo((x) => ({ ...x, [l]: m }));
  };
  const mudar = (campo: keyof typeof dados) => (v: string) => setDados((x) => ({ ...x, [campo]: v }));

  function seguinte() {
    const e: Record<string, string> = {};
    if (passo === 1) {
      if (itens.length === 0) e.itens = "Escolha pelo menos um formato.";
      else if (!completos) e.itens = "Para cada formato, indique se é recarga ou se precisa do garrafão.";
    }
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
        body: JSON.stringify({ tipo: "encomenda", itens, ...dados, pagamento, website: armadilha }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error();
      setReferencia(j.referencia);
      setTotalFinal(typeof j.total === "number" ? j.total : null);
      setSimulado(Boolean(j.simulado));
      setEstado("ok");
      setPasso(4);
    } catch {
      setEstado("erro");
    }
  }

  function instrucoes() {
    if (pagamento === "dinheiro")
      return `Vamos contactá-lo no ${dados.telefone} para confirmar o valor final, com a taxa de entrega, e combinar a entrega. Pague em dinheiro quando receber.`;
    return `Vamos contactá-lo no ${dados.telefone} para confirmar o valor final, com a taxa de entrega, e indicar como concluir o pagamento por ${metodo?.nome}.`;
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
              {passo === 4 ? "Pedido registado" : "Água tratada e purificada"}
            </h2>
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            className="pressionar rounded-full p-2 text-navy/60 hover:bg-gelo hover:text-navy"
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
          <div className="mt-6">
            <p className="rounded-xl bg-gelo p-3 text-xs text-navy/70">
              Já tem garrafão? Escolha <strong>Recarga</strong>. Se ainda não tem, escolha{" "}
              <strong>Garrafão com água</strong>.
            </p>

            <div className="mt-4 space-y-3">
              {FORMATOS.map((l) => {
                const q = qtd[l];
                const falta = Boolean(erros.itens) && q > 0 && !modo[l];
                const borda = falta
                  ? "border-red-400 bg-red-50/40"
                  : q > 0
                    ? "border-azul/40 bg-azul/5"
                    : "border-navy/10";
                return (
                  <div key={l} className={`rounded-2xl border p-4 transition ${borda}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Image
                          src={`/brand/garrafao-${l}l.png`}
                          alt=""
                          width={48}
                          height={72}
                          className="h-14 w-auto mix-blend-multiply"
                        />
                        <p className="text-lg font-extrabold">{l} L</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label={`Menos uma unidade de ${l} litros`}
                          onClick={() => alterar(l, -1)}
                          className="pressionar h-9 w-9 rounded-full border border-navy/15 bg-white text-lg hover:bg-gelo"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-bold" aria-live="polite">
                          {q}
                        </span>
                        <button
                          type="button"
                          aria-label={`Mais uma unidade de ${l} litros`}
                          onClick={() => alterar(l, 1)}
                          className="pressionar h-9 w-9 rounded-full border border-navy/15 bg-white text-lg hover:bg-gelo"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {q > 0 && (
                      <fieldset className="mt-3">
                        <legend className="sr-only">Tipo de compra para {l} litros</legend>
                        <div className="grid grid-cols-2 gap-2">
                          {modosDisponiveis(l).map((m) => {
                            const p = preco(l, m);
                            const ativo = modo[l] === m;
                            return (
                              <label
                                key={m}
                                className={`cursor-pointer rounded-xl border bg-white p-3 text-left text-xs transition focus-within:ring-2 focus-within:ring-azul/40 ${
                                  ativo ? "border-azul ring-2 ring-azul/30" : "border-navy/15 hover:border-azul/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`modo-${l}`}
                                  value={m}
                                  checked={ativo}
                                  onChange={() => escolher(l, m)}
                                  className="sr-only"
                                />
                                <span className="block text-sm font-bold">{MODOS[m].nome}</span>
                                <span className="block text-navy/60">{MODOS[m].desc}</span>
                                <span className="mt-1 block font-bold text-azul">
                                  {p != null ? mt(p) : "Preço a confirmar"}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>
                    )}
                  </div>
                );
              })}
            </div>
            {erros.itens && <p className="mt-3 text-xs text-red-600">{erros.itens}</p>}
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
                Depois de confirmar o pedido, entramos em contacto consigo com as instruções para concluir o pagamento.
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
          <div className="mt-6 text-center">
            <div className="surgir mx-auto h-16 w-16">
              <svg
                viewBox="0 0 52 52"
                className="h-16 w-16"
                fill="none"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle className="check-circulo" cx="26" cy="26" r="25" stroke="#0a9a0a" />
                <path className="check-visto" d="M14 27l8 8 16-17" stroke="#0a9a0a" />
              </svg>
            </div>
            <h3 className="mt-4 text-xl font-extrabold">Obrigado pelo seu pedido!</h3>

            <div className="mt-5 rounded-2xl bg-gelo p-5 text-left">
              <p className="text-sm text-navy/70">Referência do pedido</p>
              <p className="text-2xl font-extrabold tracking-wide text-azul">{referencia}</p>
              <p className="mt-3 text-sm font-semibold">{resumo}</p>
              <p className="text-sm text-navy/70">
                {totalFinal != null ? `Subtotal: ${mt(totalFinal)}` : "Subtotal a confirmar"} · Entrega em{" "}
                {dados.bairro}
              </p>
              <p className="mt-1 text-xs text-navy/50">
                Taxa de entrega de {TAXA_ENTREGA.min} a {TAXA_ENTREGA.max} MT, consoante o bairro.
              </p>
            </div>

            <p className="mt-5 text-left text-sm text-navy/80">{instrucoes()}</p>
            {simulado && (
              <p className="mt-4 rounded-xl bg-amber-50 p-3 text-left text-xs text-amber-800">
                Modo de teste: o pedido não foi enviado por email porque o envio ainda não está configurado.
              </p>
            )}
            <button
              type="button"
              onClick={aoFechar}
              className="pressionar mt-6 w-full rounded-full bg-azul py-3 text-sm font-semibold text-white hover:bg-navy"
            >
              Fechar
            </button>
          </div>
        )}

        {passo < 4 && (
          <div className="mt-8 border-t border-navy/10 pt-5">
            <div className="flex items-start justify-between gap-4 text-sm">
              <span className="text-navy/70">{resumo || "Nenhum formato escolhido"}</span>
              <span className="shrink-0 text-right font-bold">
                {total != null ? mt(total) : "Total a confirmar"}
              </span>
            </div>
            <p className="mt-1 text-xs text-navy/50">
              + taxa de entrega: {TAXA_ENTREGA.min} a {TAXA_ENTREGA.max} MT, consoante o bairro
            </p>

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
                  className="pressionar rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold hover:bg-gelo"
                >
                  Voltar
                </button>
              )}
              {passo < 3 ? (
                <button
                  type="button"
                  onClick={seguinte}
                  className="pressionar flex-1 rounded-full bg-azul py-3 text-sm font-semibold text-white hover:bg-navy"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="button"
                  onClick={enviar}
                  disabled={estado === "enviando"}
                  className="pressionar flex-1 rounded-full bg-folha py-3 text-sm font-semibold text-white hover:brightness-110 disabled:opacity-60"
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