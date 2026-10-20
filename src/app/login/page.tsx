import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeRedirectPath } from "@/lib/redirect";

export const metadata: Metadata = { title: "Iniciar sesión · Ojo de Dios Abarrotero" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

  return (
    <AuthShell subtitle="Entra con tu correo o tu cuenta de Google." title="Iniciar sesión">
      <LoginForm initialError={first(params.error)} next={safeRedirectPath(first(params.next))} />
    </AuthShell>
  );
}
