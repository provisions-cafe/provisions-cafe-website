import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout";

/**
 * Append a row to `activity_logs`.
 *
 * Minimal mode (publishable key only): the log is written by the logged-in user
 * through the authenticated server client, permitted by the
 * `activity_logs_authed_insert` RLS policy. If no user is resolved, we skip
 * silently (the insert would be blocked by RLS anyway).
 *
 * Logging must NEVER break the calling action — everything is wrapped in a
 * try/catch that swallows errors. Callers may still add their own `.catch(() =>
 * {})` for extra safety.
 *
 * `emailOverride` records a specific email on the row (e.g. a `login` event).
 *
 * Upgrade path: if a service-role/secret key is added later, switch this to the
 * admin client (`lib/supabase/admin.ts`) and drop the authed-insert policy for a
 * tamper-proof, server-written audit trail.
 */
export async function logActivity(
  action: ActivityAction,
  tableName: string,
  details?: string,
  recordId?: string,
  emailOverride?: string,
): Promise<void> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("activity_logs").insert({
      user_id: user.id,
      user_email: emailOverride ?? user.email ?? null,
      action,
      table_name: tableName,
      record_id: recordId ?? null,
      details: details ?? null,
    });
  } catch {
    // Swallow — logging failures must not surface to the caller.
  }
}
