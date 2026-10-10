import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Água do Limpopo | Água de qualidade para um futuro melhor",
  description:
    "Água tratada e purificada em Xai-Xai, Gaza. Garrafões e entrega ao domicílio.",
  icons: { icon: "/brand/gota.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-MZ">
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}