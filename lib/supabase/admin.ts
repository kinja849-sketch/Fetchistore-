import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an admin / service-role Supabase client for trusted server-side operations
 * (such as inserting listings or syncing Clerk profiles in Server Actions).
 * Falls back to the anon key if service role key is not configured.
 */
export function createAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const key =
    serviceRoleKey ||
    anonKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.placeholder";

  return createSupabaseClient(supabaseUrl, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
