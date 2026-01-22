'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
    ShoppingBag,
    User,
    Search,
    Menu,
    X,
    ChevronDown,
    Moon,
    Sun,
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
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setShowSearch(false);
        setSearchQuery('');
    };

    const toggleTheme = () => {
        if (theme === 'dark') {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    };

    // Helper function to generate collection slug
    const getCollectionSlug = (category: string, item: string): string => {
        const base = category === 'engagement' ? 'engagement' : 'wedding';
        const itemSlug = item.toLowerCase().replace(/\s+/g, '-');
        return `${base}-${itemSlug}`;
    };

    // Diamond shop specific categories
    const engagementCategories = {
        'By Shape': ['Round', 'Princess', 'Emerald', 'Oval', 'Cushion', 'Pear'],
        'By Setting': ['Solitaire', 'Halo', 'Three Stone', 'Vintage', 'Modern'],
        'By Metal': ['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold'],
    };

    const weddingCategories = {
        "Women's": [
            'Classic Bands',
            'Diamond Bands',
            'Eternity Rings',
            'Curved Bands',
        ],
        "Men's": [
            'Classic Bands',
            'Diamond Bands',
            'Modern Bands',
            'Textured Bands',
        ],
        Sets: ['Matching Sets', 'Bridal Sets', 'Custom Sets'],
    };

    return (
        <header className="w-full bg-[hsl(var(--card))] shadow-[var(--shadow-card)] sticky top-0 z-50">
            {/* Main Header */}
            <div className="">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    {/* Header main row */}
                    <div className="relative flex items-center justify-between gap-2 sm:gap-4">
                        {/* Left: Mobile Menu & Logo */}
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-2 hover:text-[hsl(var(--foreground))] rounded-lg transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer"
                            >
                                <Menu className="w-6 h-6 text-[hsl(var(--lead-text))]" />
                            </button>

                            {/* Logo — inline on mobile/tablet, centered on desktop */}
                            <Link
                                href="/"
                                className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 flex items-center space-x-3"
                            >
                                <h1 className="text-nowrap font-luxury-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[hsl(var(--foreground))] leading-tight">
                                    Ever & Always
                                </h1>
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
                            {/* Search Button - Opens Modal */}
                            <button
                                onClick={() => setShowSearch(true)}
                                className="p-2 hover:text-[hsl(var(--foreground))] rounded-lg transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5 text-[hsl(var(--lead-text))]" />
                            </button>

                            {/* Theme Toggle */}
                            {mounted && (
                                <button
                                    onClick={toggleTheme}
                                    aria-label="Toggle theme"
                                    className="p-2 hover:text-[hsl(var(--foreground))] rounded-lg transition-all duration-200 ease-out hover:scale-110 active:scale-95 cursor-pointer"
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="w-5 h-5 text-[hsl(var(--lead-text))]" />
                                    ) : (
                                        <Moon className="w-5 h-5 text-[hsl(var(--lead-text))]" />
                                    )}
                                </button>
                            )}

                            {/* Profile */}
                            <Link
                                href={isSignedIn ? '/account' : '/sign-in'}
                                className="p-2 hover:text-[hsl(var(--foreground))] rounded-lg transition-colors"
                            >
                                <User className="w-5 h-5 text-[hsl(var(--lead-text))]" />
                            </Link>

                            {/* Cart */}
                            <Link
                                href="/cart"
                                className="p-2 hover:text-[hsl(var(--foreground))] rounded-lg transition-colors relative"
                            >
                                <ShoppingBag className="w-5 h-5 text-[hsl(var(--lead-text))]" />
                                {cartQuantity > 0 && (
                                    <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-normal">
                                        {cartQuantity}
                                    </div>
                                )}
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Secondary Header - Navigation */}
            <div className="hidden md:block border-t border-[hsl(var(--border))] bg-[hsl(var(--surface-luxury))]">
                <div className="max-w-7xl mx-auto px-4">
                    <nav className="flex items-center justify-center space-x-8">
                        {/* Engagement Rings Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown('engagement')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center rounded-md hover:rounded-b-none space-x-4 px-2 py-1.5 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-normal transition-colors cursor-pointer">
                                <span>Engagement Rings</span>
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            {activeDropdown === 'engagement' && (
                                <div className="absolute top-full left-0 w-96 bg-[hsl(var(--card))] shadow-2xl rounded-3xl z-50 rounded-tl-none animate-fade-in-scale" style={{ animationDuration: '200ms' }}>
                                    <div className="p-6 grid grid-cols-2 gap-6">
                                        {Object.entries(engagementCategories).map(
                                            ([category, items]) => (
                                                <div key={category}>
                                                    <h3 className="font-semibold text-[hsl(var(--lead-text))] mb-3 text-sm uppercase tracking-wide">
                                                        {category}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {items.map((item) => (
                                                            <Link
                                                                key={item}
                                                                href={`/collection/${getCollectionSlug('engagement', item)}`}
                                                                className="block text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--lead-text))] py-1 transition-colors"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                {item}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wedding Rings Dropdown */}
                        <div
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown('wedding')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center rounded-md hover:rounded-b-none space-x-4 px-2 py-1.5 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-normal transition-colors cursor-pointer">
                                <span>Wedding Rings</span>
                                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                            </button>

                            {activeDropdown === 'wedding' && (
                                <div className="absolute top-full left-0 w-96 bg-[hsl(var(--card))] shadow-2xl rounded-3xl z-50 rounded-tl-none animate-fade-in-scale" style={{ animationDuration: '200ms' }}>
                                    <div className="p-6 grid grid-cols-2 gap-6">
                                        {Object.entries(weddingCategories).map(
                                            ([category, items]) => (
                                                <div key={category}>
                                                    <h3 className="font-semibold text-[hsl(var(--lead-text))] mb-3 text-sm uppercase tracking-wide">
                                                        {category}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {items.map((item) => (
                                                            <Link
                                                                key={item}
                                                                href={`/collection/${getCollectionSlug('wedding', item)}`}
                                                                className="block text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--lead-text))] py-1 transition-colors"
                                                                onClick={() => setActiveDropdown(null)}
                                                            >
                                                                {item}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Custom Jewelry */}
                        <Link
                            href="/custom"
                            className="py-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-normal transition-colors"
                        >
                            Custom Jewelry
                        </Link>

                        {/* About */}
                        <Link
                            href="/about-us"
                            className="py-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] font-normal transition-colors"
                        >
                            About Us
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Search Modal */}
            <Dialog open={showSearch} onOpenChange={setShowSearch}>
                <DialogContent className="sm:max-w-2xl bg-[hsl(var(--card))] border-[hsl(var(--border))]">
                    <DialogHeader>
                        <DialogTitle className="font-luxury-serif text-2xl text-[hsl(var(--foreground))]">
                            Search Our Collection
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSearch} className="mt-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[hsl(var(--foreground))] opacity-60" />
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
                                onClick={() => {
                                    setShowSearch(false);
                                    setSearchQuery('');
                                }}
                                className="text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="btn-luxury"
                                disabled={!searchQuery.trim()}
                            >
                                Search
                            </Button>
                        </div>
                    </form>
                    <div className="mt-6 pt-6 border-t border-[hsl(var(--border))]">
                        <p className="text-sm font-semibold text-[hsl(var(--foreground))] font-luxury-sans mb-3">
                            Popular Searches:
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
                  transition-all duration-200 font-luxury-sans font-medium cursor-pointer"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50 animate-fade-in"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />

                    <div className="absolute left-0 top-0 bottom-0 w-80 bg-[hsl(var(--card))] shadow-xl overflow-y-auto animate-slide-in-left">
                        <div className="p-4 border-b border-[hsl(var(--border))]">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    className="flex items-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <h1 className="font-luxury-serif text-2xl font-bold text-[hsl(var(--foreground))] leading-tight">
                                        Ever & Always
                                    </h1>
                                </Link>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 hover:text-[hsl(var(--foreground))] rounded-lg cursor-pointer"
                                >
                                    <X className="w-5 h-5 text-[hsl(var(--lead-text))]" />
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <nav className="space-y-1">
                                <div className="font-semibold text-[hsl(var(--foreground))] px-4 py-2 text-sm uppercase tracking-wide">
                                    Shop Categories
                                </div>

                                {/* Engagement Rings Mobile */}
                                <div className="border border-[hsl(var(--border))] rounded-lg">
                                    <div className="px-4 py-3 font-normal text-[hsl(var(--foreground))]">
                                        Engagement Rings
                                    </div>
                                    <div className="px-4 pb-3 space-y-2">
                                        <div className="text-sm text-[hsl(var(--muted-foreground))] font-normal">
                                            By Shape
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                            {engagementCategories['By Shape']
                                                .slice(0, 4)
                                                .map((shape) => (
                                                    <Link
                                                        key={shape}
                                                        href={`/collection/${getCollectionSlug('engagement', shape)}`}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] py-1"
                                                    >
                                                        {shape}
                                                    </Link>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Wedding Rings Mobile */}
                                <div className="border border-[hsl(var(--border))] rounded-lg">
                                    <div className="px-4 py-3 font-normal text-[hsl(var(--foreground))]">
                                        Wedding Rings
                                    </div>
                                    <div className="px-4 pb-3 space-y-2">
                                        <div className="text-sm text-[hsl(var(--muted-foreground))] font-normal">
                                            Women's
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                            {weddingCategories["Women's"].slice(0, 4).map((item) => (
                                                <Link
                                                    key={item}
                                                    href={`/collection/${getCollectionSlug('wedding', item)}`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] py-1"
                                                >
                                                    {item}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Other Collections */}
                                {collections.map((collection) => (
                                    <Link
                                        key={collection.id}
                                        href={`/collection/${collection.slug}`}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block py-3 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-lg font-normal transition-colors"
                                    >
                                        {collection.name}
                                    </Link>
                                ))}

                                <Link
                                    href="/custom"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-lg font-normal transition-colors"
                                >
                                    Custom Jewelry
                                </Link>

                                <Link
                                    href="/about-us"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-3 px-4 text-[hsl(var(--lead-text))] hover:text-[hsl(var(--foreground))] rounded-lg font-normal transition-colors"
                                >
                                    About Us
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
