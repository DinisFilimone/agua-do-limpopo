export const WHATSAPP_NUMBER = "258846804381";
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Olá! Gostaria de encomendar água da Água do Limpopo."
)}`;
export const SLOGAN = "Pura, Segura, Sempre";

export const whatsappPara = (mensagem: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;

export const MORADA = "Xai-Xai, Gaza";
export const EMAIL_CONTACTO = ""; // ex.: "info@..." (vazio = não aparece no site)
export const HORARIO = ""; // ex.: "Seg–Sáb 07:00–18:00" (vazio = não aparece)


// Números para pagamento móvel (vazio até existirem)
export const PAGAMENTO_NUMEROS = { mpesa: "", emola: "" };

export const telefoneFormatado = () => {
  const n = WHATSAPP_NUMBER;
  return n.length === 12 ? `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`;
};

export type Modo = "recarga" | "cheio" | "vazio";

export const MODOS: Record<Modo, { nome: string; desc: string; curto: string }> = {
  recarga: { nome: "Recarga", desc: "Já tenho o garrafão", curto: "recarga" },
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

export const TAXA_ENTREGA = { min: 30, max: 50 };

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