import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

/** Origen (protocolo + host + puerto) de una URL de .env, o nada si no es válida. */
function originOf(url: string | undefined): string[] {
  try {
    return url ? [new URL(url).origin] : [];
  } catch {
    return [];
  }
}

// El navegador solo puede llamar a la propia app, a Supabase Auth y a la API de NestJS.
const connectSources = [
  "'self'",
  ...originOf(process.env.NEXT_PUBLIC_SUPABASE_URL),
  ...originOf(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"),
].join(" ");

// Solo en producción: el servidor de desarrollo necesita eval y websockets para HMR.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src ${connectSources}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  ...(isProduction ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy }] : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // Solo las imágenes del catálogo; cualquier otro host, puerto o query string recibe 400.
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", port: "", pathname: "/aida-public/**", search: "" },
    ],
    // Las redirecciones no se validan contra remotePatterns: no seguir ninguna.
    maximumRedirects: 0,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
