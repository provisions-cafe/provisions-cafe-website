/**
 * Role-based access control — pure logic, no database access. Enforced in
 * `proxy.ts` (route gate) and mirrored in the admin sidebar (nav filtering).
 *
 * Auth model (see CMS-GUIDE §7): an `admin` sees everything; an `employee` sees
 * only the sections whose permission key is in their `permissions` array.
 * `users` and `logs` are admin-only regardless of granted permissions.
 *
 * NOTE: at the database level RLS treats any authenticated user as an admin.
 * These checks are the Next.js-side enforcement layer for per-section access.
 */

export type Role = "admin" | "employee";

/**
 * Per-section permission keys stored on `user_profiles.permissions` (text[]).
 * v1 sections (highlights are edited inside Menu; per-day hours inside Info):
 */
export const PERMISSION_KEYS = [
  "menu", // menu categories + items + home highlights
  "info", // business info (NAP / URLs / ratings) + opening hours
  "specials", // "What's on" / specials cards
  "media", // photo swaps (image overrides + media library)
  "users", // manage staff accounts — admin only in practice
  "logs", // activity log viewer — admin only in practice
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export type UserProfile = {
  user_id: string;
  role: Role;
  permissions: PermissionKey[];
};

/** Sentinel for routes only admins may reach, whatever their permissions. */
const ADMIN_ONLY = "admin_only" as const;

/**
 * Maps `/admin/*` route prefixes to the permission they require. Longest prefix
 * wins, so nested routes inherit their section's permission. Routes not listed
 * here (e.g. the `/admin` dashboard) are open to any authenticated user.
 */
export const PATH_PERMISSION_MAP: Record<string, PermissionKey | typeof ADMIN_ONLY> = {
  "/admin/menu": "menu",
  "/admin/info": "info",
  "/admin/specials": "specials",
  "/admin/media": "media",
  "/admin/users": ADMIN_ONLY,
  "/admin/logs": ADMIN_ONLY,
};

/** Find the most specific (longest) mapped prefix for a pathname, if any. */
function requiredFor(
  pathname: string,
): PermissionKey | typeof ADMIN_ONLY | null {
  let match: PermissionKey | typeof ADMIN_ONLY | null = null;
  let matchLen = -1;
  for (const [prefix, permission] of Object.entries(PATH_PERMISSION_MAP)) {
    if (
      (pathname === prefix || pathname.startsWith(prefix + "/")) &&
      prefix.length > matchLen
    ) {
      match = permission;
      matchLen = prefix.length;
    }
  }
  return match;
}

/**
 * Can this profile open the given `/admin/*` pathname?
 * - admins: always.
 * - employees: `admin_only` routes are denied; permission-gated routes require
 *   the matching key; unmapped routes (dashboard) are allowed for any authed user.
 */
export function canAccess(
  profile: UserProfile | null,
  pathname: string,
): boolean {
  if (!profile) return false;
  if (profile.role === "admin") return true;

  const required = requiredFor(pathname);
  if (required === null) return true; // e.g. /admin dashboard
  if (required === ADMIN_ONLY) return false;
  return profile.permissions.includes(required);
}

/** Ordered nav sections an employee could land on after login. */
const LANDING_ORDER: PermissionKey[] = ["menu", "info", "specials", "media"];

/**
 * Where to send a user after login (or when redirected away from a denied
 * route). Admins go to the dashboard; employees go to their first accessible
 * section, falling back to the dashboard (which shows a "no access" state).
 */
export function getDefaultPage(profile: UserProfile | null): string {
  if (!profile) return "/admin/login";
  if (profile.role === "admin") return "/admin";
  const first = LANDING_ORDER.find((key) => profile.permissions.includes(key));
  return first ? `/admin/${first}` : "/admin";
}
