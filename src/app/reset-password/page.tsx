import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Nueva contraseña · Ojo de Dios Abarrotero" };

export default function ResetPasswordPage() {
  return (
    <AuthShell subtitle="Escribe tu nueva contraseña para volver a entrar." title="Nueva contraseña">
      <ResetPasswordForm />
    </AuthShell>
  );
}
