import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Role, UserProfile } from "@/lib/rbac";
import AdminNav from "./AdminNav";
import { COLORS } from "./ui";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated → render bare (only /admin/login is reachable; proxy enforces).
  if (!user) {
    return <>{children}</>;
  }

  const { data: row } = await supabase
    .from("user_profiles")
    .select("user_id, role, permissions")
    .eq("user_id", user.id)
    .maybeSingle();

  const profile: UserProfile = row
    ? {
        user_id: row.user_id as string,
        role: row.role as Role,
        permissions: (row.permissions ?? []) as UserProfile["permissions"],
      }
    : { user_id: user.id, role: "employee", permissions: [] };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: COLORS.cream,
      }}
    >
      <AdminNav profile={profile} email={user.email ?? ""} />
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(20px, 3vw, 36px) clamp(16px, 3vw, 28px)",
        }}
      >
        {children}
      </main>
    </div>
  );
}
