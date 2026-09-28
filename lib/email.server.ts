import "server-only";
import { Resend } from "resend";

/**
 * Thin, never-throwing wrapper around Resend for the site's transactional email
 * (contact enquiries + booking notifications).
 *
 * Config (all env, server-only):
 *   RESEND_API_KEY  Resend API key. If unset, sends are skipped (no crash) —
 *                   so local/dev without a key still works.
 *   EMAIL_FROM      Verified sender, e.g. "Provisions Cafe <hello@provisionscafe.com.au>".
 *                   Falls back to Resend's shared test sender, which can only
 *                   deliver to the account owner — set a real one for production.
 *   EMAIL_TO        Where enquiries + booking notifications land. Callers pass a
 *                   fallback (the cafe contact address) when this is unset.
 */

let client: Resend | null = null;

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

/** The verified sender address, or Resend's test sender as a fallback. */
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Provisions Cafe <onboarding@resend.dev>";

/** True when a Resend key is present, so callers can vary their messaging. */
export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export type SendResult = {
  ok: boolean;
  id?: string;
  /** Set when sending was skipped because email isn't configured. */
  skipped?: boolean;
  error?: string;
};

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string | string[];
}): Promise<SendResult> {
  const resend = getClient();
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set — skipped: ${opts.subject}`);
    return { ok: false, skipped: true, error: "Email is not configured." };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("[email] send failed:", error);
      return { ok: false, error: error.message ?? "Email failed to send." };
    }
    return { ok: true, id: data?.id };
  } catch (err) {
    console.error("[email] send threw:", err);
    return { ok: false, error: "Email failed to send." };
  }
}

/** Escape user-supplied text before interpolating it into HTML email bodies. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Wrap body HTML in a simple branded shell (navy header, cream card) so both
 * enquiry and booking emails share one look. `preheader` is the hidden inbox
 * preview line.
 */
export function renderEmailShell(opts: {
  heading: string;
  bodyHtml: string;
  preheader?: string;
}): string {
  const { heading, bodyHtml, preheader = "" } = opts;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#F1E9DA;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#3A2B22;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1E9DA;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FBF7EF;border-radius:10px;overflow:hidden;border:1px solid rgba(58,43,34,.12);">
          <tr><td style="background:#1E4359;padding:22px 28px;">
            <div style="color:#E9C98E;font-size:12px;letter-spacing:.16em;text-transform:uppercase;">Provisions Cafe · Williamstown</div>
            <div style="color:#FBF7EF;font-size:22px;font-weight:700;margin-top:4px;">${escapeHtml(heading)}</div>
          </td></tr>
          <tr><td style="padding:28px;font-size:15px;line-height:1.6;">${bodyHtml}</td></tr>
          <tr><td style="padding:18px 28px;border-top:1px solid rgba(58,43,34,.12);font-size:12.5px;line-height:1.5;color:#8A7B6E;">
            <strong style="color:#55433A;">Provisions Cafe</strong><br />
            62–64 Ferguson St, Williamstown VIC 3016<br />
            03 9399 9955 · provisionscafe.com.au
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
