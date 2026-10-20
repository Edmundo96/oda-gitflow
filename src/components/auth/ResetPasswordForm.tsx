"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type SubmitEvent } from "react";
import { AuthConfigNotice } from "@/components/auth/AuthConfigNotice";
import { FormAlert } from "@/components/auth/FormAlert";
import { PasswordField } from "@/components/auth/PasswordField";
import { Icon } from "@/components/ui/Icon";
import { authErrorMessage } from "@/lib/auth-messages";
import { isAuthConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MIN_PASSWORD = 8;

// Se llega aquí desde el enlace del correo de recuperación (vía /auth/callback, que abre la sesión).
export function ResetPasswordForm() {
  const router = useRouter();
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthConfigured) return;
    getSupabaseBrowserClient()
      .auth.getSession()
      .then(({ data }) => setHasSession(Boolean(data.session)));
  }, []);

  if (!isAuthConfigured) return <AuthConfigNotice />;

  if (hasSession === false) {
    return (
      <div className="space-y-3">
        <FormAlert tone="error">
          El enlace no es válido o ya expiró. Pide otro con «¿Olvidó su contraseña?» en la pantalla de inicio de sesión.
        </FormAlert>
        <Link className="inline-flex items-center gap-1 py-2 font-semibold text-[#00652c] underline" href="/login">
          Ir a iniciar sesión <Icon name="arrow" />
        </Link>
      </div>
    );
  }

  if (hasSession === null) {
    return (
      <p className="flex items-center gap-2 text-sm text-[#6f7a6e]" role="status">
        <Icon className="animate-spin text-lg" name="loader" /> Verificando el enlace...
      </p>
    );
  }

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < MIN_PASSWORD) {
      setError(`La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`);
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await getSupabaseBrowserClient().auth.updateUser({ password });
    if (updateError) {
      setLoading(false);
      setError(authErrorMessage(updateError));
      return;
    }
    router.replace("/pos");
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      {error && <FormAlert tone="error">{error}</FormAlert>}
      <PasswordField
        autoComplete="new-password"
        id="password"
        label={`Nueva contraseña (mínimo ${MIN_PASSWORD} caracteres)`}
        minLength={MIN_PASSWORD}
        onChange={setPassword}
        value={password}
      />
      <PasswordField
        autoComplete="new-password"
        id="confirm"
        label="Confirmar contraseña"
        minLength={MIN_PASSWORD}
        onChange={setConfirm}
        value={confirm}
      />
      <button
        className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] text-lg font-semibold text-white shadow-sm transition hover:bg-[#00652c] disabled:cursor-wait disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        <Icon className={loading ? "animate-spin" : ""} name={loading ? "loader" : "key"} />
        {loading ? "Guardando..." : "Guardar contraseña"}
      </button>
    </form>
  );
}
