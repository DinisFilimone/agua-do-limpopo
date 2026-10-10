"use client";

import { useSite } from "./SiteProvider";

export function EncomendarButton({
  litros,
  className,
  children,
}: {
  litros?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const { abrirCheckout } = useSite();
  return (
    <button type="button" onClick={() => abrirCheckout(litros)} className={className}>
      {children}
    </button>
  );
}

export function BotaoContacto({
  assunto,
  className,
  children,
}: {
  assunto: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { definirAssunto } = useSite();
  return (
    <a href="#contactos" onClick={() => definirAssunto(assunto)} className={className}>
      {children}
    </a>
  );
}