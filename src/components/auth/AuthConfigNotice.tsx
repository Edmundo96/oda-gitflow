import type { ReactNode } from "react";
import { FormAlert } from "@/components/auth/FormAlert";
import { authConfigProblem } from "@/lib/env";

const KEYS_LOCATION = "Supabase > Project Settings > API Keys";

/** Explica qué falta en frontend/.env cuando Supabase no está bien configurado. */
export function AuthConfigNotice() {
  if (!authConfigProblem) return null;

  const messages = {
    "missing-url": (
      <>
        Falta <code>NEXT_PUBLIC_SUPABASE_URL</code> en <code>frontend/.env</code> (por ejemplo{" "}
        <code>https://tu-proyecto.supabase.co</code>).
      </>
    ),
    "missing-key": (
      <>
        Falta la clave publicable: pega en <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> de{" "}
        <code>frontend/.env</code> la clave que empieza con <code>sb_publishable_</code> ({KEYS_LOCATION}).
      </>
    ),
    "invalid-key": (
      <>
        <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> no es una clave publicable de Supabase: debe empezar con{" "}
        <code>sb_publishable_</code> ({KEYS_LOCATION}). No pongas ahí la contraseña de la base de datos.
      </>
    ),
    "secret-key": (
      <>
        Pusiste la clave <strong>secreta</strong> en <code>frontend/.env</code>. Quítala ahora: esa clave da acceso
        total a tu proyecto y aquí llegaría al navegador. Usa la que empieza con <code>sb_publishable_</code>.
      </>
    ),
  } satisfies Record<NonNullable<typeof authConfigProblem>, ReactNode>;

  return (
    <FormAlert tone="error">
      <p>{messages[authConfigProblem]}</p>
      <p className="mt-2 text-xs">Después de guardar el archivo, detén y vuelve a iniciar <code>pnpm dev</code>.</p>
    </FormAlert>
  );
}
