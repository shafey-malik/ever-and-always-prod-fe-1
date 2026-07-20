import { NextResponse } from 'next/server';
import { sendInquiry, MissingEnvError } from '@/lib/mailer';
import { productInterestNotification } from '@/lib/inquiry-templates';

export async function POST(req: Request) {
    try {
        const { productName, productId } = await req.json();

        if (!productName || !productId) {
            return NextResponse.json({ error: 'Missing product details' }, { status: 400 });
        }

        const recipient = process.env.INQUIRY_RECIPIENT_EMAIL;
        if (!recipient || recipient.trim() === '') {
            console.warn('INQUIRY_RECIPIENT_EMAIL is not set. Interest tracked but email not sent.');
            return NextResponse.json({ ok: true, note: 'Email not configured' });
        }

        const notification = productInterestNotification({ productName, productId });

        await sendInquiry({
            to: recipient,
            subject: notification.subject,
            html: notification.html,
            text: notification.text,
            replyTo: recipient,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('Failed to track interest:', error);
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }
}
