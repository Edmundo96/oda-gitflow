"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { AuthConfigNotice } from "@/components/auth/AuthConfigNotice";
import { FormAlert } from "@/components/auth/FormAlert";
import { PasswordField } from "@/components/auth/PasswordField";
import { TextField } from "@/components/auth/TextField";
import { Icon } from "@/components/ui/Icon";
import { ApiError, apiFetch } from "@/lib/api";
import { authErrorMessage } from "@/lib/auth-messages";
import { isAuthConfigured } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MIN_PASSWORD = 8;

// Cada negocio de abarrotes se registra aquí: su dueño queda como administrador y después da de
// alta a sus empleados en Ajustes. La API crea la cuenta ya confirmada (sin correo de confirmación)
// y aquí se inicia la sesión con la contraseña recién elegida.
export function RegisterForm() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthConfigured) return <AuthConfigNotice />;

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
    try {
      await apiFetch("/auth/register", {
        method: "POST",
        json: { businessName: businessName.trim(), name: name.trim(), email: email.trim(), password },
      });
    } catch (registerError) {
      setLoading(false);
      setError(registerError instanceof ApiError ? registerError.message : "No se pudo registrar el negocio.");
      return;
    }

    const { error: signInError } = await getSupabaseBrowserClient().auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (signInError) {
      // El negocio ya quedó registrado: solo falta entrar desde el inicio de sesión.
      setLoading(false);
      setError(`Tu negocio quedó registrado, pero no se pudo iniciar sesión: ${authErrorMessage(signInError)}`);
      return;
    }
    router.replace("/pos");
  }

  return (
    <div className="space-y-4">
      {error && <FormAlert tone="error">{error}</FormAlert>}

      <form className="space-y-4" onSubmit={submit}>
        <TextField
          autoComplete="organization"
          icon="store"
          id="businessName"
          label="Nombre del negocio"
          maxLength={100}
          onChange={setBusinessName}
          placeholder="Abarrotes La Esperanza"
          required
          value={businessName}
        />
        <TextField
          autoComplete="name"
          icon="user"
          id="name"
          label="Tu nombre completo"
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
          maxLength={254}
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
          maxLength={72}
          minLength={MIN_PASSWORD}
          onChange={setPassword}
          value={password}
        />
        <PasswordField
          autoComplete="new-password"
          id="confirm"
          label="Confirmar contraseña"
          maxLength={72}
          minLength={MIN_PASSWORD}
          onChange={setConfirm}
          value={confirm}
        />
        <button
          className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#15803d] text-lg font-semibold text-white shadow-sm transition hover:bg-[#00652c] disabled:cursor-wait disabled:opacity-70"
          disabled={loading}
          type="submit"
        >
          <Icon className={loading ? "animate-spin" : ""} name={loading ? "loader" : "store"} />
          {loading ? "Registrando negocio..." : "Registrar negocio"}
        </button>
      </form>

      <p className="text-center text-xs text-[#6f7a6e]">
        ¿Trabajas en un negocio que ya está registrado? Pide a su administrador que te dé de alta.
      </p>

      <p className="border-t border-[#eaedff] pt-4 text-center text-sm text-[#3f493f]">
        ¿Ya tienes cuenta?{" "}
        <Link className="inline-block py-2 font-semibold text-[#00652c] underline" href="/login">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
