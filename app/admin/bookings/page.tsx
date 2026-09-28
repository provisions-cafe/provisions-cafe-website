import { createClient } from "@/lib/supabase/server";
import { getBookingSettings, getClosures } from "@/lib/booking.server";
import { todayISO, type Booking } from "@/lib/booking";
import BookingsAdminClient from "./BookingsAdminClient";
import { h1, COLORS } from "../ui";

export default async function AdminBookingsPage() {
  const settings = await getBookingSettings();
  const today = todayISO(settings.timezone);
  const [year, month] = today.split("-").map(Number);

  const pad = (n: number) => String(n).padStart(2, "0");
  const from = `${year}-${pad(month)}-01`;
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const to = `${year}-${pad(month)}-${pad(lastDay)}`;

  const supabase = await createClient();
  const [closures, bookingsRes] = await Promise.all([
    getClosures(today),
    supabase
      .from("bookings")
      .select("*")
      .gte("booking_date", from)
      .lte("booking_date", to)
      .order("booking_date", { ascending: true })
      .order("booking_time", { ascending: true }),
  ]);

  const monthBookings = (bookingsRes.data ?? []) as Booking[];

  return (
    <div>
      <h1 style={h1}>Bookings</h1>
      <p style={{ margin: "10px 0 24px", fontSize: 15, color: COLORS.muted, maxWidth: "64ch" }}>
        Reservations on a calendar, and all the settings behind the{" "}
        <strong>/book</strong> page — tables, opening hours, special dates and
        booking rules. Changes publish immediately.
      </p>
      <BookingsAdminClient
        initialSettings={settings}
        initialClosures={closures}
        initialBookings={monthBookings}
        initialYear={year}
        initialMonth={month}
        today={today}
      />
    </div>
  );
}
