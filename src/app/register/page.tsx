import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta · Ojo de Dios Abarrotero" };

export default function RegisterPage() {
  return (
    <AuthShell subtitle="Crea tu cuenta de vendedor con tu correo o con Google y entra al punto de venta." title="Crear cuenta">
      <RegisterForm />
    </AuthShell>
  );
}
