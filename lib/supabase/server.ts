import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * SSR Supabase client (anon key), wired into Next's cookies so it acts as the
 * logged-in user and RLS is enforced against that identity. Use in Server
 * Components and Server Actions for most admin reads/writes.
 *
 * Note (Next 16): `cookies()` is async and must be awaited.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore when the proxy
            // (proxy.ts) is refreshing the session on each request.
          }
        },
      },
    },
  );
}
