"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";

let client: SupabaseClient | undefined;

/** Cliente de Supabase del navegador (una sola instancia). La sesión vive en cookies. */
export function getSupabaseBrowserClient(): SupabaseClient {
  client ??= createBrowserClient(publicEnv.supabaseUrl, publicEnv.supabasePublishableKey);
  return client;
}
