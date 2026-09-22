import type {Metadata, Viewport} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {Toaster} from "@/components/ui/sonner";
import {Navbar} from "@/components/layout/navbar";
import {Footer} from "@/components/layout/footer";
import {ThemeProvider} from "@/components/providers/theme-provider";
import {WishlistProvider} from "@/lib/wishlist/wishlist-context";
import {SITE_NAME, SITE_URL, IS_PRODUCTION_SITE} from "@/lib/metadata";
import {
    generateOrganizationSchema,
    generateWebSiteSchema,
    generateLocalBusinessSchema,
    JsonLd,
} from "@/lib/seo/schema";
import {BUSINESS} from "@/lib/seo/business";
import {WelcomePopup} from "@/components/shared/welcome-popup";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: BUSINESS.description,
    applicationName: SITE_NAME,
    authors: [{name: SITE_NAME, url: SITE_URL}],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "Jewelry",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
    },
    // Preview deploys must never be indexable: an indexed preview host competes
    // with the production domain for the brand term.
    robots: IS_PRODUCTION_SITE
        ? {
              index: true,
              follow: true,
              googleBot: {
                  index: true,
                  follow: true,
                  "max-video-preview": -1,
                  "max-image-preview": "large",
                  "max-snippet": -1,
              },
          }
        : {index: false, follow: false},
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        {media: "(prefers-color-scheme: light)", color: "#ffffff"},
        {media: "(prefers-color-scheme: dark)", color: "#000000"},
    ],
};

export default function RootLayout({children}: LayoutProps<'/'>) {
    // One connected entity graph on every page: the brand, the site it
    // publishes, and the physical store that brand operates. Emitting these as
    // a single @graph (rather than three separate scripts) is what lets search
    // and AI answer engines resolve them to one business.
    const entityGraph = [
        generateOrganizationSchema({url: SITE_URL}),
        generateWebSiteSchema(SITE_URL),
        generateLocalBusinessSchema(SITE_URL),
    ];

    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
            >
                <JsonLd data={entityGraph} />
                <ThemeProvider>
                    <WishlistProvider>
                        <Navbar />
                        <main className="page-enter">
                            {children}
                        </main>
                        <Footer />
                        <WelcomePopup />
                        <Toaster />
                    </WishlistProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
