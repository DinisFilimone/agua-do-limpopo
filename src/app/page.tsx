import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pilares from "@/components/Pilares";
import Formatos from "@/components/Formatos";
import Processo from "@/components/Processo";
import ParaQuem from "@/components/ParaQuem";
import XaiXai from "@/components/XaiXai";
import Contactos from "@/components/Contactos";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingButtons from "@/components/FloatingButtons";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Header />
      <main>
        <Hero />
        <Pilares />
        <Formatos />
        <Processo />
        <ParaQuem />
        <XaiXai />
        <Contactos />
      </main>
      <FloatingButtons />
    </>
  );
}