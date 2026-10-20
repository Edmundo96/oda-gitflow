import { NextResponse, type NextRequest } from "next/server";
import { safeRedirectPath } from "@/lib/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Destino de Supabase tras: iniciar sesión con Google, confirmar el correo y recuperar la contraseña.
// Intercambia el código de un solo uso por la sesión (cookies) y continúa a `next`.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Suele pasar si el enlace ya se usó, expiró o se abrió en otro navegador.
  const message =
    searchParams.get("error_description") ??
    "El enlace no es válido o ya expiró. Si ya confirmaste tu correo, inicia sesión.";
  return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(message)}`, request.url));
}
