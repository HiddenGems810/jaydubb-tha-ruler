import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bmhuposxkvkeupzkweyc.supabase.co";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_fZxuUQX1jCQh-KhdlJlwQw_YWukGMB0";

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}
