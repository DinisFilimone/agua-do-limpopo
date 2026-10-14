export const WHATSAPP_NUMBER = "258846804381";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de encomendar água da Água do Limpopo."
)}`;
export const SLOGAN = "Pura, Segura, Sempre";

export const whatsappPara = (mensagem: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

export const MORADA = "Estrada Nacional N1, Paragem Sossega, Bairro 11, Cidade de Xai-Xai, Gaza";
export const EMAIL_CONTACTO = "dinisfilimonejunior@gmail.com";
export const HORARIO = "Seg–Sex: 08h–19h · Sáb–Dom: 09h–15h";


// Números para pagamento móvel (vazio até existirem)
export const PAGAMENTO_NUMEROS = { mpesa: "", emola: "" };

export const telefoneFormatado = () => {
  const n = WHATSAPP_NUMBER;
  return n.length === 12 ? `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`;
};

export type Modo = "recarga" | "cheio" | "vazio";

export const MODOS: Record<Modo, { nome: string; desc: string; curto: string }> = {
  recarga: { nome: "Troca ao domicílio", desc: "Tenho o garrafão vazio", curto: "troca" },
  cheio: { nome: "Garrafão com água", desc: "Preciso do garrafão", curto: "com garrafão" },
  vazio: { nome: "Só o garrafão", desc: "Garrafão vazio", curto: "garrafão vazio" },
};

// Preços em MT. null = por confirmar.
export const PRECOS: Record<number, Record<Modo, number | null>> = {
  5: { recarga: 25, cheio: 70, vazio: null },
  6: { recarga: 25, cheio: 70, vazio: null },
  10: { recarga: 35, cheio: 100, vazio: null },
  20: { recarga: 45, cheio: 120, vazio: null },
};

export type Zona = "baixa" | "bairro11" | "outro";

export const ZONAS: Record<Zona, { nome: string; taxa: number }> = {
  baixa: { nome: "Baixa da cidade", taxa: 0 },
  bairro11: { nome: "Bairro 11", taxa: 0 },
  outro: { nome: "Outro bairro de Xai-Xai", taxa: 20 },
};


export const mt = (v: number) => `${v.toLocaleString("pt-PT")} MT`;

export const preco = (litros: number, modo: Modo): number | null => PRECOS[litros]?.[modo] ?? null;

// "Só o garrafão" só aparece quando tiver preço definido
export function modosDisponiveis(litros: number): Modo[] {
  return (["recarga", "cheio", "vazio"] as Modo[]).filter(
    (m) => m !== "vazio" || preco(litros, m) != null
  );
}

export function totalItens(
  itens: { litros: number; modo: Modo; quantidade: number }[]
): number | null {
  let soma = 0;
  for (const i of itens) {
    const p = preco(i.litros, i.modo);
    if (p == null) return null;
    soma += p * i.quantidade;
  }
  return soma;
}

export const TAXA_ENTREGA = 20; // MT, fora das zonas grátis

// Bairros com entrega grátis (baixa da cidade e Bairro 11).
// Para acrescentar um bairro, basta pôr mais uma linha aqui.
export const BAIRROS_GRATIS = [
  "Bairro 11",
  "Bairro 8",
  "Bairro A",
  "Bairro B",
  "Fenicelene",
  "Zona do mercado Limpopo",
  "Zona do mercado grossista",
  "Pontinha",
];

// Outras formas de escrever (não aparecem na lista de sugestões)
const ALIASES_GRATIS = ["Baixa", "Baixa da cidade", "Mercado Limpopo", "Mercado grossista"];

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

// null = ainda não escreveram o bairro; 0 = grátis; senão, a taxa
export function taxaEntrega(bairro: string): number | null {
  const b = normalizar(bairro);
  if (b.length < 2) return null;
  const texto = ` ${b} `;
  const gratis = [...BAIRROS_GRATIS, ...ALIASES_GRATIS].some((n) => texto.includes(` ${normalizar(n)} `));
  return gratis ? 0 : TAXA_ENTREGA;
}