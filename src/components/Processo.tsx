"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ETAPAS = [
  { t: "Recepção da água", d: "Recepção e armazenamento em reservatórios dedicados." },
  { t: "Filtração", d: "Filtros industriais retêm sedimentos e impurezas." },
  { t: "Osmose reversa", d: "O sistema RO remove sais e contaminantes dissolvidos." },
  { t: "Esterilização UV", d: "A luz ultravioleta elimina microrganismos." },
  { t: "Controlo e enchimento", d: "Medição da qualidade e enchimento dos garrafões." },
];

export default function Processo() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".chain-fill",
        { height: "0%" },
        {
          height: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ".chain",
            start: "top 70%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );

      gsap.utils.toArray<HTMLElement>(".chain-step").forEach((el) => {
        gsap.from(el, {
          x: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="qualidade"
      ref={root}
      className="scroll-mt-20 bg-gelo px-6 pb-16 pt-10 sm:pb-24 sm:pt-12"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-14 md:grid-cols-2">
        <div data-reveal className="md:sticky md:top-28">
          <p className="text-sm font-bold uppercase tracking-widest text-azul">
            Qualidade
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">
            Do reservatório ao garrafão, <span className="text-azul">passo a passo</span>
          </h2>
          <p className="mt-5 text-navy/70">
            Cada garrafão passa por um tratamento em várias etapas e por controlo
            de qualidade antes de chegar a si.
          </p>
          <ul className="mt-6 hidden space-y-3 text-navy md:block">
            {[
              "Filtração industrial",
              "Osmose reversa",
              "Esterilização UV",
              "Controlo de qualidade da água",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3 font-semibold">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-folha/15 text-folha">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="chain relative pl-14">
          <div className="absolute bottom-2 left-[19px] top-2 w-0.5 rounded-full bg-azul/15">
            <div className="chain-fill w-full rounded-full bg-azul" style={{ height: "0%" }} />
          </div>

          {ETAPAS.map((e, i) => (
            <div key={e.t} className="chain-step relative pb-10 last:pb-0">
              <span className="absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-azul font-bold text-white shadow-md ring-4 ring-gelo">
                {i + 1}
              </span>
              <h3 className="font-bold text-navy">{e.t}</h3>
              <p className="mt-1 text-sm text-navy/70">{e.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}