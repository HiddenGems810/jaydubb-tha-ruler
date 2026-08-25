import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceEnv } from "@/lib/supabase/env";
import type { Database } from "@/types/database";

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseServiceEnv();

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
