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

// Preços em MT por formato. null = por definir (o site mostra "a confirmar").
export const PRECOS: Record<number, number | null> = { 5: null, 6: null, 10: null, 20: null };

// Números para pagamento móvel (vazio até existirem)
export const PAGAMENTO_NUMEROS = { mpesa: "", emola: "" };

export const telefoneFormatado = () => {
  const n = WHATSAPP_NUMBER;
  return n.length === 12 ? `+${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 8)} ${n.slice(8)}` : `+${n}`;
};