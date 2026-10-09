import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ojo de Dios Abarrotero",
  description: "Sistema de Punto de Venta e Inventario",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
