"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type AuthState = { error?: string } | undefined;

/**
 * Sign in with email/password (server-side, so the session cookie is set on the
 * response and login is audited). Returns `{ error }` on failure; redirects to
 * `/admin` on success (the proxy then routes to the user's landing page).
 */
export async function signIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.message.toLowerCase().includes("not confirmed")) {
      return { error: "Your account email isn't confirmed yet." };
    }
    return { error: "Invalid email or password." };
  }

  await logActivity("login", "auth", "Signed in", undefined, parsed.data.email);
  redirect("/admin");
}

/** Sign out, audit it, and return to the login screen. */
export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await logActivity("logout", "auth", "Signed out");
  await supabase.auth.signOut();
  redirect("/admin/login");
}
