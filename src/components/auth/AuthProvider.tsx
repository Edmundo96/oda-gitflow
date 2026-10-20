"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { ApiError, apiFetch } from "@/lib/api";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AppUser } from "@/types/user";

interface AuthContextValue {
  user: AppUser;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Usuario de la sesión actual. Solo disponible dentro de las pantallas protegidas. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return context;
}

/**
 * Perfil y rol para la sesión de Supabase. La API lo resuelve todo en una llamada: la primera
 * cuenta del sistema queda como administrador, las demás como cajero, y rechaza las desactivadas.
 */
const loadProfile = () => apiFetch<AppUser>("/auth/session", { method: "POST" });

type State = { status: "loading" } | { status: "ready"; user: AppUser } | { status: "error"; message: string };

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  const signOut = useCallback(
    async (reason?: string) => {
      await getSupabaseBrowserClient().auth.signOut();
      router.replace(reason ? `/login?error=${encodeURIComponent(reason)}` : "/login");
    },
    [router],
  );

  useEffect(() => {
    let cancelled = false;

    loadProfile()
      .then((user) => {
        if (!cancelled) setState({ status: "ready", user });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        // Sesión inválida o cuenta sin acceso: se cierra la sesión y se explica en el login.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          void signOut(error.message);
        } else {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "No se pudo cargar tu sesión.",
          });
        }
      });

    // Si la sesión se cierra en otra pestaña, esta también vuelve al login.
    const { data } = getSupabaseBrowserClient().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") router.replace("/login");
    });

    return () => {
      cancelled = true;
      data.subscription.unsubscribe();
    };
  }, [router, signOut]);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-[#faf8ff] text-[#6f7a6e]" role="status">
        <Icon className="animate-spin text-3xl text-[#15803d]" name="loader" />
        <p className="text-sm">Cargando tu sesión...</p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#faf8ff] text-center px-safe">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ffdad6] text-[#ba1a1a]">
          <Icon className="text-2xl" name="error" />
        </span>
        <p className="max-w-sm text-sm text-[#3f493f]" role="alert">
          {state.message}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            className="flex min-h-11 items-center gap-2 rounded-xl bg-[#15803d] px-4 font-semibold text-white hover:bg-[#00652c]"
            onClick={() => window.location.reload()}
            type="button"
          >
            <Icon name="retry" /> Reintentar
          </button>
          <button
            className="flex min-h-11 items-center gap-2 rounded-xl bg-[#eaedff] px-4 font-semibold text-[#283044] hover:bg-[#dae2fd]"
            onClick={() => void signOut()}
            type="button"
          >
            <Icon name="logout" /> Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user: state.user, signOut: () => signOut() }}>{children}</AuthContext.Provider>
  );
}
