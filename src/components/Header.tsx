"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useSite } from "./SiteProvider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINKS = [
  { id: "formatos", label: "Formatos" },
  { id: "qualidade", label: "Qualidade" },
  { id: "clientes", label: "Para quem" },
  { id: "xai-xai", label: "Xai-Xai" },
  { id: "contactos", label: "Contactos" },
];

export default function Header() {
  const root = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
    const { abrirCheckout } = useSite();

  // cabeçalho muda de aspecto ao descer
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // barra que enche conforme o progresso dentro de cada secção
  useGSAP(
    () => {
      LINKS.forEach((link, i) => {
        const section = document.getElementById(link.id);
        const bar = root.current?.querySelector(`[data-bar="${link.id}"]`);
        if (!section || !bar) return;
        const isLast = i === LINKS.length - 1;

        ScrollTrigger.create({
          trigger: section,
          start: "top 60%",
          end: isLast ? "bottom bottom" : "bottom 60%",
          onUpdate: (self) => {
            gsap.set(bar, { width: `${self.progress * 100}%` });
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <header
      ref={root}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 shadow-md backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#inicio" className="flex items-center gap-2">
          <Image
            src="/brand/gota.png"
            alt="Gota Água do Limpopo"
            width={120}
            height={97}
            className="h-10 w-auto"
            priority
          />
          <span
            className={`text-lg font-extrabold tracking-tight transition-colors ${
              scrolled ? "text-navy" : "text-white"
            }`}
          >
            Água do{" "}
            <span className={scrolled ? "text-azul" : "text-ciano"}>Limpopo</span>
          </span>
        </a>

        <nav className="hidden gap-8 text-sm font-semibold md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`relative py-2 transition-colors ${
                scrolled
                  ? "text-navy hover:text-azul"
                  : "text-white/90 hover:text-white"
              }`}
            >
              {l.label}
              <span className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden rounded-full bg-navy/10">
                <span
                  data-bar={l.id}
                  className="block h-full rounded-full bg-azul"
                  style={{ width: "0%" }}
                />
              </span>
            </a>
          ))}
        </nav>

                <button
          type="button"
          onClick={() => abrirCheckout()}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            scrolled ? "bg-azul text-white hover:bg-navy" : "bg-white text-navy hover:bg-ciano"
          }`}
        >
          Encomendar
        </button>
      </div>
    </header>
  );
}