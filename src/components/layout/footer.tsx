import {getTopCollections} from '@/lib/vendure/cached';
import Link from "next/link";
import {SITE_NAME} from '@/lib/metadata';


function Copyright() {
    return (
        <div>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
    )
}

export async function Footer() {
    const collections = await getTopCollections();

    return (
        <footer className="border-t border-border mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-sm font-semibold mb-4 uppercase tracking-wider">
                            {SITE_NAME}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold mb-4">Categories</p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {collections.map((collection) => (
                                <li key={collection.id}>
                                    <Link
                                        href={`/collection/${collection.slug}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/about-us"
                                    className="hover:text-foreground transition-colors"
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/consultation"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Book Consultation
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/custom"
                                    className="hover:text-foreground transition-colors"
                                >
                                    Custom Jewelry
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <Copyright/>
                </div>
            </div>
        </footer>
    );
}
