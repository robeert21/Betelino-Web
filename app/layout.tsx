import type { Metadata } from "next";
import { Archivo_Black, Fraunces, Inter } from "next/font/google";
import { NavBar } from "./components/NavBar";
import { getCurrentUser, isLeaderRole } from "@/lib/auth";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Betelino — Tabăra de vară",
  description: "Aplicația taberei de vară Betelino: reguli, magazin și contul tău.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  const isLeader = user ? isLeaderRole(user.role) : false;

  return (
    <html
      lang="ro"
      className={`${fraunces.variable} ${inter.variable} ${archivoBlack.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-warm-cream text-ink-umber">
        <NavBar isLeader={isLeader} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
