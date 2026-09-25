"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { BusinessHour } from "@/lib/settings";

/**
 * Opening-hours table that highlights today's row. The day is read after mount
 * (in the visitor's own timezone) so server and client markup stay in sync.
 * `hours` comes from getSettings() (DB-editable, per-day), passed in by the
 * server page that renders this.
 */
export default function HoursTable({ hours }: { hours: BusinessHour[] }) {
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(new Date().getDay()), []);

  return (
    <table
      style={{
        width: "100%",
        maxWidth: 400,
        borderCollapse: "collapse",
        fontSize: 17,
      }}
    >
      <tbody>
        {hours.map((h, i) => {
          const isToday = today === h.day;
          const last = i === hours.length - 1;
          const border = last ? undefined : "1px solid rgba(241,233,218,.16)";
          const cell: CSSProperties = {
            padding: "11px 0",
            borderBottom: border,
            color: isToday ? "#FBF7EF" : "#F1E9DA",
            fontWeight: isToday ? 600 : undefined,
          };
          return (
            <tr key={h.day}>
              <th
                scope="row"
                style={{
                  ...cell,
                  textAlign: "left",
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {h.label}
                {isToday ? " · today" : ""}
              </th>
              <td style={{ ...cell, textAlign: "right" }}>
                {h.closed ? "Closed" : h.time}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
