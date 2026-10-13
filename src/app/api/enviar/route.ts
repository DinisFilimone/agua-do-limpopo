import { emailValido, telefoneValido } from "@/lib/validacao";
import { MODOS, TAXA_ENTREGA, mt, preco, totalItens, type Modo } from "@/lib/config";

const PAGAMENTOS: Record<string, string> = {
  mpesa: "M-Pesa",
  emola: "e-Mola",
  dinheiro: "Dinheiro na entrega",
};
const FORMATOS = [5, 6, 10, 20];
const MODOS_VALIDOS = Object.keys(MODOS) as Modo[];

const texto = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const falha = (erro: string, status = 400) => Response.json({ ok: false, erro }, { status });

export async function POST(req: Request) {
  let c: Record<string, unknown>;
  try {
    c = (await req.json()) as Record<string, unknown>;
  } catch {
    return falha("Pedido inválido.");
  }

  // campo-armadilha para robôs
  if (texto(c.website)) return Response.json({ ok: true, referencia: "ADL-000000" });

  const nome = texto(c.nome, 100);
  const telefone = texto(c.telefone, 30);
  if (nome.length < 2 || !telefoneValido(telefone)) return falha("Dados de contacto inválidos.");

  const ref = "ADL-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  let assunto: string;
  let corpo: string;
  let total: number | null = null;

  if (c.tipo === "encomenda") {
    const bairro = texto(c.bairro, 100);
    const pagamento = texto(c.pagamento, 20);
    const itens = (Array.isArray(c.itens) ? c.itens : []).map((i) => {
      const o = i as Record<string, unknown>;
      return {
        litros: Number(o.litros),
        modo: String(o.modo) as Modo,
        quantidade: Number(o.quantidade),
      };
    });
    const itensValidos =
      itens.length > 0 &&
      itens.every(
        (i) =>
          FORMATOS.includes(i.litros) &&
          MODOS_VALIDOS.includes(i.modo) &&
          Number.isInteger(i.quantidade) &&
          i.quantidade >= 1 &&
          i.quantidade <= 50
      );
    if (bairro.length < 2 || !PAGAMENTOS[pagamento] || !itensValidos) return falha("Dados do pedido inválidos.");

    // o total é sempre calculado aqui, nunca aceite do browser
    total = totalItens(itens);

    assunto = `Novo pedido ${ref}`;
    corpo = [
      `Referência: ${ref}`,
      "",
      "Itens:",
      ...itens.map((i) => {
        const p = preco(i.litros, i.modo);
        const valor = p != null ? mt(p * i.quantidade) : "preço a confirmar";
        return `- ${i.quantidade} × ${i.litros} L (${MODOS[i.modo].nome}) — ${valor}`;
      }),
      total != null ? `Subtotal: ${mt(total)}` : "Subtotal: a confirmar",
      `Taxa de entrega: ${TAXA_ENTREGA.min} a ${TAXA_ENTREGA.max} MT (a confirmar consoante o bairro)`,
      "",
      `Nome: ${nome}`,
      `Telefone: ${telefone}`,
      `Bairro: ${bairro}`,
      `Ponto de referência: ${texto(c.ponto, 200) || "-"}`,
      `Pagamento: ${PAGAMENTOS[pagamento]}`,
    ].join("\n");
  } else if (c.tipo === "contacto") {
    const email = texto(c.email, 120);
    const mensagem = texto(c.mensagem, 2000);
    if (mensagem.length < 10 || (email && !emailValido(email))) return falha("Dados da mensagem inválidos.");

    assunto = `Novo contacto (${texto(c.assunto, 80) || "sem assunto"})`;
    corpo = [
      `Nome: ${nome}`,
      `Telefone: ${telefone}`,
      `Email: ${email || "-"}`,
      texto(c.entidade, 120) ? `Entidade: ${texto(c.entidade, 120)}` : "",
      texto(c.consumo, 80) ? `Consumo estimado: ${texto(c.consumo, 80)}` : "",
      "",
      "Mensagem:",
      mensagem,
    ]
      .filter((l, i, a) => l !== "" || a[i - 1] !== "")
      .join("\n");
  } else {
    return falha("Pedido inválido.");
  }

  const chave = process.env.RESEND_API_KEY;
  const destino = process.env.EMAIL_DESTINO;

  if (!chave || !destino) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\n[MODO DE TESTE] ${assunto}\n${corpo}\n`);
      return Response.json({ ok: true, referencia: ref, total, simulado: true });
    }
    return falha("O envio ainda não está configurado.", 503);
  }

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${chave}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.EMAIL_REMETENTE ?? "Água do Limpopo <onboarding@resend.dev>",
      to: [destino],
      subject: assunto,
      text: corpo,
    }),
  });
  if (!r.ok) return falha("Não foi possível enviar neste momento.", 502);

  return Response.json({ ok: true, referencia: ref, total });
}