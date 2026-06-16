import 'server-only';

import nodemailer, { type Transporter } from 'nodemailer';
import { autoReplyTemplate } from './inquiry-templates';

/**
 * Thrown when a required SMTP environment variable is missing. Named so callers
 * (server actions) can distinguish a configuration failure from a transient
 * send failure and surface the right fallback message to the user.
 */
export class MissingEnvError extends Error {
    constructor(public readonly variableName: string) {
        super(`Missing required environment variable: ${variableName}`);
        this.name = 'MissingEnvError';
    }
}

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value || value.trim() === '') {
        throw new MissingEnvError(name);
    }
    return value;
}

let cachedTransport: Transporter | null = null;

/**
 * Returns a singleton Nodemailer transport authenticated as the noreply@
 * mailbox over Hostinger SMTP. Uses port 465 with an implicit TLS connection
 * (secure: true). Throws MissingEnvError if any required var is unset.
 */
function getTransport(): Transporter {
    if (cachedTransport) return cachedTransport;

    const host = requireEnv('SMTP_NOREPLY_HOST');
    const port = Number(requireEnv('SMTP_NOREPLY_PORT'));
    const user = requireEnv('SMTP_NOREPLY_USER');
    const pass = requireEnv('SMTP_NOREPLY_PASS');

    cachedTransport = nodemailer.createTransport({
        host,
        port,
        secure: true, // implicit TLS, port 465
        auth: { user, pass },
    });

    return cachedTransport;
}

/** The address every message is sent FROM (the authenticated noreply mailbox). */
function getFromAddress(): string {
    return requireEnv('SMTP_NOREPLY_USER');
}

export interface SendInquiryArgs {
    to: string;
    subject: string;
    html: string;
    text: string;
    /** Customer's email, so the owner can reply directly from their inbox. */
    replyTo?: string;
}

/**
 * Sends a single inquiry email FROM noreply@. Used for the owner notification,
 * where replyTo is set to the customer so a plain "Reply" reaches them.
 */
export async function sendInquiry({ to, subject, html, text, replyTo }: SendInquiryArgs): Promise<void> {
    const transport = getTransport();
    await transport.sendMail({
        from: getFromAddress(),
        to,
        subject,
        html,
        text,
        ...(replyTo ? { replyTo } : {}),
    });
}

export interface SendAutoReplyArgs {
    to: string;
    name?: string;
    type: 'consultation' | 'custom';
}

/**
 * Sends the customer-facing "we got your inquiry" acknowledgement FROM noreply@.
 */
export async function sendAutoReply({ to, name, type }: SendAutoReplyArgs): Promise<void> {
    const transport = getTransport();
    const { subject, html, text } = autoReplyTemplate({ name, type });
    await transport.sendMail({
        from: getFromAddress(),
        to,
        subject,
        html,
        text,
    });
}
