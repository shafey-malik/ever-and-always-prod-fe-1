import Link from 'next/link';

export default function CustomJewelryPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-b from-[hsl(var(--surface-luxury))] to-[hsl(var(--background))] px-4 py-12">
            <div className="max-w-2xl w-full text-center">
                {/* Decorative Elements */}
                <div className="relative mb-10">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))] flex items-center justify-center mb-6 shadow-elegant">
                        <svg
                            className="w-12 h-12 text-[hsl(var(--primary-foreground))]"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                            />
                        </svg>
                    </div>

                    {/* Small decorative dots */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-4 rounded-full bg-[hsl(var(--accent))]"></div>
                    <div className="absolute bottom-0 left-1/4 -translate-y-4 w-3 h-3 rounded-full bg-[hsl(var(--accent))] opacity-70"></div>
                    <div className="absolute bottom-0 right-1/4 -translate-y-4 w-3 h-3 rounded-full bg-[hsl(var(--accent))] opacity-70"></div>
                </div>

                {/* Main Content */}
                <div className="mb-12">
                    <h1 className=" text-4xl md:text-5xl font-bold text-[hsl(var(--foreground))] mb-4">
                        Custom Jewelry
                    </h1>

                    <div className="inline-flex items-center gap-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-4 py-2 rounded-full mb-8">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Coming Soon</span>
                    </div>

                    <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-xl mx-auto leading-relaxed">
                        We're currently refining our custom jewelry service to ensure every piece meets our standards of excellence.
                        This feature will allow you to collaborate with our artisans on bespoke creations.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[hsl(var(--foreground))]">Development Progress</span>
                        <span className="text-sm font-semibold text-[hsl(var(--lead-text))]">In Progress</span>
                    </div>
                    <div className="w-full h-2 bg-[hsl(var(--border))] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))] rounded-full"
                            style={{ width: '40%' }}
                        ></div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 max-w-md mx-auto">
                    <div className="p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-[hsl(var(--accent-foreground))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className=" font-semibold text-[hsl(var(--foreground))] mb-2">Consultation</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">One-on-one design discussions</p>
                    </div>

                    <div className="p-6 rounded-xl bg-[hsl(var(--card))] border border-[hsl(var(--border))]">
                        <div className="w-10 h-10 mx-auto rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center mb-4">
                            <svg className="w-5 h-5 text-[hsl(var(--accent-foreground))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className=" font-semibold text-[hsl(var(--foreground))] mb-2">Handcrafted</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Artisan-made pieces</p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-[hsl(var(--accent))] to-transparent border border-[hsl(var(--border))]">
                        <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                            Stay Updated
                        </h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
                            Be notified when custom orders become available
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-1 px-4 py-3 rounded-lg bg-white border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                            />
                            <button className="px-6 py-3 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-lg font-medium hover:opacity-90 transition-opacity">
                                Notify Me
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[hsl(var(--border))]">
                        <p className="text-[hsl(var(--muted-foreground))] mb-6">
                            Explore our current collection while you wait
                        </p>
                        <Link
                            href="/collections"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-medium hover:bg-[hsl(var(--accent))] transition-colors"
                        >
                            View Collections
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-12 pt-6 border-t border-[hsl(var(--border))]">
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                        For inquiries about custom work, please contact our concierge team
                    </p>
                </div>
            </div>
        </div>
    );
}