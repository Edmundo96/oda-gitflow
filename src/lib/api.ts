"use client";

import { publicEnv } from "@/lib/env";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    /** Código de la API, p. ej. NO_PROFILE o INACTIVE. */
    readonly code?: string,
  ) {
    super(message);
  }
}

interface ApiOptions extends Omit<RequestInit, "body"> {
  json?: unknown;
}

/** Llama a la API de NestJS con el token de la sesión de Supabase. */
export async function apiFetch<T>(path: string, { json, headers, ...init }: ApiOptions = {}): Promise<T> {
  const { data } = await getSupabaseBrowserClient().auth.getSession();
  const token = data.session?.access_token;

  let response: Response;
  try {
    response = await fetch(`${publicEnv.apiUrl}${path}`, {
      ...init,
      headers: {
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa que la API esté en marcha.");
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const { message, code } = (body ?? {}) as { message?: string | string[]; code?: string };
    throw new ApiError(
      response.status,
      Array.isArray(message) ? message.join(". ") : (message ?? "Ocurrió un error en el servidor"),
      code,
    );
  }
  return body as T;
}
