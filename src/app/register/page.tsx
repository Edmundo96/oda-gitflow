import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Registrar negocio · Ojo de Dios Abarrotero" };

export default function RegisterPage() {
  return (
    <AuthShell
      subtitle="Registra tu tienda de abarrotes: serás su administrador y podrás dar de alta a tus empleados."
      title="Registrar negocio"
    >
      <RegisterForm />
    </AuthShell>
  );
}
