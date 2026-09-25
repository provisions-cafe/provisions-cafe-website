import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { canAccess, getDefaultPage, type Role, type UserProfile } from "@/lib/rbac";

/**
 * Auth gate for `/admin/*` (Next.js 16 renamed `middleware.ts` → `proxy.ts`).
 *
 * The `matcher` below scopes this to admin routes ONLY. Public marketing pages
 * are intentionally never routed through here, so they never touch Supabase and
 * keep rendering from code defaults even if Supabase is unreachable.
 *
 * Flow (CMS-GUIDE §6):
 *  1. Build an SSR client from request cookies; refresh the session via getUser.
 *  2. No user → allow only `/admin/login`, redirect everything else there.
 *  3. User → load their profile via the service-role client (bypasses RLS so the
 *     lookup can't be blocked by policy); missing row = employee, no permissions.
 *  4. On `/admin/login` while signed in → bounce to their landing page.
 *  5. Otherwise enforce `canAccess`, redirecting denied routes to the landing page.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  // `response` is rebuilt in setAll so refreshed auth cookies are carried out.
  let response = NextResponse.next({ request });

  // Clone the current response's cookies onto a redirect so a refreshed session
  // isn't dropped when we redirect.
  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  let userId: string | null = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  } catch {
    // Supabase unreachable — treat as signed out (below).
  }

  // Not signed in → only the login page is reachable.
  if (!userId) {
    return isLoginRoute ? response : redirectTo("/admin/login");
  }

  // Signed in: resolve the profile. Minimal mode (no service-role key) — read the
  // user's OWN profile through the authenticated client, permitted by the
  // user_profiles_self_select RLS policy. (If a secret key is added later, this
  // can switch to a service-role lookup to read any profile.)
  let profile: UserProfile;
  try {
    const { data: row } = await supabase
      .from("user_profiles")
      .select("user_id, role, permissions")
      .eq("user_id", userId)
      .maybeSingle();

    profile = row
      ? {
          user_id: row.user_id as string,
          role: row.role as Role,
          permissions: (row.permissions ?? []) as UserProfile["permissions"],
        }
      : { user_id: userId, role: "employee", permissions: [] };
  } catch {
    // Can't read the profile → fail closed to a permission-less employee.
    profile = { user_id: userId, role: "employee", permissions: [] };
  }

  // Already signed in on the login page → send to their landing page.
  if (isLoginRoute) {
    return redirectTo(getDefaultPage(profile));
  }

  // Authorization for the requested section.
  if (!canAccess(profile, pathname)) {
    return redirectTo(getDefaultPage(profile));
  }

  return response;
}

export const config = {
  // Admin routes only — public pages never run this gate.
  matcher: ["/admin", "/admin/:path*"],
};
