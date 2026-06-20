'use server';

import { getActiveCustomer } from '@/lib/vendure/actions';
import { query } from '@/lib/vendure/api';
import { GetOrderDetailQuery } from '@/lib/vendure/queries';
import { MissingEnvError, sendInquiry } from '@/lib/mailer';
import { cancellationRequestNotification, cancellationAutoReply } from '@/lib/inquiry-templates';

// Orders in these states can have a cancellation request submitted.
// Pre-payment states (AddingItems, ArrangingPayment) and post-fulfilment
// states (Shipped, Delivered, Cancelled) are excluded intentionally.
const CANCELLABLE_STATES = ['PaymentAuthorized', 'PaymentSettled'] as const;

const FALLBACK_ERROR =
    "We couldn't send your request right now. Please contact us directly and we'll be happy to assist you.";

export interface CancellationRequestResult {
    ok: boolean;
    error?: string;
}

export async function requestCancellation(
    orderCode: string,
    phoneNumber: string,
): Promise<CancellationRequestResult> {
    // ── Server-side input validation ──────────────────────────────────────────
    if (!orderCode || typeof orderCode !== 'string' || orderCode.trim().length === 0) {
        return { ok: false, error: 'Invalid order reference.' };
    }

    const trimmedPhone = phoneNumber?.trim() ?? '';
    if (trimmedPhone.length < 6) {
        return { ok: false, error: 'Please provide a valid phone number so our team can reach you.' };
    }
    if (trimmedPhone.length > 30) {
        return { ok: false, error: 'Phone number is too long. Please check and try again.' };
    }

    try {
        // ── Authentication ────────────────────────────────────────────────────
        const customer = await getActiveCustomer();
        if (!customer) {
            return { ok: false, error: 'Please sign in to submit a cancellation request.' };
        }

        // ── Fetch order & verify ownership ────────────────────────────────────
        const { data } = await query(
            GetOrderDetailQuery,
            { code: orderCode.trim() },
            { useAuthToken: true },
        );
        const order = data.orderByCode;

        // Return the same message whether the order doesn't exist or belongs to
        // someone else — no information leakage.
        if (!order || order.customer?.id !== customer.id) {
            return { ok: false, error: 'Order not found.' };
        }

        // ── State check ───────────────────────────────────────────────────────
        if (!(CANCELLABLE_STATES as readonly string[]).includes(order.state)) {
            return {
                ok: false,
                error: 'This order is not eligible for a cancellation request in its current status. Please contact us directly if you need assistance.',
            };
        }

        // ── Resolve recipient ─────────────────────────────────────────────────
        const recipientEmail = process.env.INQUIRY_RECIPIENT_EMAIL?.trim();
        if (!recipientEmail) {
            throw new MissingEnvError('INQUIRY_RECIPIENT_EMAIL');
        }

        // ── Build email content ───────────────────────────────────────────────
        const customerName =
            `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim() || 'Customer';
        const customerEmail = customer.emailAddress ?? '';

        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const orderTotal = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: order.currencyCode,
        }).format(order.totalWithTax / 100);

        const items = order.lines.map(line => ({
            name: line.productVariant.product.name,
            quantity: line.quantity,
        }));

        const adminContent = cancellationRequestNotification({
            orderCode: order.code,
            customerName,
            customerEmail,
            customerPhone: trimmedPhone,
            orderDate,
            orderTotal,
            items,
        });

        const customerContent = cancellationAutoReply({
            name: customerName,
            orderCode: order.code,
        });

        // ── Send both emails concurrently ─────────────────────────────────────
        await Promise.all([
            // Notification to the shop owner — replyTo lets them reply directly
            // to the customer from their inbox.
            sendInquiry({
                to: recipientEmail,
                subject: adminContent.subject,
                html: adminContent.html,
                text: adminContent.text,
                replyTo: customerEmail,
            }),
            // Confirmation auto-reply to the customer
            sendInquiry({
                to: customerEmail,
                subject: customerContent.subject,
                html: customerContent.html,
                text: customerContent.text,
            }),
        ]);

        return { ok: true };
    } catch (error) {
        if (error instanceof MissingEnvError) {
            console.error(`[requestCancellation] Configuration error: ${error.variableName} is not set`);
        } else {
            console.error('[requestCancellation] Unexpected error:', error);
        }
        return { ok: false, error: FALLBACK_ERROR };
    }
}
