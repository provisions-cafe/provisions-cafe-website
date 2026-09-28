import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  canAccess,
  type PermissionKey,
  type Role,
  type UserProfile,
} from "@/lib/rbac";
import { getBookingSettings, getClosures } from "@/lib/booking.server";
import {
  effectiveHoursForDate,
  formatTimeLabel,
  nowTimeHM,
  todayISO,
  type BookingStatus,
} from "@/lib/booking";
import { card, h1, h2, serif, COLORS } from "./ui";

type TodayRow = {
  id: string;
  booking_time: string;
  party_size: number;
  name: string;
  table_name: string | null;
  status: BookingStatus;
};
type PendingRow = {
  id: string;
  booking_date: string;
  booking_time: string;
  party_size: number;
  name: string;
};
type LogRow = {
  user_email: string | null;
  action: string;
  table_name: string;
  details: string | null;
  created_at: string;
};

function shortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function timeAgo(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

const STATUS_COLOR: Record<BookingStatus, { fg: string; bg: string }> = {
  confirmed: { fg: COLORS.ok, bg: "rgba(78,122,74,.12)" },
  pending: { fg: COLORS.gold, bg: "rgba(169,118,43,.12)" },
  cancelled: { fg: COLORS.danger, bg: "rgba(166,54,43,.1)" },
};

function Pill({ status }: { status: BookingStatus }) {
  const c = STATUS_COLOR[status];
  return (
    <span
      style={{
        color: c.fg,
        background: c.bg,
        padding: "2px 9px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".04em",
        textTransform: "uppercase",
      }}
    >
      {status}
    </span>
  );
}

const statLabel: CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: ".06em",
  textTransform: "uppercase",
  color: COLORS.gold,
};
const statNum: CSSProperties = {
  fontFamily: serif,
  fontSize: 36,
  fontWeight: 500,
  lineHeight: 1,
  color: COLORS.bay,
};
const statSub: CSSProperties = { fontSize: 13, color: COLORS.muted };

function StatTile({
  href,
  label,
  value,
  sub,
  accent = false,
}: {
  href?: string;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: boolean;
}) {
  const inner = (
    <>
      <span style={statLabel}>{label}</span>
      <span style={{ ...statNum, color: accent ? COLORS.gold : COLORS.bay }}>
        {value}
      </span>
      {sub ? <span style={statSub}>{sub}</span> : null}
    </>
  );
  const style: CSSProperties = {
    ...card,
    padding: 18,
    display: "flex",
    flexDirection: "column",
    gap: 6,
    textDecoration: "none",
    ...(accent ? { borderLeft: `3px solid ${COLORS.gold}` } : null),
  };
  return href ? (
    <Link href={href} style={style}>
      {inner}
    </Link>
  ) : (
    <div style={style}>{inner}</div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section style={card}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 14,
        }}
      >
        <h2 style={h2}>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

