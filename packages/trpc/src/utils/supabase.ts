import { createClient } from "@supabase/supabase-js";

import { env } from "@good-dog/env";

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdminClient() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase env vars not set: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
    );
  }

  cachedClient ??= createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );

  return cachedClient;
}

export function getPublicStorageUrl(path: string) {
  if (!env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not set.");
  }
  return `${env.SUPABASE_URL}/storage/v1/object/public/${env.SUPABASE_GALLERY_STORAGE_BUCKET}/${path}`;
}
