import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  BOOKING_DEFAULTS,
  mergeBookingSettings,
  type BookingSettings,
  type BookingClosure,
} from "@/lib/booking";

/**
 * Read the singleton `booking_settings` row and merge its JSON override over the
 * code defaults. Wrapped in React `cache()` so the page + form share one query
 * per request. Never throws — falls back to defaults if Supabase is empty or
 * unreachable, so the booking page always renders (or shows a sane fallback).
 */
export const getBookingSettings = cache(async (): Promise<BookingSettings> => {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("booking_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    return mergeBookingSettings((data?.data ?? {}) as Partial<BookingSettings>);
  } catch {
    return BOOKING_DEFAULTS;
  }
});

/**
 * Date-specific closures / special hours. Pass `fromISO` to only load upcoming
 * ones. Publicly readable (they change what the form offers). Never throws.
 */
export const getClosures = cache(
  async (fromISO?: string): Promise<BookingClosure[]> => {
    try {
      const supabase = await createClient();
      let query = supabase
        .from("booking_closures")
        .select("id, date, is_closed, open_time, close_time, note")
        .order("date", { ascending: true });
      if (fromISO) query = query.gte("date", fromISO);
      const { data } = await query;
      return (data ?? []) as BookingClosure[];
    } catch {
      return [];
    }
  },
);
