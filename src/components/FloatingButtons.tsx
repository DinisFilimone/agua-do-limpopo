"use client";

import { useEffect, useState } from "react";
import { whatsappPara } from "@/lib/config";

export default function FloatingButtons() {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    const f = () => setMostrar(window.scrollY > 600);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-center gap-3 sm:bottom-5 sm:right-5">
      <button
        type="button"
        aria-label="Voltar ao topo"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`hidden h-11 w-11 items-center justify-center rounded-full bg-navy text-white shadow-lg transition sm:flex ${
          mostrar ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
      <a
        href={whatsappPara("Olá! Gostaria de mais informações.")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105 sm:h-14 sm:w-14"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current sm:h-7 sm:w-7" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </a>
    </div>
  );
}