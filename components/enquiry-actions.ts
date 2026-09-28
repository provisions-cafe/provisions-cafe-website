"use server";

import { z } from "zod";
import { getSettings } from "@/lib/settings.server";
import {
  sendEmail,
  escapeHtml,
  renderEmailShell,
  emailConfigured,
} from "@/lib/email.server";

const schema = z.object({
  variant: z.enum(["contact", "functions"]),
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  contact: z
    .string()
    .trim()
    .min(1, "Please leave a phone number or email.")
    .max(160),
  notes: z.string().trim().max(2000).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  people: z.string().trim().max(20).optional().default(""),
  // Honeypot — real users leave this empty; bots tend to fill every field.
  company: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.input<typeof schema>;
export type EnquiryResult = { ok?: boolean; error?: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Receive a contact / functions enquiry and email it to the cafe via Resend.
 * The recipient always comes from server config (EMAIL_TO or the settings
 * contact address) — never from the client — and the visitor's address is set
 * as reply-to so staff can reply straight from their inbox.
 */
export async function sendEnquiry(input: EnquiryInput): Promise<EnquiryResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    // A filled honeypot lands here — pretend success so bots get no signal.
    if (parsed.error.issues.some((i) => i.path[0] === "company")) {
      return { ok: true };
    }
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }
  const d = parsed.data;

  if (!emailConfigured()) {
    return {
      error:
        "Our online form isn't available right now — please email or call us instead.",
    };
  }

  const settings = await getSettings();
  const to = process.env.EMAIL_TO || settings.contact.email;
  const contactIsEmail = EMAIL_RE.test(d.contact);

  const rows: Array<[string, string]> = [
    ["Name", d.name],
    ["Phone or email", d.contact],
  ];
  if (d.variant === "functions") {
    if (d.date) rows.push(["Preferred date", d.date]);
    if (d.people) rows.push(["People", d.people]);
  }

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#8A5F22;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(
          k,
        )}</td><td style="padding:4px 0;">${escapeHtml(v)}</td></tr>`,
    )
    .join("");

  const messageHtml = d.notes
    ? `<p style="margin:18px 0 0;"><strong style="color:#8A5F22;">Message</strong></p>
       <p style="margin:6px 0 0;white-space:pre-wrap;">${escapeHtml(d.notes)}</p>`
    : "";

  const heading =
    d.variant === "functions" ? "New functions enquiry" : "New website enquiry";
  const html = renderEmailShell({
    heading,
    preheader: `${d.name} · ${d.contact}`,
    bodyHtml: `<table role="presentation" cellpadding="0" cellspacing="0">${rowsHtml}</table>${messageHtml}`,
  });

  const textLines = rows.map(([k, v]) => `${k}: ${v}`);
  if (d.notes) textLines.push("", d.notes);
  const text = textLines.join("\n");

  const subject =
    d.variant === "functions"
      ? `Functions enquiry - ${d.name}`
      : `Website enquiry - ${d.name}`;

  const res = await sendEmail({
    to,
    subject,
    html,
    text,
    replyTo: contactIsEmail ? d.contact : undefined,
  });

  if (!res.ok) {
    return {
      error:
        "Sorry — we couldn't send that just now. Please email or call us instead.",
    };
  }
  return { ok: true };
}
