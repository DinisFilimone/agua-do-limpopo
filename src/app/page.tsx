import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pilares from "@/components/Pilares";
import Processo from "@/components/Processo";
import Empresas from "@/components/Empresas";
import Contactos from "@/components/Contactos";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <>
      <ScrollReveal />
      <Header />
      <main>
        <Hero />
        <Pilares />
        <Processo />
        <Empresas />
        <Contactos />
      </main>
    </>
  );
}