import type { Metadata } from 'next';
import { AboutExperience } from '@/components/about/about-experience';
import { SITE_NAME } from '@/lib/metadata';

export const metadata: Metadata = {
    title: 'About Us',
    description: `Learn about ${SITE_NAME} - our story, mission, and commitment to creating timeless jewelry that celebrates life's most precious moments.`,
    openGraph: {
        title: `About Us | ${SITE_NAME}`,
        description: `Learn about ${SITE_NAME} - our story, mission, and commitment to creating timeless jewelry that celebrates life's most precious moments.`,
    },
};

export default function AboutUsPage() {
    return <AboutExperience />;
}
