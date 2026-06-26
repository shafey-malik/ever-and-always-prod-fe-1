'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ShoppingBag,
    User,
    Search,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Moon,
    Sun,
    ArrowRight,
    Calendar,
    Heart,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useWishlist } from '@/lib/wishlist/wishlist-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface HeaderProps {
    cartQuantity: number;
    isSignedIn: boolean;
    collections: Array<{ id: string; name: string; slug: string }>;
}

// Staggered entrance for drawer nav items
const drawerListVariants: Variants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.045, delayChildren: 0.18 },
    },
};

const drawerItemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    show: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
};

export function Header({ cartQuantity, isSignedIn, collections }: HeaderProps) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { count: wishlistCount, hydrated: wishlistHydrated } = useWishlist();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [expandedMobileSection, setExpandedMobileSection] = useState<string | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll while the drawer is open
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const original = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = original; };
    }, [isMobileMenuOpen]);

    // Close drawer on Escape
    useEffect(() => {
        if (!isMobileMenuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [isMobileMenuOpen]);

    // Debounced open/close so moving from nav button → dropdown panel doesn't flicker
    const openDropdown = (name: string) => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setActiveDropdown(name);
    };

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setActiveDropdown(null), 150);
    };

    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowSearch(false);
        setSearchQuery('');
    };

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    const getCollectionSlug = (category: string, item: string): string => {
        const base = category === 'engagement' ? 'engagement' : 'wedding';
        return `${base}-${item.toLowerCase().replace(/\s+/g, '-')}`;
    };

    const engagementCategories = {
        'By Shape': ['Round', 'Princess', 'Emerald', 'Oval', 'Cushion', 'Pear'],
        'By Setting': ['Solitaire', 'Halo', 'Three Stone', 'Vintage', 'Modern'],
        'By Metal': ['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'],
    };

    const weddingCategories = {
        "Women's": ['Classic Bands', 'Diamond Bands', 'Eternity Rings', 'Curved Bands'],
        "Men's": ['Classic Bands', 'Diamond Bands', 'Modern Bands', 'Textured Bands'],
        'Sets': ['Matching Sets', 'Bridal Sets', 'Custom Sets'],
    };

    // Shared icon-button styling — 44px touch targets on mobile, slightly tighter on sm+
    const iconBtn =
        'p-2.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))]';

    return (
        <header
            className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[hsl(var(--card)/0.92)] backdrop-blur-md shadow-[var(--shadow-card)] border-b border-[hsl(var(--border)/0.5)]'
                : 'bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]'
                }`}
        >
            {/* Champagne signature hairline */}
            <div className="h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.7)] to-transparent" />

            {/* ── Main Header Row ──────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-2 sm:px-6">
                <div className={`relative flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-2 sm:py-3' : 'py-3 sm:py-4'}`}>

                    {/* Left cluster — menu + search on mobile, spacer on desktop */}
                    <div className="flex items-center lg:w-1/3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className={`lg:hidden ${iconBtn}`}
                            aria-label="Open menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowSearch(true)}
                            className={`lg:hidden ${iconBtn}`}
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Center: Logo — absolutely centered at every breakpoint */}
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <Link href="/" className="flex flex-col items-center group">
                            <span
                                className={`font-luxury-serif font-bold text-[hsl(var(--foreground))] leading-none whitespace-nowrap text-[1.35rem] sm:text-3xl tracking-tight transition-transform duration-300 origin-bottom ${scrolled ? 'scale-90' : 'scale-100'}`}
                            >
                                Ever &amp; Always
                            </span>
                            <span
                                className={`font-luxury-sans text-[0.5rem] sm:text-[0.6rem] tracking-[0.28em] sm:tracking-[0.35em] uppercase text-[hsl(var(--secondary))] whitespace-nowrap overflow-hidden transition-all duration-300 origin-top ${scrolled ? 'opacity-0 max-h-0 mt-0 scale-95' : 'opacity-80 max-h-4 mt-1'}`}
                            >
                                Fine Diamond Jewelry
                            </span>
                        </Link>
                    </div>

                    {/* Right cluster — account + bag on mobile; full set on desktop */}
                    <div className="flex items-center lg:w-1/3 justify-end">
                        <button
                            onClick={() => setShowSearch(true)}
                            className={`hidden lg:inline-flex ${iconBtn}`}
                            aria-label="Search"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className={`hidden lg:inline-flex ${iconBtn}`}
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </button>
                        )}

                        <Link
                            href={isSignedIn ? '/account' : '/sign-in'}
                            className={`hidden sm:inline-flex ${iconBtn}`}
                            aria-label={isSignedIn ? 'My account' : 'Sign in'}
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        <Link href="/wishlist" className={`relative ${iconBtn}`} aria-label="Wishlist">
                            <Heart className="w-5 h-5" />
                            {wishlistHydrated && wishlistCount > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center text-[10px] font-semibold leading-none shadow-sm">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        <Link href="/cart" className={`relative ${iconBtn}`} aria-label="Cart">
                            <ShoppingBag className="w-5 h-5" />
                            {cartQuantity > 0 && (
                                <span className="absolute top-0.5 right-0.5 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-full min-w-4 h-4 px-0.5 flex items-center justify-center text-[10px] font-semibold leading-none shadow-sm">
                                    {cartQuantity}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Navigation Strip ─────────────────────────────────── */}
            {/* overflow-hidden is scoped to this strip only for the collapse animation.
                Dropdown panels are rendered OUTSIDE this div (below) to escape clipping. */}
            <div
                className={`hidden md:block border-t border-[hsl(var(--border))] bg-[hsl(var(--surface-luxury))] overflow-hidden transition-all duration-300 ${scrolled ? 'max-h-0 border-transparent' : 'max-h-14'}`}
            >
                <div className="max-w-7xl mx-auto px-6">
                    <nav className="flex items-center justify-center space-x-8">

                        {/* Engagement Rings */}
                        <div
                            onMouseEnter={() => openDropdown('engagement')}
                            onMouseLeave={scheduleClose}
                        >
                            <button className="flex items-center gap-1.5 py-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-luxury-sans text-xs tracking-[0.12em] uppercase transition-colors duration-200 cursor-pointer">
                                <span>Engagement Rings</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'engagement' ? 'rotate-180 text-[hsl(var(--secondary))]' : ''}`} />
                            </button>
                        </div>

                        {/* Wedding Rings */}
                        <div
                            onMouseEnter={() => openDropdown('wedding')}
                            onMouseLeave={scheduleClose}
                        >
                            <button className="flex items-center gap-1.5 py-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-luxury-sans text-xs tracking-[0.12em] uppercase transition-colors duration-200 cursor-pointer">
                                <span>Wedding Rings</span>
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'wedding' ? 'rotate-180 text-[hsl(var(--secondary))]' : ''}`} />
                            </button>
                        </div>

                        <Link
                            href="/custom"
                            className="py-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-luxury-sans text-xs tracking-[0.12em] uppercase transition-colors duration-200"
                        >
                            Custom Jewelry
                        </Link>

                        <Link
                            href="/about-us"
                            className="py-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-luxury-sans text-xs tracking-[0.12em] uppercase transition-colors duration-200"
                        >
                            About Us
                        </Link>
                    </nav>
                </div>
            </div>

            {/* ── Engagement Mega Menu ─────────────────────────────── */}
            {/* Rendered as a sibling of the nav strip, not inside overflow-hidden */}
            {activeDropdown === 'engagement' && !scrolled && (
                <div
                    className="hidden md:block absolute top-full left-0 right-0 z-50 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] shadow-[var(--shadow-elegant)] animate-fade-in-scale"
                    style={{ animationDuration: '160ms' }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                >
                    {/* Champagne gold hairline */}
                    <div className="h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.35)] to-transparent" />

                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-3 gap-12">
                            {Object.entries(engagementCategories).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="font-luxury-sans font-semibold text-[hsl(var(--secondary))] mb-4 text-[10px] uppercase tracking-[0.28em]">
                                        {category}
                                    </h3>
                                    <div className="space-y-0.5">
                                        {items.map((item) => (
                                            <Link
                                                key={item}
                                                href={`/collection/${getCollectionSlug('engagement', item)}`}
                                                className="group/link flex items-center gap-0 py-1.5 text-sm text-[hsl(var(--foreground)/0.58)] hover:text-[hsl(var(--foreground))] transition-all duration-200 font-luxury-sans"
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <span className="w-0 group-hover/link:w-3 overflow-hidden transition-all duration-200 flex-shrink-0">
                                                    <span className="block w-2 h-px bg-[hsl(var(--secondary))] mr-1" />
                                                </span>
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/collection/engagement-${category.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="inline-flex items-center gap-1 mt-5 text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-rich))] transition-colors duration-200 font-luxury-sans"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        View All <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Footer row */}
                        <div className="mt-8 pt-6 border-t border-[hsl(var(--border))] flex items-center justify-between">
                            <p className="text-xs text-[hsl(var(--muted-foreground))] font-luxury-sans tracking-wide">
                                Every ring crafted to last a lifetime — certified &amp; fully insured.
                            </p>
                            <Link
                                href="/engagement-rings"
                                onClick={() => setActiveDropdown(null)}
                                className="inline-flex items-center gap-2 text-xs font-luxury-sans font-medium text-[hsl(var(--foreground)/0.75)] border border-[hsl(var(--border))] hover:border-[hsl(var(--secondary)/0.6)] hover:text-[hsl(var(--secondary))] px-5 py-2 rounded-lg transition-all duration-200"
                            >
                                Browse All Engagement Rings
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Wedding Mega Menu ────────────────────────────────── */}
            {activeDropdown === 'wedding' && !scrolled && (
                <div
                    className="hidden md:block absolute top-full left-0 right-0 z-50 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] shadow-[var(--shadow-elegant)] animate-fade-in-scale"
                    style={{ animationDuration: '160ms' }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                >
                    {/* Champagne gold hairline */}
                    <div className="h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.35)] to-transparent" />

                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-3 gap-12">
                            {Object.entries(weddingCategories).map(([category, items]) => (
                                <div key={category}>
                                    <h3 className="font-luxury-sans font-semibold text-[hsl(var(--secondary))] mb-4 text-[10px] uppercase tracking-[0.28em]">
                                        {category}
                                    </h3>
                                    <div className="space-y-0.5">
                                        {items.map((item) => (
                                            <Link
                                                key={item}
                                                href={`/collection/${getCollectionSlug('wedding', item)}`}
                                                className="group/link flex items-center gap-0 py-1.5 text-sm text-[hsl(var(--foreground)/0.58)] hover:text-[hsl(var(--foreground))] transition-all duration-200 font-luxury-sans"
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <span className="w-0 group-hover/link:w-3 overflow-hidden transition-all duration-200 flex-shrink-0">
                                                    <span className="block w-2 h-px bg-[hsl(var(--secondary))] mr-1" />
                                                </span>
                                                {item}
                                            </Link>
                                        ))}
                                    </div>
                                    <Link
                                        href={`/collection/wedding-${category.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="inline-flex items-center gap-1 mt-5 text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-rich))] transition-colors duration-200 font-luxury-sans"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        View All <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            ))}
                        </div>

                        {/* Footer row */}
                        <div className="mt-8 pt-6 border-t border-[hsl(var(--border))] flex items-center justify-between">
                            <p className="text-xs text-[hsl(var(--muted-foreground))] font-luxury-sans tracking-wide">
                                Celebrate your forever — ethically sourced, beautifully crafted.
                            </p>
                            <Link
                                href="/wedding-rings"
                                onClick={() => setActiveDropdown(null)}
                                className="inline-flex items-center gap-2 text-xs font-luxury-sans font-medium text-[hsl(var(--foreground)/0.75)] border border-[hsl(var(--border))] hover:border-[hsl(var(--secondary)/0.6)] hover:text-[hsl(var(--secondary))] px-5 py-2 rounded-lg transition-all duration-200"
                            >
                                Browse All Wedding Rings
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Search Modal ─────────────────────────────────────── */}
            <Dialog open={showSearch} onOpenChange={setShowSearch}>
                <DialogContent className="sm:max-w-2xl bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                    <DialogHeader>
                        <DialogTitle className="font-luxury-serif text-2xl text-[hsl(var(--foreground))]">
                            Search Our Collection
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSearch} className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(var(--foreground))] opacity-60" />
                            <Input
                                type="text"
                                placeholder="Search diamonds, collections, rings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-6 text-lg font-luxury-sans
                                    bg-[hsl(var(--background))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]
                                    border-2 border-[hsl(var(--border))] rounded-lg
                                    focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-opacity-30
                                    focus-visible:border-[hsl(var(--primary))]"
                                autoFocus
                            />
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                                className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="btn-luxury" disabled={!searchQuery.trim()}>
                                Search
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
                        <p className="text-xs font-luxury-sans text-[hsl(var(--muted-foreground))] tracking-[0.15em] uppercase mb-3">
                            Popular Searches
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Round Diamond', 'Platinum Ring', 'Rose Gold', 'Solitaire', 'Halo Setting'].map((term) => (
                                <button
                                    key={term}
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery(term);
                                        router.push(`/search?q=${encodeURIComponent(term)}`);
                                        setShowSearch(false);
                                    }}
                                    className="px-4 py-2 text-sm rounded-full
                                        bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]
                                        border border-[hsl(var(--border))]
                                        hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]
                                        hover:border-[hsl(var(--primary))]
                                        transition-all duration-200 font-luxury-sans cursor-pointer"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ── Mobile Drawer ────────────────────────────────────── */}
            {/* Portaled to <body>: the header's backdrop-blur creates a containing
                block that would otherwise trap this fixed overlay inside the header */}
            {mounted && createPortal(
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <div className="fixed inset-0 z-[60] lg:hidden">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />

                            {/* Panel */}
                            <motion.aside
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute left-0 top-0 bottom-0 w-[86vw] max-w-sm bg-[hsl(var(--card))] shadow-[var(--shadow-premium)] flex flex-col overscroll-contain"
                            >
                                {/* Gold hairline along the panel edge */}
                                <span className="pointer-events-none absolute top-0 right-0 bottom-0 w-px bg-linear-to-b from-[hsl(var(--secondary)/0.6)] via-[hsl(var(--border))] to-transparent" />

                                {/* Drawer header */}
                                <div className="px-6 pt-5 pb-4 border-b border-[hsl(var(--border)/0.7)] flex items-center justify-between shrink-0">
                                    <Link
                                        href="/"
                                        className="flex flex-col"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <span className="font-luxury-serif text-xl font-bold text-[hsl(var(--foreground))] leading-none">
                                            Ever &amp; Always
                                        </span>
                                        <span className="font-luxury-sans text-[0.55rem] tracking-[0.3em] uppercase text-[hsl(var(--secondary))] mt-1.5">
                                            Fine Diamond Jewelry
                                        </span>
                                    </Link>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        aria-label="Close menu"
                                        className="p-2.5 -mr-1 rounded-full border border-[hsl(var(--border))] cursor-pointer text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--secondary)/0.5)] active:scale-95 transition-all duration-200"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Scrollable nav */}
                                <motion.nav
                                    variants={drawerListVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="flex-1 overflow-y-auto px-4 py-5 space-y-1"
                                >
                                    <motion.p
                                        variants={drawerItemVariants}
                                        className="font-luxury-sans text-[hsl(var(--secondary))] px-3 pb-2 text-[10px] uppercase tracking-[0.28em]"
                                    >
                                        Shop Categories
                                    </motion.p>

                                    {/* Engagement Rings — accordion */}
                                    <motion.div variants={drawerItemVariants} className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setExpandedMobileSection(
                                                expandedMobileSection === 'engagement' ? null : 'engagement'
                                            )}
                                            className="w-full flex items-center justify-between px-4 py-3.5 font-luxury-sans text-sm font-medium text-[hsl(var(--foreground))] cursor-pointer"
                                        >
                                            <span>Engagement Rings</span>
                                            <ChevronDown className={`w-4 h-4 text-[hsl(var(--secondary))] transition-transform duration-300 ${expandedMobileSection === 'engagement' ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {expandedMobileSection === 'engagement' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 border-t border-[hsl(var(--border))] pt-3 space-y-4">
                                                        {Object.entries(engagementCategories).map(([category, items]) => (
                                                            <div key={category}>
                                                                <p className="text-[10px] text-[hsl(var(--secondary))] font-luxury-sans uppercase tracking-[0.22em] mb-1.5">
                                                                    {category}
                                                                </p>
                                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                                    {items.map((item) => (
                                                                        <Link
                                                                            key={item}
                                                                            href={`/collection/${getCollectionSlug('engagement', item)}`}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="text-sm text-[hsl(var(--foreground)/0.65)] hover:text-[hsl(var(--foreground))] py-1 font-luxury-sans transition-colors"
                                                                        >
                                                                            {item}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Link
                                                            href="/engagement-rings"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[hsl(var(--secondary))] font-luxury-sans mt-1"
                                                        >
                                                            View All Engagement <ArrowRight className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Wedding Rings — accordion */}
                                    <motion.div variants={drawerItemVariants} className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
                                        <button
                                            onClick={() => setExpandedMobileSection(
                                                expandedMobileSection === 'wedding' ? null : 'wedding'
                                            )}
                                            className="w-full flex items-center justify-between px-4 py-3.5 font-luxury-sans text-sm font-medium text-[hsl(var(--foreground))] cursor-pointer"
                                        >
                                            <span>Wedding Rings</span>
                                            <ChevronDown className={`w-4 h-4 text-[hsl(var(--secondary))] transition-transform duration-300 ${expandedMobileSection === 'wedding' ? 'rotate-180' : ''}`} />
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {expandedMobileSection === 'wedding' && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-4 pb-4 border-t border-[hsl(var(--border))] pt-3 space-y-4">
                                                        {Object.entries(weddingCategories).map(([category, items]) => (
                                                            <div key={category}>
                                                                <p className="text-[10px] text-[hsl(var(--secondary))] font-luxury-sans uppercase tracking-[0.22em] mb-1.5">
                                                                    {category}
                                                                </p>
                                                                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                                                    {items.map((item) => (
                                                                        <Link
                                                                            key={item}
                                                                            href={`/collection/${getCollectionSlug('wedding', item)}`}
                                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                                            className="text-sm text-[hsl(var(--foreground)/0.65)] hover:text-[hsl(var(--foreground))] py-1 font-luxury-sans transition-colors"
                                                                        >
                                                                            {item}
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Link
                                                            href="/wedding-rings"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[hsl(var(--secondary))] font-luxury-sans mt-1"
                                                        >
                                                            View All Wedding <ArrowRight className="w-3 h-3" />
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>

                                    {/* Flat links */}
                                    {/* {collections.map((collection) => (
                                    <motion.div key={collection.id} variants={drawerItemVariants}>
                                        <Link
                                            href={`/collection/${collection.slug}`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between py-3.5 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-xl font-luxury-sans text-sm transition-colors border border-transparent hover:border-[hsl(var(--border))]"
                                        >
                                            {collection.name}
                                            <ChevronRight className="w-4 h-4 opacity-40" />
                                        </Link>
                                    </motion.div>
                                ))} */}

                                    <motion.div variants={drawerItemVariants}>
                                        <Link
                                            href="/custom"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between py-3.5 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-xl font-luxury-sans text-sm transition-colors border border-transparent hover:border-[hsl(var(--border))]"
                                        >
                                            Custom Jewelry
                                            <ChevronRight className="w-4 h-4 opacity-40" />
                                        </Link>
                                    </motion.div>

                                    <motion.div variants={drawerItemVariants}>
                                        <Link
                                            href="/about-us"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex items-center justify-between py-3.5 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-xl font-luxury-sans text-sm transition-colors border border-transparent hover:border-[hsl(var(--border))]"
                                        >
                                            About Us
                                            <ChevronRight className="w-4 h-4 opacity-40" />
                                        </Link>
                                    </motion.div>
                                </motion.nav>

                                {/* Drawer footer */}
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                                    className="shrink-0 border-t border-[hsl(var(--border)/0.7)] bg-[hsl(var(--surface-luxury))] px-5 pt-4 pb-[calc(1.1rem+env(safe-area-inset-bottom))] space-y-3"
                                >
                                    <Link
                                        href="/consultation"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] font-luxury-sans text-[11px] tracking-[0.2em] uppercase active:scale-[0.98] transition-transform duration-200"
                                    >
                                        <Calendar className="w-3.5 h-3.5" />
                                        Book a Private Consultation
                                    </Link>

                                    <div className="flex items-center gap-2.5">
                                        <Link
                                            href={isSignedIn ? '/account' : '/sign-in'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[hsl(var(--border))] text-[hsl(var(--foreground)/0.8)] font-luxury-sans text-xs active:scale-[0.98] transition-transform duration-200"
                                        >
                                            <User className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
                                            {isSignedIn ? 'My Account' : 'Sign In'}
                                        </Link>
                                        {mounted && (
                                            <button
                                                onClick={toggleTheme}
                                                aria-label="Toggle theme"
                                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[hsl(var(--border))] text-[hsl(var(--foreground)/0.8)] font-luxury-sans text-xs cursor-pointer active:scale-[0.98] transition-transform duration-200"
                                            >
                                                {theme === 'dark' ? (
                                                    <>
                                                        <Sun className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
                                                        Light Mode
                                                    </>
                                                ) : (
                                                    <>
                                                        <Moon className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
                                                        Dark Mode
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            </motion.aside>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </header>
    );
}
