import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAuthConfigured, publicEnv } from "@/lib/env";

/** Pantallas que requieren sesión. */
const PROTECTED = ["/pos", "/inventory", "/settings"];
/** Pantallas que no tienen sentido con la sesión ya iniciada. */
const GUEST_ONLY = ["/login", "/register"];

const matches = (path: string, routes: string[]) =>
  routes.some((route) => path === route || path.startsWith(`${route}/`));

// Refresca la sesión de Supabase en cada navegación y aplica las redirecciones de acceso.
// La autorización real (perfil y rol) la decide la API; esto solo evita mostrar pantallas sin sesión.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  let signedIn = false;

  if (isAuthConfigured) {
    const supabase = createServerClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headers) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        },
      },
    });

    try {
      // Verifica la firma del token (y lo renueva si expiró).
      const { data } = await supabase.auth.getClaims();
      signedIn = Boolean(data?.claims);
    } catch {
      signedIn = false;
    }
  }

  const { pathname, search } = request.nextUrl;
  const redirectTo = (path: string) => {
    const redirect = NextResponse.redirect(new URL(path, request.url));
    // Conserva las cookies de sesión renovadas.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!signedIn && matches(pathname, PROTECTED)) {
    return redirectTo(`/login?next=${encodeURIComponent(pathname + search)}`);
  }
  if (signedIn && matches(pathname, GUEST_ONLY)) {
    return redirectTo("/pos");
  }
  return response;
}

export const config = {
  // Todo excepto archivos estáticos e imágenes optimizadas.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
