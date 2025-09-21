import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Psico Elia - Psicóloga Online | Terapia y Acompañamiento",
  description: "Psicóloga clínica online. Acompañamiento profesional para construir una vida más estable y consciente. Primera cita gratis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={poppins.variable}>
        {children}
      </body>
    </html>
  );
}
