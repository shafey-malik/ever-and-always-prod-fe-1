'use server';

import { z } from 'zod';
import { MissingEnvError, sendAutoReply, sendInquiry } from '@/lib/mailer';
import { consultationNotification } from '@/lib/inquiry-templates';

const FALLBACK_ERROR =
    "Sorry — we couldn't send your request right now. Please email us directly at orders@everandalways.com and we'll get back to you.";

export interface ConsultationFormState {
    ok: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
    /** Echoed back on success so the UI can greet the customer by name. */
    firstName?: string;
}

const todayStart = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const consultationSchema = z.object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.string().trim().pipe(z.email('Please enter a valid email address')),
    phone: z.string().trim().min(1, 'Phone number is required'),
    preferredDate: z
        .string()
        .trim()
        .min(1, 'Please choose a preferred date')
        .refine((value) => {
            const date = new Date(value);
            return !Number.isNaN(date.getTime()) && date >= todayStart();
        }, 'Please choose a date in the future'),
    preferredTime: z.string().trim().min(1, 'Please choose a preferred time'),
    interest: z.string().trim().min(1, 'Please select what you are interested in'),
    message: z.string().trim().max(2000, 'Message must be 2000 characters or fewer').optional(),
    // Honeypot — must stay empty. Bots fill it; real users never see it.
    website: z.string().max(0).optional(),
});

export async function sendConsultationInquiry(
    _prevState: ConsultationFormState,
    formData: FormData
): Promise<ConsultationFormState> {
    const raw = {
        firstName: String(formData.get('firstName') ?? ''),
        lastName: String(formData.get('lastName') ?? ''),
        email: String(formData.get('email') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        preferredDate: String(formData.get('preferredDate') ?? ''),
        preferredTime: String(formData.get('preferredTime') ?? ''),
        interest: String(formData.get('interest') ?? ''),
        message: String(formData.get('message') ?? ''),
        website: String(formData.get('website') ?? ''),
    };

    // Silent success for bots: a filled honeypot is treated as a no-op so the
    // bot can't tell it was caught. Nothing is logged or sent.
    if (raw.website.trim() !== '') {
        return { ok: true };
    }

    const parsed = consultationSchema.safeParse(raw);
    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            const key = String(issue.path[0] ?? 'form');
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        return { ok: false, fieldErrors };
    }

    const data = parsed.data;

    try {
        const recipient = process.env.INQUIRY_RECIPIENT_EMAIL;
        if (!recipient || recipient.trim() === '') {
            throw new MissingEnvError('INQUIRY_RECIPIENT_EMAIL');
        }

        const notification = consultationNotification({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            preferredDate: data.preferredDate,
            preferredTime: data.preferredTime,
            interest: data.interest,
            message: data.message,
        });

        await Promise.all([
            sendInquiry({
                to: recipient,
                subject: notification.subject,
                html: notification.html,
                text: notification.text,
                replyTo: data.email,
            }),
            sendAutoReply({ to: data.email, name: data.firstName, type: 'consultation' }),
        ]);

        return { ok: true, firstName: data.firstName };
    } catch (error) {
        console.error('sendConsultationInquiry failed:', error);
        return { ok: false, error: FALLBACK_ERROR };
    }
}
