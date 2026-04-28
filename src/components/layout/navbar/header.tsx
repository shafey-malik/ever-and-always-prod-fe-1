'use client';

import { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { useTheme } from 'next-themes';
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

export function Header({ cartQuantity, isSignedIn, collections }: HeaderProps) {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
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

    return (
        <header
            className={`w-full sticky top-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[hsl(var(--card)/0.92)] backdrop-blur-md shadow-[var(--shadow-card)] border-b border-[hsl(var(--border)/0.5)]'
                : 'bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]'
                }`}
        >
            {/* ── Main Header Row ──────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className={`relative flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-2.5 sm:py-3' : 'py-3.5 sm:py-4'}`}>

                    {/* Left: Mobile Menu trigger */}
                    <div className="flex items-center lg:w-1/3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))]"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center lg:flex-none lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                        <Link href="/" className="flex flex-col items-center group">
                            <span className={`font-luxury-serif font-bold text-[hsl(var(--foreground))] leading-none tracking-tight transition-all duration-300 ${scrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>
                                Ever &amp; Always
                            </span>
                            {!scrolled && (
                                <span className="font-luxury-sans text-[0.6rem] tracking-[0.35em] uppercase text-[hsl(var(--secondary))] mt-0.5 opacity-80">
                                    Fine Diamond Jewelry
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Right: Icon Actions */}
                    <div className="flex items-center gap-1 sm:gap-2 lg:w-1/3 justify-end">
                        <button
                            onClick={() => setShowSearch(true)}
                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))]"
                            aria-label="Search"
                        >
                            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>

                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))]"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
                                ) : (
                                    <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                            </button>
                        )}

                        <Link
                            href={isSignedIn ? '/account' : '/sign-in'}
                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))]"
                        >
                            <User className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>

                        <Link
                            href="/cart"
                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 relative text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))]"
                        >
                            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                            {cartQuantity > 0 && (
                                <div className="absolute -top-0.5 -right-0.5 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
                                    {cartQuantity}
                                </div>
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
                                href="/collection/engagement"
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
                                href="/collection/wedding"
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

            {/* ── Mobile Menu ──────────────────────────────────────── */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className="absolute left-0 top-0 bottom-0 w-80 bg-[hsl(var(--card))] shadow-[var(--shadow-premium)] overflow-y-auto animate-slide-in-right">
                        {/* Header */}
                        <div className="p-5 border-b border-[hsl(var(--border))]">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    className="flex flex-col"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <span className="font-luxury-serif text-xl font-bold text-[hsl(var(--foreground))]">
                                        Ever &amp; Always
                                    </span>
                                    <span className="font-luxury-sans text-[0.6rem] tracking-[0.3em] uppercase text-[hsl(var(--secondary))] mt-0.5">
                                        Fine Diamond Jewelry
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 rounded-lg cursor-pointer text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4 space-y-1">
                            {/* Section label */}
                            <p className="font-luxury-sans text-[hsl(var(--secondary))] px-3 py-2 text-[10px] uppercase tracking-[0.28em]">
                                Shop Categories
                            </p>

                            {/* Engagement Rings — accordion */}
                            <div className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedMobileSection(
                                        expandedMobileSection === 'engagement' ? null : 'engagement'
                                    )}
                                    className="w-full flex items-center justify-between px-4 py-3.5 font-luxury-sans text-sm font-medium text-[hsl(var(--foreground))] cursor-pointer"
                                >
                                    <span>Engagement Rings</span>
                                    <ChevronDown className={`w-4 h-4 text-[hsl(var(--secondary))] transition-transform duration-200 ${expandedMobileSection === 'engagement' ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedMobileSection === 'engagement' && (
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
                                                            className="text-sm text-[hsl(var(--foreground)/0.65)] hover:text-[hsl(var(--foreground))] py-0.5 font-luxury-sans transition-colors"
                                                        >
                                                            {item}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <Link
                                            href="/collection/engagement"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[hsl(var(--secondary))] font-luxury-sans mt-1"
                                        >
                                            View All Engagement <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Wedding Rings — accordion */}
                            <div className="border border-[hsl(var(--border))] rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setExpandedMobileSection(
                                        expandedMobileSection === 'wedding' ? null : 'wedding'
                                    )}
                                    className="w-full flex items-center justify-between px-4 py-3.5 font-luxury-sans text-sm font-medium text-[hsl(var(--foreground))] cursor-pointer"
                                >
                                    <span>Wedding Rings</span>
                                    <ChevronDown className={`w-4 h-4 text-[hsl(var(--secondary))] transition-transform duration-200 ${expandedMobileSection === 'wedding' ? 'rotate-180' : ''}`} />
                                </button>

                                {expandedMobileSection === 'wedding' && (
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
                                                            className="text-sm text-[hsl(var(--foreground)/0.65)] hover:text-[hsl(var(--foreground))] py-0.5 font-luxury-sans transition-colors"
                                                        >
                                                            {item}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        <Link
                                            href="/collection/wedding"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[hsl(var(--secondary))] font-luxury-sans mt-1"
                                        >
                                            View All Wedding <ArrowRight className="w-3 h-3" />
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Flat links */}
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/collection/${collection.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between py-3.5 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-xl font-luxury-sans text-sm transition-colors border border-transparent hover:border-[hsl(var(--border))]"
                                >
                                    {collection.name}
                                    <ChevronRight className="w-4 h-4 opacity-40" />
                                </Link>
                            ))}

                            <Link
                                href="/custom"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between py-3.5 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-xl font-luxury-sans text-sm transition-colors border border-transparent hover:border-[hsl(var(--border))]"
                            >
                                Custom Jewelry
                                <ChevronRight className="w-4 h-4 opacity-40" />
                            </Link>

                            <Link
                                href="/about-us"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center justify-between py-3.5 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-xl font-luxury-sans text-sm transition-colors border border-transparent hover:border-[hsl(var(--border))]"
                            >
                                About Us
                                <ChevronRight className="w-4 h-4 opacity-40" />
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
