'use server';

import { z } from 'zod';
import { readFragment } from '@/graphql';
import { query } from '@/lib/vendure/api';
import { ProductCardFragment } from '@/lib/vendure/fragments';
import { SearchProductsQuery } from '@/lib/vendure/queries';
import { MissingEnvError, sendAutoReply, sendInquiry } from '@/lib/mailer';
import { customRingNotification } from '@/lib/inquiry-templates';

export interface MatchSummary {
    totalItems: number;
    sample: Array<{
        slug: string;
        name: string;
        preview: string | null;
    }>;
}

export async function findMatchingRings(facetValueIds: string[]): Promise<MatchSummary> {
    if (facetValueIds.length === 0) {
        return { totalItems: 0, sample: [] };
    }

    try {
        const result = await query(SearchProductsQuery, {
            input: {
                take: 6,
                skip: 0,
                groupByProduct: true,
                sort: { name: 'ASC' },
                facetValueFilters: facetValueIds.map(id => ({ and: id })),
            },
        });

        const sample = result.data.search.items.map(itemRef => {
            const item = readFragment(ProductCardFragment, itemRef);
            return {
                slug: item.slug,
                name: item.productName,
                preview: item.productAsset?.preview ?? null,
            };
        });

        return {
            totalItems: result.data.search.totalItems,
            sample,
        };
    } catch (error) {
        console.error('findMatchingRings failed:', error);
        return { totalItems: 0, sample: [] };
    }
}

const CUSTOM_FALLBACK_ERROR =
    "Sorry — we couldn't send your inquiry right now. Please email us directly and we'll get back to you.";

export interface CustomInquiryFormState {
    ok: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
    /** Echoed back on success so the UI can greet the customer by name. */
    name?: string;
}

const customInquirySchema = z.object({
    name: z.string().trim().max(120).optional(),
    email: z.string().trim().pipe(z.email('Please enter a valid email address')),
    phone: z.string().trim().max(40).optional(),
    vision: z
        .string()
        .trim()
        .min(1, 'Please describe your vision')
        .max(2000, 'Please keep your description to 2000 characters or fewer'),
    // Honeypot — must stay empty. Bots fill it; real users never see it.
    website: z.string().max(0).optional(),
});

export async function sendCustomJewelryInquiry(
    _prevState: CustomInquiryFormState,
    formData: FormData
): Promise<CustomInquiryFormState> {
    const raw = {
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        vision: String(formData.get('vision') ?? ''),
        website: String(formData.get('website') ?? ''),
    };

    // Silent success for bots: a filled honeypot is a no-op so the bot can't
    // tell it was caught. Nothing is logged or sent.
    if (raw.website.trim() !== '') {
        return { ok: true };
    }

    const parsed = customInquirySchema.safeParse(raw);
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

        const notification = customRingNotification({
            name: data.name,
            email: data.email,
            phone: data.phone,
            vision: data.vision,
        });

        await Promise.all([
            sendInquiry({
                to: recipient,
                subject: notification.subject,
                html: notification.html,
                text: notification.text,
                replyTo: data.email,
            }),
            sendAutoReply({ to: data.email, name: data.name, type: 'custom' }),
        ]);

        return { ok: true, name: data.name };
    } catch (error) {
        console.error('sendCustomJewelryInquiry failed:', error);
        return { ok: false, error: CUSTOM_FALLBACK_ERROR };
    }
}
