import type { Metadata } from 'next';
import { AboutExperience } from '@/components/about/about-experience';
import { SITE_NAME, buildCanonicalUrl } from '@/lib/metadata';
import { FORMATTED_ADDRESS } from '@/lib/seo/business';

/**
 * The brand page. This is the page that has to rank for "ever and always",
 * "ever and always jewelry", "is ever and always legit" and every other form of
 * the brand name, so the title leads with the name rather than with "About Us",
 * and the description states what the company is in one sentence.
 */
const TITLE = `About ${SITE_NAME} — Lab-Grown Diamond Jewellers, Hanover MD`;
const DESCRIPTION =
    `${SITE_NAME} is a US lab-grown diamond jeweller based at ${FORMATTED_ADDRESS}. Made-to-order engagement rings and wedding bands, certified stones, lifetime warranty.`;

export const metadata: Metadata = {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    keywords: [
        'ever and always',
        'ever and always jewelry',
        'ever and always diamonds',
        'is ever and always legit',
        'ever and always reviews',
        'lab grown diamond jeweller maryland',
    ],
    alternates: { canonical: buildCanonicalUrl('/about-us') },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        type: 'website',
        url: buildCanonicalUrl('/about-us'),
    },
};

export default function AboutUsPage() {
    return <AboutExperience />;
}
