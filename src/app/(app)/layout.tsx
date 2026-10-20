import type { ReactNode } from "react";
import { AuthProvider } from "@/components/auth/AuthProvider";

// Pantallas que requieren sesión (POS, Inventario, Ajustes). El proxy redirige al login si no hay
// sesión; AuthProvider carga el perfil y el rol desde la API antes de mostrar nada.
export default function AppLayout({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
