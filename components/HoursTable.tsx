"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { HOURS, HOURS_TIME } from "./site-data";

/**
 * Opening-hours table that highlights today's row. The day is read after mount
 * (in the visitor's own timezone) so server and client markup stay in sync.
 */
export default function HoursTable() {
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
        {HOURS.map(([day, label], i) => {
          const isToday = today === day;
          const last = i === HOURS.length - 1;
          const border = last ? undefined : "1px solid rgba(241,233,218,.16)";
          const cell: CSSProperties = {
            padding: "11px 0",
            borderBottom: border,
            color: isToday ? "#FBF7EF" : "#F1E9DA",
            fontWeight: isToday ? 600 : undefined,
          };
          return (
            <tr key={day}>
              <th
                scope="row"
                style={{
                  ...cell,
                  textAlign: "left",
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {label}
                {isToday ? " · today" : ""}
              </th>
              <td style={{ ...cell, textAlign: "right" }}>{HOURS_TIME}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
