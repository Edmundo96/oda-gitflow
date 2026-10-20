"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type SubmitEvent } from "react";
import { AuthConfigNotice } from "@/components/auth/AuthConfigNotice";
import { FormAlert } from "@/components/auth/FormAlert";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { PasswordField } from "@/components/auth/PasswordField";
import { TextField } from "@/components/auth/TextField";
import { Icon } from "@/components/ui/Icon";
import { apiFetch } from "@/lib/api";
import { authErrorMessage } from "@/lib/auth-messages";
import { isAuthConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MIN_PASSWORD = 8;

// Cualquier vendedor puede crear su cuenta: con correo o con Google entra como cajero.
// La cuenta se crea directamente en Supabase; la API asigna el rol cuando la persona entra.
export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");
  /** null = desconocido (API apagada): no impide registrarse, solo oculta el aviso. */
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isAuthConfigured) return;
    apiFetch<{ hasAdmin: boolean }>("/auth/setup")
      .then(({ hasAdmin: exists }) => setHasAdmin(exists))
      .catch(() => setHasAdmin(null));
  }, []);

  if (!isAuthConfigured) return <AuthConfigNotice />;

  if (sentTo) {
    return (
      <div className="space-y-3">
        <FormAlert tone="success">
          Te enviamos un correo a <strong className="break-all">{sentTo}</strong>. Ábrelo para confirmar tu cuenta y
          después inicia sesión.
        </FormAlert>
        <Link className="inline-flex items-center gap-1 py-2 font-semibold text-[#00652c] underline" href="/login">
          Ir a iniciar sesión <Icon name="arrow" />
        </Link>
      </div>
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
    const { data, error: signUpError } = await getSupabaseBrowserClient().auth.signUp({
      email: email.trim(),
      password,
      options: {
        // El trigger de la base de datos toma el nombre del perfil de este metadato.
        data: { nombre: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/pos`,
      },
    });
    setLoading(false);

    if (signUpError) {
      setError(authErrorMessage(signUpError));
    } else if (data.session) {
      // Supabase sin confirmación de correo: la sesión ya está abierta.
      router.replace("/pos");
    } else {
      setSentTo(email.trim());
    }
  }

  return (
    <div className="space-y-4">
      {hasAdmin === false && (
        <FormAlert>
          Todavía no hay administrador: la primera cuenta que entre al sistema será la del administrador.
        </FormAlert>
      )}
      {error && <FormAlert tone="error">{error}</FormAlert>}

      <GoogleButton label="Registrarse con Google" next="/pos" onError={setError} />

      <div className="flex items-center gap-3 text-xs text-[#6f7a6e]">
        <span className="h-px flex-1 bg-[#dae2fd]" />
        <span>o con tu correo</span>
        <span className="h-px flex-1 bg-[#dae2fd]" />
      </div>

      <form className="space-y-4" onSubmit={submit}>
        <TextField
          autoComplete="name"
          icon="user"
          id="name"
          label="Nombre completo"
          maxLength={150}
          onChange={setName}
          required
          value={name}
        />
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
          autoComplete="new-password"
          id="password"
          label={`Contraseña (mínimo ${MIN_PASSWORD} caracteres)`}
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
          <Icon className={loading ? "animate-spin" : ""} name={loading ? "loader" : "userAdd"} />
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="border-t border-[#eaedff] pt-4 text-center text-sm text-[#3f493f]">
        ¿Ya tienes cuenta?{" "}
        <Link className="inline-block py-2 font-semibold text-[#00652c] underline" href="/login">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
