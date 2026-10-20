// Next.js sustituye estas variables al compilar; deben leerse con el nombre completo.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export const publicEnv = {
  supabaseUrl,
  supabasePublishableKey,
  apiUrl: (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/$/, ""),
};

/** Qué impide usar Supabase con la configuración actual de frontend/.env (null = todo bien). */
export type AuthConfigProblem = "missing-url" | "missing-key" | "invalid-key" | "secret-key";

function detectProblem(): AuthConfigProblem | null {
  if (!/^https:\/\/[^[\]]+$/.test(supabaseUrl)) return "missing-url";
  if (!supabasePublishableKey || /\[[A-Z-]+\]/.test(supabasePublishableKey)) return "missing-key";
  // La clave secreta jamás debe llegar al navegador: se rechaza aunque "funcione".
  if (supabasePublishableKey.startsWith("sb_secret_")) return "secret-key";
  // Formato actual (sb_publishable_...) o el heredado (clave anon en formato JWT).
  if (!/^(sb_publishable_[\w-]{10,}|eyJ[\w-]+\.[\w-]+\.[\w-]+)$/.test(supabasePublishableKey)) return "invalid-key";
  return null;
}

export const authConfigProblem = detectProblem();
export const isAuthConfigured = authConfigProblem === null;