const emptyText: CSSProperties = { margin: 0, fontSize: 14.5, color: COLORS.muted };
const moreLink: CSSProperties = {
  fontSize: 13.5,
  fontWeight: 600,
  color: COLORS.bay,
  textDecoration: "none",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: row } = user
    ? await supabase
        .from("user_profiles")
        .select("user_id, role, permissions")
        .eq("user_id", user.id)
        .maybeSingle()
    : { data: null };

  const profile: UserProfile = row
    ? {
        user_id: row.user_id as string,
        role: row.role as Role,
        permissions: (row.permissions ?? []) as PermissionKey[],
      }
    : { user_id: user?.id ?? "", role: "employee", permissions: [] };

  const canBookings = canAccess(profile, "/admin/bookings");
  const canMenu = canAccess(profile, "/admin/menu");
  const isAdmin = profile.role === "admin";

  // --- Booking overview (only if this user can see bookings) ---------------
  const bookingSettings = canBookings ? await getBookingSettings() : null;
  const tz = bookingSettings?.timezone ?? "Australia/Melbourne";
  const today = todayISO(tz);

  const closures = canBookings ? await getClosures(today) : [];

  const [
    todayRes,
    pendingRes,
    pendingCountRes,
    upcomingCountRes,
    itemCountRes,
    catCountRes,
    draftCountRes,
    logsRes,
  ] = await Promise.all([
    canBookings
      ? supabase
          .from("bookings")
          .select("id, booking_time, party_size, name, table_name, status")
          .eq("booking_date", today)
          .order("booking_time", { ascending: true })
      : Promise.resolve({ data: null }),
    canBookings
      ? supabase
          .from("bookings")
          .select("id, booking_date, booking_time, party_size, name")
          .eq("status", "pending")
          .gte("booking_date", today)
          .order("booking_date", { ascending: true })
          .order("booking_time", { ascending: true })
          .limit(6)
      : Promise.resolve({ data: null }),
    canBookings
      ? supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending")
          .gte("booking_date", today)
      : Promise.resolve({ count: 0 }),
    canBookings
      ? supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .neq("status", "cancelled")
          .gte("booking_date", today)
      : Promise.resolve({ count: 0 }),
    canMenu
      ? supabase.from("menu_items").select("id", { count: "exact", head: true })
      : Promise.resolve({ count: 0 }),
    canMenu
      ? supabase
          .from("menu_categories")
          .select("id", { count: "exact", head: true })
      : Promise.resolve({ count: 0 }),
    canMenu
      ? supabase
          .from("menu_items")
          .select("id", { count: "exact", head: true })
          .eq("is_published", false)
      : Promise.resolve({ count: 0 }),
    isAdmin
      ? supabase
          .from("activity_logs")
          .select("user_email, action, table_name, details, created_at")
          .order("created_at", { ascending: false })
          .limit(6)
      : Promise.resolve({ data: null }),
  ]);

  const todayRows = ((todayRes.data ?? []) as TodayRow[]).filter(
    (b) => b.status !== "cancelled",
  );
  const covers = todayRows.reduce((sum, b) => sum + b.party_size, 0);
  const pendingRows = (pendingRes.data ?? []) as PendingRow[];
  const pendingCount = pendingCountRes.count ?? 0;
  const upcomingCount = upcomingCountRes.count ?? 0;
  const itemCount = itemCountRes.count ?? 0;
  const catCount = catCountRes.count ?? 0;
  const draftCount = draftCountRes.count ?? 0;
  const logs = (logsRes.data ?? []) as LogRow[];

  // Today's booking window + open-now state.
  const todayHours = bookingSettings
    ? effectiveHoursForDate(today, bookingSettings, closures)
    : null;
  const nowHM = nowTimeHM(tz);
  const openNow =
    !!todayHours &&
    !todayHours.closed &&
    nowHM >= todayHours.open &&
    nowHM < todayHours.close;
  const hoursLabel = todayHours
    ? todayHours.closed
      ? "Closed today"
      : `${formatTimeLabel(todayHours.open)} – ${formatTimeLabel(todayHours.close)}`
    : "";

  const [ty, tm, td] = today.split("-").map(Number);
  const headerDate = new Date(Date.UTC(ty, tm - 1, td)).toLocaleDateString(
    "en-AU",
    { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" },
  );

  const sectionTiles = [
    {
      href: "/admin/menu",
      title: "Menu",
      body: `${itemCount} items · ${catCount} categories. Dishes, prices, and home highlights.`,
    },
    {
      href: "/admin/info",
      title: "Business info",
      body: "Phone, address, opening hours, links, and Google rating.",
    },
    {
      href: "/admin/bookings",
      title: "Bookings",
      body: "Calendar, tables, opening hours, special dates and rules.",
    },
    {
      href: "/admin/media",
      title: "Photos",
      body: "Swap hero, section, and gallery photos.",
    },
  ].filter((t) => canAccess(profile, t.href));

  const noAccess = !canBookings && !canMenu && sectionTiles.length === 0;

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <h1 style={h1}>Dashboard</h1>
        {canBookings && bookingSettings && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 999,
              fontSize: 13.5,
              fontWeight: 600,
              color: openNow ? COLORS.ok : COLORS.muted,
              background: openNow ? "rgba(78,122,74,.12)" : "rgba(58,43,34,.06)",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: openNow ? COLORS.ok : COLORS.muted,
              }}
            />
            {openNow ? "Open now" : "Closed now"}
            <span style={{ color: COLORS.muted, fontWeight: 500 }}>· {hoursLabel}</span>
          </span>
        )}
      </div>
      <p style={{ margin: "0 0 24px", fontSize: 15, color: COLORS.muted }}>
        {headerDate} · Everything important at a glance. Changes publish
        immediately.
      </p>

      {noAccess && (
        <div style={card}>
          <h2 style={h2}>No sections yet</h2>
          <p style={{ margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55, color: COLORS.muted }}>
            Your account doesn&rsquo;t have access to any editing sections. Ask an
            administrator to grant permissions (or set your role to{" "}
            <strong>admin</strong>).
          </p>
        </div>
      )}

      {/* Stat tiles */}
      {(canBookings || canMenu) && (
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            marginBottom: 18,
          }}
        >
          {canBookings && (
            <>
              <StatTile
                href="/admin/bookings"
                label="Today"
                value={todayRows.length}
                sub={
                  todayRows.length > 0
                    ? `${covers} ${covers === 1 ? "guest" : "guests"} booked`
                    : "No bookings yet"
                }
              />
              <StatTile
                href="/admin/bookings"
                label="Pending"
                value={pendingCount}
                sub={pendingCount > 0 ? "need confirming" : "all clear"}
                accent={pendingCount > 0}
              />
              <StatTile
                href="/admin/bookings"
                label="Upcoming"
                value={upcomingCount}
                sub="future bookings"
              />
            </>
          )}
          {canMenu && (
            <StatTile
              href="/admin/menu"
              label="Menu"
              value={itemCount}
              sub={
                draftCount > 0
                  ? `${draftCount} unpublished draft${draftCount === 1 ? "" : "s"}`
                  : `${catCount} categories`
              }
              accent={draftCount > 0}
            />
          )}
        </div>
      )}

      {/* Today's bookings */}
      {canBookings && (
        <div style={{ marginBottom: 18 }}>
          <Panel
            title="Today's bookings"
            action={
              <Link href="/admin/bookings" style={moreLink}>
                Open calendar →
              </Link>
            }
          >
            {!bookingSettings?.enabled ? (
              <p style={emptyText}>
                Online booking is currently turned off.
              </p>
            ) : todayRows.length === 0 ? (
              <p style={emptyText}>
                {todayHours?.closed
                  ? "Closed today — no bookings."
                  : "No bookings for today yet."}
              </p>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {todayRows.map((b) => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "4px 12px",
                      padding: "10px 12px",
                      border: `1px solid ${COLORS.line}`,
                      borderRadius: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: COLORS.ink,
                        minWidth: 78,
                      }}
                    >
                      {formatTimeLabel(b.booking_time)}
                    </span>
                    <span style={{ fontSize: 14.5, color: COLORS.ink }}>
                      {b.party_size} {b.party_size === 1 ? "guest" : "guests"}
                    </span>
                    <span style={{ fontSize: 14.5, color: COLORS.ink }}>
                      · {b.name}
                    </span>
                    {b.table_name ? (
                      <span style={{ fontSize: 13.5, color: COLORS.muted }}>
                        · {b.table_name}
                      </span>
                    ) : null}
                    <span style={{ marginLeft: "auto" }}>
                      <Pill status={b.status} />
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      )}

      {/* Needs attention + recent activity */}
      {(canBookings || isAdmin) && (
        <div
          style={{
            display: "grid",
            gap: 18,
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            marginBottom: 18,
          }}
        >
          {canBookings && (
            <Panel
              title="Needs attention"
              action={
                pendingCount > 6 ? (
                  <Link href="/admin/bookings" style={moreLink}>
                    +{pendingCount - 6} more
                  </Link>
                ) : undefined
              }
            >
              {pendingRows.length === 0 ? (
                <p style={emptyText}>Nothing waiting — all bookings confirmed. ✓</p>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {pendingRows.map((b) => (
                    <Link
                      key={b.id}
                      href="/admin/bookings"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "2px 10px",
                        padding: "9px 12px",
                        border: `1px solid ${COLORS.line}`,
                        borderLeft: `3px solid ${COLORS.gold}`,
                        borderRadius: 8,
                        textDecoration: "none",
                      }}
                    >
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>
                        {b.name}
                      </span>
                      <span style={{ fontSize: 13.5, color: COLORS.muted }}>
                        {b.party_size} {b.party_size === 1 ? "guest" : "guests"}
                      </span>
                      <span style={{ marginLeft: "auto", fontSize: 13.5, color: COLORS.muted }}>
                        {b.booking_date === today ? "Today" : shortDate(b.booking_date)}{" "}
                        {formatTimeLabel(b.booking_time)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </Panel>
          )}

          {isAdmin && (
            <Panel title="Recent activity">
              {logs.length === 0 ? (
                <p style={emptyText}>No recent changes recorded.</p>
              ) : (
                <div style={{ display: "grid", gap: 8 }}>
                  {logs.map((l, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        flexWrap: "wrap",
                        fontSize: 13.5,
                        color: COLORS.ink,
                      }}
                    >
                      <span style={{ fontWeight: 600, textTransform: "capitalize" }}>
                        {l.action}
                      </span>
                      <span style={{ color: COLORS.muted }}>
                        {l.details ?? l.table_name.replace(/_/g, " ")}
                      </span>
                      <span style={{ marginLeft: "auto", color: COLORS.muted, whiteSpace: "nowrap" }}>
                        {timeAgo(l.created_at)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          )}
        </div>
      )}

      {/* Section shortcuts */}
      {sectionTiles.length > 0 && (
        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          {sectionTiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              style={{ ...card, textDecoration: "none", display: "block" }}
            >
              <h2 style={h2}>{t.title}</h2>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.5, color: COLORS.muted }}>
                {t.body}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
