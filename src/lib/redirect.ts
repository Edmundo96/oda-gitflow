/** Acepta solo rutas internas (evita redirecciones abiertas a otros sitios). */
export function safeRedirectPath(value: string | null | undefined, fallback = "/pos"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
