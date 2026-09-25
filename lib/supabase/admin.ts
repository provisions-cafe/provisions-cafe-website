import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. **SERVER ONLY** — the service-role key bypasses
 * all Row-Level Security, so this must never be imported into a client
 * component or exposed via a `NEXT_PUBLIC_*` var.
 *
 * ⚠️ DORMANT in the current "publishable key only" setup: nothing imports this
 * yet, and `SUPABASE_SERVICE_ROLE_KEY` is intentionally unset — calling it now
 * would throw. It's the documented upgrade path: add an `sb_secret_…` key to
 * `.env.local`, then use this for a tamper-proof audit log, reading any user's
 * profile, or user management (`auth.admin.*`). For ordinary admin reads/writes
 * prefer `server.ts`, which runs as the logged-in user and is RLS-checked.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
