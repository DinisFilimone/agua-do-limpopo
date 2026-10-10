"use client";

import { createContext, useCallback, useContext, useState } from "react";
import CheckoutModal from "./CheckoutModal";

type Contexto = {
  abrirCheckout: (litros?: number) => void;
  assunto: string;
  definirAssunto: (a: string) => void;
};

const SiteContext = createContext<Contexto | null>(null);

export function useSite() {
  const c = useContext(SiteContext);
  if (!c) throw new Error("useSite tem de ser usado dentro de SiteProvider");
  return c;
}

export default function SiteProvider({ children }: { children: React.ReactNode }) {
  const [checkout, setCheckout] = useState<{ aberto: boolean; litros?: number; chave: number }>({
    aberto: false,
    chave: 0,
  });
  const [assunto, definirAssunto] = useState("duvida");

  const abrirCheckout = useCallback((litros?: number) => {
    setCheckout((c) => ({ aberto: true, litros, chave: c.chave + 1 }));
  }, []);

  return (
    <SiteContext.Provider value={{ abrirCheckout, assunto, definirAssunto }}>
      {children}
      <CheckoutModal
        key={checkout.chave}
        aberto={checkout.aberto}
        litrosInicial={checkout.litros}
        aoFechar={() => setCheckout((c) => ({ ...c, aberto: false }))}
      />
    </SiteContext.Provider>
  );
}