"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { WHATSAPP_LINK } from "@/lib/config";

gsap.registerPlugin(useGSAP);

const WAVE = "M0 60 Q360 0 720 60 T1440 60 T2160 60 T2880 60 V120 H0 Z";

const BUBBLES = [
  { left: "6%", size: 14, delay: 0, dur: 10 },
  { left: "14%", size: 8, delay: 3, dur: 8 },
  { left: "23%", size: 18, delay: 1.5, dur: 12 },
  { left: "34%", size: 10, delay: 5, dur: 9 },
  { left: "46%", size: 6, delay: 2, dur: 7 },
  { left: "58%", size: 16, delay: 4, dur: 11 },
  { left: "68%", size: 9, delay: 0.5, dur: 8.5 },
  { left: "77%", size: 20, delay: 6, dur: 13 },
  { left: "86%", size: 11, delay: 2.5, dur: 9.5 },
  { left: "93%", size: 7, delay: 1, dur: 7.5 },
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { y: -70, opacity: 0, scale: 0.7, duration: 1 })
        .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(".hero-sub", { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-cta", { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.4");

      gsap.to(".hero-badge", {
        y: -12,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      });

      gsap.to(".hero-glow", {
        scale: 1.25,
        opacity: 0.5,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.utils.toArray<HTMLElement>(".bubble").forEach((el) => {
        const dur = Number(el.dataset.dur);
        const delay = Number(el.dataset.delay);
        gsap.fromTo(
          el,
          { y: 0, opacity: 0.55 },
          { y: -900, opacity: 0, duration: dur, delay, ease: "none", repeat: -1 }
        );
      });

      gsap.to(".wave-1", { xPercent: -50, duration: 18, ease: "none", repeat: -1 });
      gsap.to(".wave-2", { xPercent: -50, duration: 12, ease: "none", repeat: -1 });
      gsap.to(".wave-3", { xPercent: -50, duration: 8, ease: "none", repeat: -1 });
    },
    { scope: root }
  );

  return (
    <section
      id="inicio"
      ref={root}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-b from-[#04245c] via-navy to-azul px-6 pb-40 pt-28 text-center"
    >
      {/* bolhas */}
      {BUBBLES.map((b, i) => (
        <span
          key={i}
          className="bubble pointer-events-none absolute bottom-0 rounded-full border border-white/40 bg-white/10"
          style={{ left: b.left, width: b.size, height: b.size }}
          data-dur={b.dur}
          data-delay={b.delay}
        />
      ))}

      {/* gota num círculo branco com brilho */}
      <div className="hero-badge relative">
        <div className="hero-glow absolute inset-0 -m-6 rounded-full bg-ciano/40 blur-2xl" />
        <div className="relative rounded-full bg-white p-6 shadow-2xl shadow-black/30">
          <Image
            src="/brand/gota.png"
            alt="Água do Limpopo"
            width={160}
            height={130}
            className="h-24 w-auto sm:h-28"
            priority
          />
        </div>
      </div>

      <h1 className="hero-title mt-10 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-6xl">
        Água de qualidade para um <span className="text-ciano">futuro melhor</span>
      </h1>

      <p className="hero-sub mt-5 max-w-xl text-lg text-white/80">
        Água tratada e purificada, com entrega ao domicílio em Xai-Xai, Gaza.
      </p>

      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta rounded-full bg-white px-8 py-3.5 font-semibold text-navy shadow-lg transition hover:bg-ciano"
        >
          Encomendar no WhatsApp
        </a>
        <a
          href="#servicos"
          className="hero-cta rounded-full border-2 border-white/70 px-8 py-3.5 font-semibold text-white transition hover:bg-white/10"
        >
          Ver serviços
        </a>
      </div>

      {/* ondas */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 overflow-hidden">
        <svg className="wave-1 absolute bottom-0 left-0 h-28 w-[200%] opacity-30" viewBox="0 0 2880 120" preserveAspectRatio="none">
          <path d={WAVE} fill="#00d4ff" />
        </svg>
        <svg className="wave-2 absolute bottom-0 left-0 h-20 w-[200%] opacity-50" viewBox="0 0 2880 120" preserveAspectRatio="none">
          <path d={WAVE} fill="#ffffff" />
        </svg>
        <svg className="wave-3 absolute bottom-0 left-0 h-12 w-[200%]" viewBox="0 0 2880 120" preserveAspectRatio="none">
          <path d={WAVE} fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}