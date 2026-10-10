export const limparTelefone = (t: string) => t.replace(/[\s()-]/g, "");
export const telefoneValido = (t: string) => /^(\+?258)?8[2-7]\d{7}$/.test(limparTelefone(t));
export const emailValido = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);