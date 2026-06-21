import {getTopCollections} from '@/lib/vendure/cached';
import Link from "next/link";
import {SITE_NAME} from '@/lib/metadata';
import {ShieldCheck, Infinity as InfinityIcon, Truck} from 'lucide-react';

function Copyright() {
    return (
        <div>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
    )
}

const maisonLinks = [
    { href: '/about-us', label: 'About Us' },
    { href: '/consultation', label: 'Book Consultation' },
    { href: '/custom', label: 'Custom Jewelry' },
    { href: '/blog', label: 'Journal' },
];

const clientCareLinks = [
    { href: '/search', label: 'Browse All Rings' },
    { href: '/account', label: 'My Account' },
    { href: '/account/orders', label: 'Order Tracking' },
    { href: '/cart', label: 'Shopping Bag' },
];

export async function Footer() {
    const collections = await getTopCollections();

    return (
        <footer className="relative mt-auto overflow-hidden bg-linear-to-b from-[hsl(var(--surface-luxury))] to-[hsl(var(--surface-champagne))] dark:bg-none dark:bg-[hsl(var(--surface-champagne))] text-[hsl(var(--foreground))]">
            {/* Champagne top hairline */}
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.6)] to-transparent" />

            <div className="container mx-auto px-5 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-8 relative">

                {/* ── Top: brand + link columns ── */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">

                    {/* Brand block */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <Link href="/" className="inline-flex flex-col group">
                            <span className="font-luxury-serif text-2xl sm:text-3xl font-bold leading-none text-[hsl(var(--foreground))]">
                                Ever &amp; Always
                            </span>
                            <span className="font-luxury-sans text-[0.55rem] sm:text-[0.6rem] tracking-[0.32em] uppercase text-[hsl(var(--secondary))] mt-2">
                                Fine Diamond Jewelry
                            </span>
                        </Link>

                        <p className="mt-5 font-luxury-sans text-[13px] leading-relaxed text-[hsl(var(--muted-foreground))] font-light max-w-xs">
                            Heirloom-grade diamonds, composed with intention —
                            for the moments that deserve forever.
                        </p>

                        {/* Mini trust row */}
                        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2.5">
                            <span className="inline-flex items-center gap-2 font-luxury-sans text-[10px] tracking-[0.18em] uppercase text-[hsl(var(--muted-foreground))]">
                                <ShieldCheck className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" strokeWidth={1.5} />
                                GIA Certified
                            </span>
                            <span className="inline-flex items-center gap-2 font-luxury-sans text-[10px] tracking-[0.18em] uppercase text-[hsl(var(--muted-foreground))]">
                                <InfinityIcon className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" strokeWidth={1.5} />
                                Lifetime Warranty
                            </span>
                            <span className="inline-flex items-center gap-2 font-luxury-sans text-[10px] tracking-[0.18em] uppercase text-[hsl(var(--muted-foreground))]">
                                <Truck className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" strokeWidth={1.5} />
                                Insured Delivery
                            </span>
                        </div>
                    </div>

                    {/* Collections */}
                    <div className="md:col-span-2 lg:col-span-2 md:col-start-7">
                        <p className="font-luxury-sans text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--secondary))] mb-5">
                            Collections
                        </p>
                        <ul className="space-y-2.5 font-luxury-sans text-[13px] font-light">
                            {collections.slice(0, 5).map((collection) => (
                                <li key={collection.id}>
                                    <Link
                                        href={`/collection/${collection.slug}`}
                                        className="group inline-flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-[hsl(var(--secondary))] mr-0 group-hover:mr-2 transition-all duration-300" />
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Explore */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <p className="font-luxury-sans text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--secondary))] mb-5">
                            Explore
                        </p>
                        <ul className="space-y-2.5 font-luxury-sans text-[13px] font-light">
                            {[
                                { href: '/engagement-rings', label: 'Engagement Rings' },
                                { href: '/wedding-rings',    label: 'Wedding Rings'    },
                                { href: '/custom',           label: 'Custom Jewelry'   },
                                { href: '/search',           label: 'All Rings'        },
                                { href: '/consultation',     label: 'Book a Visit'     },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-[hsl(var(--secondary))] mr-0 group-hover:mr-2 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Maison */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <p className="font-luxury-sans text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--secondary))] mb-5">
                            Maison
                        </p>
                        <ul className="space-y-2.5 font-luxury-sans text-[13px] font-light">
                            {maisonLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-[hsl(var(--secondary))] mr-0 group-hover:mr-2 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Client care */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <p className="font-luxury-sans text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--secondary))] mb-5">
                            Client Care
                        </p>
                        <ul className="space-y-2.5 font-luxury-sans text-[13px] font-light">
                            {clientCareLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300"
                                    >
                                        <span className="w-0 group-hover:w-3 h-px bg-[hsl(var(--secondary))] mr-0 group-hover:mr-2 transition-all duration-300" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── CTA strip ── */}
                <div className="mt-12 sm:mt-16 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-(--shadow-card) px-6 sm:px-9 py-6 sm:py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="text-center sm:text-left">
                        <p className="font-luxury-serif text-lg sm:text-xl font-light leading-snug text-[hsl(var(--foreground))]">
                            Begin your story with a{' '}
                            <span className="italic text-[hsl(var(--secondary-rich))]">private consultation</span>
                        </p>
                        <p className="mt-1 font-luxury-sans text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))] font-light">
                            Complimentary, unhurried, and entirely about you.
                        </p>
                    </div>
                    <Link
                        href="/consultation"
                        className="group shrink-0 inline-flex items-center justify-center w-full sm:w-auto border border-[hsl(var(--secondary)/0.55)] text-[hsl(var(--secondary-rich))] hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))] hover:border-transparent px-7 py-3.5 text-[10px] sm:text-[11px] tracking-[0.22em] uppercase font-light transition-all duration-500 cursor-pointer rounded-sm"
                        style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                    >
                        Reserve a Moment
                        <span className="ml-3 transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </Link>
                </div>

                {/* ── Bottom bar ── */}
                <div className="mt-10 sm:mt-12 pt-7 border-t border-[hsl(var(--border))] flex flex-col md:flex-row justify-between items-center gap-4 font-luxury-sans text-xs text-[hsl(var(--muted-foreground))] font-light">
                    <Copyright/>
                    <div className="flex items-center gap-2.5">
                        <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary)/0.7)]" />
                        <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary)/0.7)]" />
                        <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary)/0.7)]" />
                    </div>
                    <p className="tracking-[0.18em] uppercase text-[10px]">
                        Crafted with intention
                    </p>
                </div>
            </div>
        </footer>
    );
}
