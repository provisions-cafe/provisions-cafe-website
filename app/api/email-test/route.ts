import { NextResponse } from "next/server";
import { sendEnquiry } from "@/components/enquiry-actions";
import { sendEmail, renderEmailShell } from "@/lib/email.server";

// TEMPORARY — live send verification only. Delete after testing.
export async function GET() {
  const enquiry = await sendEnquiry({
    variant: "contact",
    name: "Live re-test (contact form)",
    contact: "franclloyddagdag2130@gmail.com",
    notes:
      "Second live verification — footer + UTF-8 + hyphen subject in place. Safe to ignore.",
  });

  const booking = await sendEmail({
    to: process.env.EMAIL_TO || "franclloyddagdag2130@gmail.com",
    subject: "New booking - Live re-test, Sat 3 Oct 9:00 am (2 guests)",
    html: renderEmailShell({
      heading: "New booking",
      preheader: "Live re-test · Sat 3 Oct 9:00 am · 2 guests",
      bodyHtml:
        "<p style='margin:0 0 16px;'>Sample booking notification — same email pipeline the booking flow uses.</p><table role='presentation'><tr><td style='padding:4px 12px 4px 0;color:#8A5F22;font-weight:600;'>When</td><td>Sat 3 Oct 2026 at 9:00 am</td></tr><tr><td style='padding:4px 12px 4px 0;color:#8A5F22;font-weight:600;'>Party</td><td>2 guests</td></tr><tr><td style='padding:4px 12px 4px 0;color:#8A5F22;font-weight:600;'>Reference</td><td>TEST-5678</td></tr></table>",
    }),
    text: "Sample booking notification (live re-test).",
  });

  return NextResponse.json({ enquiry, booking });
}
