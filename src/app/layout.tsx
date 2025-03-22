import type { Metadata } from "next";
import { Playfair_Display, Cormorant, Montserrat } from "next/font/google";
import "./globals.css";
import ClientProviders from "../components/providers/ClientProviders";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CircleToClose - Eventi Privati Esclusivi",
  description: "Piattaforma esclusiva per eventi privati di lusso in location di prestigio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${playfair.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
