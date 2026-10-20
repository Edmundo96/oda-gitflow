"use client";

import { useState } from "react";
import { GoogleLogo } from "@/components/ui/GoogleLogo";
import { Icon } from "@/components/ui/Icon";
import { authErrorMessage } from "@/lib/auth-messages";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface GoogleButtonProps {
  label: string;
  /** Ruta interna a la que volver después de iniciar sesión. */
  next: string;
  onError: (message: string) => void;
}

export function GoogleButton({ label, next, onError }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const { error } = await getSupabaseBrowserClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    // Si no hubo error, el navegador ya se está yendo a Google.
    if (error) {
      setLoading(false);
      onError(authErrorMessage(error));
    }
  }

  return (
    <button
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#dae2fd] bg-white font-semibold text-[#131b2e] transition hover:bg-[#f2f3ff] disabled:cursor-wait disabled:opacity-70"
      disabled={loading}
      onClick={signIn}
      type="button"
    >
      {loading ? <Icon className="animate-spin text-xl" name="loader" /> : <GoogleLogo className="text-xl" />}
      {label}
    </button>
  );
}
