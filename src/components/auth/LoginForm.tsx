"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { AuthConfigNotice } from "@/components/auth/AuthConfigNotice";
import { FormAlert } from "@/components/auth/FormAlert";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { TextField } from "@/components/auth/TextField";
import { Icon } from "@/components/ui/Icon";
import { authErrorMessage } from "@/lib/auth-messages";
import { isAuthConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface LoginFormProps {
  initialError?: string;
  next: string;
}

export function LoginForm({ initialError, next }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError ?? "");
  const [notice, setNotice] = useState("");

  if (!isAuthConfigured) return <AuthConfigNotice />;

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");
    const { error: signInError } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      setLoading(false);
      setError(authErrorMessage(signInError));
      return;
    }
    router.replace(next);
  }

  async function sendPasswordReset() {
    setError("");
    setNotice("");
    if (!email.trim()) {
      setError("Escribe tu correo y vuelve a pulsar «¿Olvidó su contraseña?».");
      return;
    }
    const { error: resetError } = await getSupabaseBrowserClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });
    if (resetError) {
      setError(authErrorMessage(resetError));
      return;
    }
    // Mismo mensaje exista o no la cuenta, para no revelar qué correos están registrados.
    setNotice("Si el correo está registrado, te enviamos un enlace para crear una nueva contraseña.");
  }

  return (
    <div className="space-y-4">
      {error && <FormAlert tone="error">{error}</FormAlert>}
      {notice && <FormAlert tone="success">{notice}</FormAlert>}

      <GoogleButton label="Continuar con Google" next={next} onError={setError} />

      <div className="flex items-center gap-3 text-xs text-[#6f7a6e]">
        <span className="h-px flex-1 bg-[#dae2fd]" />
        <span>o con tu correo</span>
        <span className="h-px flex-1 bg-[#dae2fd]" />
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          icon="mail"
          id="email"
          label="Correo electrónico"
          onChange={setEmail}
          placeholder="tucorreo@ejemplo.com"
          required
          spellCheck={false}
          type="email"
          value={email}
        />
        <PasswordField
          action={
            // -my-2 py-2: área táctil de 40px sin agrandar la fila.
            <button
              className="-mx-1 -my-2 rounded-md px-1 py-2.5 text-[#00652c]"
              onClick={() => void sendPasswordReset()}
              type="button"
            >
              ¿Olvidó su contraseña?
            </button>
          }
          autoComplete="current-password"
          id="password"
          label="Contraseña"
          onChange={setPassword}
          value={password}
        />
        <button
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] text-lg font-semibold text-white shadow-sm transition hover:bg-[#00652c] disabled:cursor-wait disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          <Icon className={loading ? "animate-spin" : ""} name={loading ? "loader" : "login"} />
          {loading ? "Entrando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="border-t border-[#eaedff] pt-4 text-center text-sm text-[#3f493f]">
        ¿Tienes un negocio nuevo?{" "}
        <Link className="inline-flex items-center gap-1 py-2 font-semibold text-[#00652c] underline" href="/register">
          Regístralo <Icon name="arrow" />
        </Link>
      </p>
    </div>
  );
}
