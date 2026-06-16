import { SITE_NAME } from './metadata';

export interface EmailContent {
    subject: string;
    html: string;
    text: string;
}

/** Escape user-supplied text before interpolating it into an HTML template. */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const REPLY_FOOTER = 'Reply directly to this email to respond to the customer.';

/** Render a labelled list of fields as plain text, skipping empty values. */
function fieldsToText(fields: Array<[string, string | undefined | null]>): string {
    return fields
        .filter(([, value]) => value != null && String(value).trim() !== '')
        .map(([label, value]) => `${label}: ${value}`)
        .join('\n');
}

/** Render a labelled list of fields as HTML table rows, skipping empty values. */
function fieldsToHtmlRows(fields: Array<[string, string | undefined | null]>): string {
    return fields
        .filter(([, value]) => value != null && String(value).trim() !== '')
        .map(
            ([label, value]) => `
            <tr>
              <td style="padding:6px 12px 6px 0;vertical-align:top;color:#6b5d4f;font-weight:600;white-space:nowrap;">${escapeHtml(label)}</td>
              <td style="padding:6px 0;vertical-align:top;color:#1f1a15;">${escapeHtml(String(value)).replace(/\n/g, '<br />')}</td>
            </tr>`
        )
        .join('');
}

function notificationHtml(heading: string, fields: Array<[string, string | undefined | null]>): string {
    return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f1ea;font-family:Georgia,'Times New Roman',serif;color:#1f1a15;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7ddcd;border-radius:12px;padding:28px;">
      <h1 style="margin:0 0 4px;font-size:20px;font-weight:normal;color:#1f1a15;">${escapeHtml(heading)}</h1>
      <p style="margin:0 0 20px;font-size:13px;color:#9a8c7a;">${escapeHtml(SITE_NAME)}</p>
      <table style="width:100%;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;font-size:14px;">
        ${fieldsToHtmlRows(fields)}
      </table>
      <p style="margin:24px 0 0;padding-top:16px;border-top:1px solid #e7ddcd;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#6b5d4f;">
        ${escapeHtml(REPLY_FOOTER)}
      </p>
    </div>
  </body>
</html>`;
}

function notificationText(heading: string, fields: Array<[string, string | undefined | null]>): string {
    return `${heading}\n${SITE_NAME}\n\n${fieldsToText(fields)}\n\n${REPLY_FOOTER}`;
}

// ---------------------------------------------------------------------------
// Notification templates (sent TO the shop owner)
// ---------------------------------------------------------------------------

export interface ConsultationNotificationInput {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    preferredDate: string;
    preferredTime: string;
    interest: string;
    message?: string;
}

export function consultationNotification(input: ConsultationNotificationInput): EmailContent {
    const heading = 'New Consultation Request';
    const fields: Array<[string, string | undefined | null]> = [
        ['Name', `${input.firstName} ${input.lastName}`],
        ['Email', input.email],
        ['Phone', input.phone],
        ['Preferred date', input.preferredDate],
        ['Preferred time', input.preferredTime],
        ['Interest', input.interest],
        ['Message', input.message],
    ];

    return {
        subject: `[Consultation Request] ${input.firstName} ${input.lastName}`,
        html: notificationHtml(heading, fields),
        text: notificationText(heading, fields),
    };
}

export interface CustomRingNotificationInput {
    name?: string;
    email: string;
    phone?: string;
    vision: string;
}

export function customRingNotification(input: CustomRingNotificationInput): EmailContent {
    const heading = 'New Custom Ring Inquiry';
    const displayName = input.name?.trim() || 'Not provided';
    const fields: Array<[string, string | undefined | null]> = [
        ['Name', displayName],
        ['Email', input.email],
        ['Phone', input.phone],
        ['Vision', input.vision],
    ];

    return {
        subject: `[Custom Ring Inquiry] ${input.name?.trim() || input.email}`,
        html: notificationHtml(heading, fields),
        text: notificationText(heading, fields),
    };
}

// ---------------------------------------------------------------------------
// Auto-reply template (sent TO the customer)
// ---------------------------------------------------------------------------

export interface AutoReplyInput {
    name?: string;
    type: 'consultation' | 'custom';
}

export function autoReplyTemplate({ name, type }: AutoReplyInput): EmailContent {
    const greetingName = name?.trim() ? `, ${name.trim()}` : '';
    const intro =
        type === 'consultation'
            ? 'Thank you for requesting a consultation with us.'
            : 'Thank you for sharing your custom ring vision with us.';

    const subject =
        type === 'consultation'
            ? `We received your consultation request — ${SITE_NAME}`
            : `We received your custom ring inquiry — ${SITE_NAME}`;

    const text = `Hi${greetingName},

${intro}

We've received your inquiry and one of our jewellery experts will be in touch within 24 hours. We read every message personally and look forward to helping you.

Warm regards,
The ${SITE_NAME} Team

This is an automated confirmation — there's no need to reply.`;

    const html = `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f1ea;font-family:Georgia,'Times New Roman',serif;color:#1f1a15;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e7ddcd;border-radius:12px;padding:32px;">
      <p style="margin:0 0 16px;font-size:16px;">Hi${escapeHtml(greetingName)},</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">${escapeHtml(intro)}</p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.6;">
        We&rsquo;ve received your inquiry and one of our jewellery experts will be in touch
        <strong>within 24 hours</strong>. We read every message personally and look forward to helping you.
      </p>
      <p style="margin:24px 0 4px;font-size:15px;">Warm regards,</p>
      <p style="margin:0 0 20px;font-size:15px;color:#6b5d4f;">The ${escapeHtml(SITE_NAME)} Team</p>
      <p style="margin:0;padding-top:16px;border-top:1px solid #e7ddcd;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9a8c7a;">
        This is an automated confirmation — there&rsquo;s no need to reply.
      </p>
    </div>
  </body>
</html>`;

    return { subject, html, text };
}
