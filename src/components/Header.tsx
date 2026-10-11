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
  const [menu, setMenu] = useState(false);
  const { abrirCheckout } = useSite();
  const solido = scrolled || menu;

  // cabeçalho muda de aspecto ao descer
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fechar o menu com a tecla Esc
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  // barra que enche conforme o progresso dentro de cada secção (desktop)
  useGSAP(
    () => {
      LINKS.forEach((link, i) => {
        const section = document.getElementById(link.id);
        const bar = root.current?.querySelector<HTMLElement>(`[data-bar="${link.id}"]`);
        if (!section || !bar) return;
        const isLast = i === LINKS.length - 1;

        gsap.fromTo(
          bar,
          { width: "0%" },
          {
            width: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              end: isLast ? "bottom bottom" : "bottom 60%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );
      });

      const refresh = () => ScrollTrigger.refresh();
      if (document.readyState === "complete") refresh();
      else window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);

      return () => window.removeEventListener("load", refresh);
    },
    { scope: root }
  );

  return (
    <header
      ref={root}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solido ? "bg-white/95 shadow-md backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <a href="#inicio" onClick={() => setMenu(false)} className="flex items-center gap-2">
          <Image
            src="/brand/gota.png"
            alt="Gota Água do Limpopo"
            width={120}
            height={97}
            className="h-10 w-auto"
            priority
          />
          <span
            className={`text-base font-extrabold tracking-tight transition-colors sm:text-lg ${
              solido ? "text-navy" : "text-white"
            }`}
          >
            Água do <span className={solido ? "text-azul" : "text-ciano"}>Limpopo</span>
          </span>
        </a>

        {/* menu desktop */}
        <nav className="hidden gap-6 text-sm font-semibold md:flex">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={`relative py-2 transition-colors ${
                solido ? "text-navy hover:text-azul" : "text-white/90 hover:text-white"
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => abrirCheckout()}
            className={`hidden rounded-full px-5 py-2 text-sm font-semibold transition sm:inline-block ${
              solido ? "bg-azul text-white hover:bg-navy" : "bg-white text-navy hover:bg-ciano"
            }`}
          >
            Encomendar
          </button>

          {/* botão do menu (telemóvel) */}
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menu}
            aria-controls="menu-movel"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition md:hidden ${
              solido ? "text-navy hover:bg-gelo" : "text-white hover:bg-white/10"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-none stroke-current"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={menu ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* painel do menu (telemóvel) */}
      {menu && (
        <nav id="menu-movel" className="border-t border-navy/10 bg-white md:hidden">
          <ul className="mx-auto max-w-6xl px-4 pt-1">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={() => setMenu(false)}
                  className="block border-b border-navy/5 py-4 text-base font-semibold text-navy"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-6xl px-4 py-5">
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                abrirCheckout();
              }}
              className="w-full rounded-full bg-azul py-3 text-sm font-semibold text-white transition hover:bg-navy"
            >
              Encomendar
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}