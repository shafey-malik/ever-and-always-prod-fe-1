import type { Metadata } from "next";
import { Suspense } from "react";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { DiamondSelector } from "@/components/home/diamond-selector";
import { FilterSectionWrapper } from "@/components/home/filter-section-wrapper";
import { DesignersCollection } from "@/components/home/designers-collection";
import { CollectionsBanners } from "@/components/home/collections-banners";
import { DiamondEducation } from "@/components/home/diamond-education";
import { BespokeProcess } from "@/components/home/bespoke-process";
import { AtelierPromise } from "@/components/home/atelier-promise";
import { ReviewsMarquee } from "@/components/home/reviews-marquee";
import { JournalTeaser } from "@/components/home/journal-teaser";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from "@/lib/metadata";

export const metadata: Metadata = {
    title: {
        absolute: `${SITE_NAME} - Affordable Diamond Jewelry | Trusted & Reliable USA`,
    },
    description:
        "Ever and Always offers the most affordable diamond jewelry online. Transparent pricing, trusted sourcing, and premium craftsmanship. Shop engagement rings, wedding bands, and fine diamond jewelry with confidence. Free shipping & lifetime warranty.",
    alternates: {
        canonical: buildCanonicalUrl("/"),
    },
    openGraph: {
        title: `${SITE_NAME} - Affordable Diamond Jewelry | Trusted & Reliable USA`,
        description:
            "America's most cost-friendly diamond jewelry store. Transparent pricing, premium craftsmanship, and reliable sourcing. Shop engagement rings, wedding bands, and fine diamond jewelry online.",
        type: "website",
        url: SITE_URL,
    },
    keywords: [
        "affordable diamond rings",
        "cheap engagement rings",
        "diamond jewelry USA",
        "affordable wedding rings",
        "lab grown diamonds",
        "natural diamonds",
        "diamond rings online",
        "best diamond prices",
        "trusted diamond store",
        "reliable diamond jewelry"
    ],
};

export default async function Home(_props: PageProps<'/'>) {
    return (
        <div className="min-h-screen">
            <HeroCarousel />
            <AnimatedSection>
                <CollectionsBanners />
            </AnimatedSection>
            <AnimatedSection>
                <DiamondSelector />
            </AnimatedSection>

            <AnimatedSection>
                <Suspense
                    fallback={<div className="h-96 animate-pulse bg-muted rounded-lg" />}
                >
                    <FilterSectionWrapper />
                </Suspense>
            </AnimatedSection>

            <AnimatedSection>
                <DiamondEducation />
            </AnimatedSection>

            <AnimatedSection>
                <BespokeProcess />
            </AnimatedSection>

            <AnimatedSection>
                <DesignersCollection />
            </AnimatedSection>

            <AnimatedSection>
                <AtelierPromise />
            </AnimatedSection>

            <AnimatedSection>
                <ReviewsMarquee />
            </AnimatedSection>

            <AnimatedSection>
                <JournalTeaser />
            </AnimatedSection>
        </div>
    );
}
