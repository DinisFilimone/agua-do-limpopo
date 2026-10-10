"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FOTOS = [
  { src: "/xai-xai/foto-1.jpg", alt: "Vista aérea da costa" },
  { src: "/xai-xai/foto-2.jpg", alt: "Vista aérea da baía" },
  { src: "/xai-xai/foto-3.jpg", alt: "Vista aérea de pousadas junto à costa" },
  { src: "/xai-xai/foto-4.jpg", alt: "Fotografia de Xai-Xai" },
];

export default function XaiXaiSlider() {
  const [i, setI] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const t = setInterval(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      setI((n) => (n + 1) % FOTOS.length);
    }, 5000);
    return () => clearInterval(t);
  }, [pausado]);

  const ir = (n: number) => setI((n + FOTOS.length) % FOTOS.length);

  return (
    <div
      className="relative h-72 overflow-hidden rounded-3xl bg-navy shadow-lg"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
      role="group"
      aria-roledescription="carrossel"
      aria-label="Fotografias de Xai-Xai"
    >
      {FOTOS.map((f, n) => (
        <Image
          key={f.src}
          src={f.src}
          alt={f.alt}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          priority={n === 0}
          aria-hidden={n !== i}
          className={`object-cover transition-[opacity,transform] duration-1000 motion-reduce:transition-none ${
            n === i ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
      ))}

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />

      {(["anterior", "seguinte"] as const).map((lado) => (
        <button
          key={lado}
          type="button"
          onClick={() => ir(lado === "anterior" ? i - 1 : i + 1)}
          aria-label={lado === "anterior" ? "Foto anterior" : "Foto seguinte"}
          className={`absolute top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-navy shadow transition hover:bg-white ${
            lado === "anterior" ? "left-3" : "right-3"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d={lado === "anterior" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
          </svg>
        </button>
      ))}

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
        <p className="flex items-center gap-2 text-sm font-bold">
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-white" strokeWidth={2}>
            <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          Xai-Xai | Gaza
        </p>
        <div className="flex gap-2">
          {FOTOS.map((f, n) => (
            <button
              key={f.src}
              type="button"
              onClick={() => ir(n)}
              aria-label={`Ver foto ${n + 1}`}
              aria-current={n === i}
              className={`h-2 rounded-full transition-all ${n === i ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}