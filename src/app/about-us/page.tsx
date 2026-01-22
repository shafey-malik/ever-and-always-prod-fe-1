import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Shield, Sparkles, Users, Award, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SITE_NAME } from '@/lib/metadata';

export const metadata: Metadata = {
    title: 'About Us',
    description: `Learn about ${SITE_NAME} - our story, mission, and commitment to creating timeless jewelry that celebrates life's most precious moments.`,
    openGraph: {
        title: `About Us | ${SITE_NAME}`,
        description: `Learn about ${SITE_NAME} - our story, mission, and commitment to creating timeless jewelry that celebrates life's most precious moments.`,
    },
};

const differentiators = [
    {
        icon: Heart,
        title: 'Customer-First Philosophy',
        description: 'Every decision we make starts with you. From personalized consultations to lifetime support, your satisfaction is our priority.',
    },
    {
        icon: Shield,
        title: 'Uncompromising Quality',
        description: 'We source only conflict-free diamonds and work with master craftsmen to ensure each piece meets our exacting standards.',
    },
    {
        icon: Sparkles,
        title: 'Timeless Design',
        description: 'Our collections blend classic elegance with modern sensibility, creating pieces that will be cherished for generations.',
    },
    {
        icon: Award,
        title: 'Expert Guidance',
        description: 'Our experienced jewelry consultants guide you through every step, ensuring you find the perfect piece with confidence.',
    },
    {
        icon: Users,
        title: 'Personal Touch',
        description: 'Whether custom designing or selecting from our collection, we make your journey as unique and special as your story.',
    },
];

const values = [
    {
        title: 'Integrity',
        description: 'Transparent pricing, ethical sourcing, and honest advice.',
    },
    {
        title: 'Craftsmanship',
        description: 'Meticulous attention to detail in every piece we create.',
    },
    {
        title: 'Innovation',
        description: 'Blending time-honored techniques with modern design.',
    },
];

export default function AboutUsPage() {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Hero Section */}
            <section className="relative py-20 sm:py-28 lg:py-36 bg-gradient-to-b from-[hsl(var(--surface-luxury))] to-[hsl(var(--background))] overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-[hsl(var(--secondary))] rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-[hsl(var(--accent))] rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))] mb-6 shadow-lg">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                        
                        <h1 className="font-luxury-serif text-4xl sm:text-5xl lg:text-7xl font-light text-[hsl(var(--foreground))] leading-tight">
                            Celebrating Love,<br />
                            <span className="text-[hsl(var(--secondary))]">One Moment at a Time</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl lg:text-2xl text-[hsl(var(--muted-foreground))] font-luxury-sans max-w-3xl mx-auto leading-relaxed">
                            We believe every love story deserves to be told through exceptional jewelry. 
                            For over two decades, we've been crafting pieces that capture life's most precious moments.
                        </p>

                        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--secondary))]" />
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 sm:py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <p className="text-[hsl(var(--secondary))] font-luxury-sans text-sm uppercase tracking-wider mb-4">Our Journey</p>
                            <h2 className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] mb-6">
                                A Story Built on Passion
                            </h2>
                        </div>

                        <div className="space-y-6 text-[hsl(var(--muted-foreground))] font-luxury-sans text-base sm:text-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <p>
                                Ever & Always began with a simple vision: to create jewelry that would be treasured for generations. 
                                Founded in 2003 by master jeweler Michael Chen, our journey started in a small workshop where every piece 
                                was crafted with meticulous care and unwavering attention to detail.
                            </p>
                            
                            <p>
                                Michael's passion for exceptional craftsmanship and his belief that jewelry should tell a story led him 
                                to source only the finest diamonds and precious metals. He understood that an engagement ring, a wedding 
                                band, or any piece of fine jewelry represents more than just an accessory—it's a symbol of love, commitment, 
                                and cherished memories.
                            </p>
                            
                            <p>
                                Today, while we've grown from that small workshop into a trusted name in fine jewelry, our core values 
                                remain unchanged. Every piece we create is still crafted with the same dedication to quality and artistry 
                                that defined our beginnings. We're honored to be part of your story.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-16 sm:py-20 bg-[hsl(var(--card))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                            <Card className="border-none shadow-none bg-transparent animate-fade-in-up">
                                <CardContent className="p-8 lg:p-10 bg-gradient-to-br from-[hsl(var(--accent))] to-transparent border border-[hsl(var(--border))] rounded-2xl">
                                    <div className="w-14 h-14 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center mb-6">
                                        <Heart className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-luxury-serif text-2xl sm:text-3xl font-light text-[hsl(var(--foreground))] mb-4">
                                        Our Mission
                                    </h3>
                                    <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans leading-relaxed">
                                        To create exceptional jewelry that celebrates life's most meaningful moments, 
                                        combining timeless design with uncompromising quality and personalized service.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none bg-transparent animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <CardContent className="p-8 lg:p-10 bg-gradient-to-br from-[hsl(var(--accent))] to-transparent border border-[hsl(var(--border))] rounded-2xl">
                                    <div className="w-14 h-14 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center mb-6">
                                        <Sparkles className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-luxury-serif text-2xl sm:text-3xl font-light text-[hsl(var(--foreground))] mb-4">
                                        Our Vision
                                    </h3>
                                    <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans leading-relaxed">
                                        To be the most trusted name in fine jewelry, known for our integrity, craftsmanship, 
                                        and dedication to making every customer's experience extraordinary.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Makes Us Different Section */}
            <section className="py-16 sm:py-20 lg:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12 lg:mb-16 animate-fade-in-up">
                            <p className="text-[hsl(var(--secondary))] font-luxury-sans text-sm uppercase tracking-wider mb-4">Why Choose Us</p>
                            <h2 className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] mb-6">
                                What Sets Us Apart
                            </h2>
                            <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-lg max-w-2xl mx-auto">
                                We're committed to excellence in every aspect of our craft.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {differentiators.map((item, index) => (
                                <Card 
                                    key={index}
                                    className="group hover:shadow-lg transition-all duration-300 border border-[hsl(var(--border))] animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <CardContent className="p-8">
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="font-luxury-serif text-xl font-semibold text-[hsl(var(--foreground))] mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-[hsl(var(--background))] to-[hsl(var(--surface-luxury))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12 animate-fade-in-up">
                            <h2 className="font-luxury-serif text-3xl sm:text-4xl font-light text-[hsl(var(--foreground))] mb-6">
                                Our Core Values
                            </h2>
                            <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-lg">
                                The principles that guide everything we do.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {values.map((value, index) => (
                                <div 
                                    key={index}
                                    className="text-center space-y-4 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(var(--card))] border-2 border-[hsl(var(--secondary))] flex items-center justify-center">
                                        <div className="w-3 h-3 rounded-full bg-[hsl(var(--secondary))]" />
                                    </div>
                                    <h3 className="font-luxury-serif text-xl font-semibold text-[hsl(var(--foreground))]">
                                        {value.title}
                                    </h3>
                                    <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 sm:py-20 lg:py-28 bg-[hsl(var(--card))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
                        <h2 className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))]">
                            Let's Create Something Beautiful Together
                        </h2>
                        
                        <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] font-luxury-sans max-w-2xl mx-auto">
                            Whether you're looking for the perfect engagement ring, a special gift, or a custom piece, 
                            we're here to help bring your vision to life.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                            <Link href="/consultation">
                                <Button className="btn-luxury px-8 py-6 text-base">
                                    <Calendar className="w-5 h-5 mr-2" />
                                    Book a Consultation
                                </Button>
                            </Link>
                            <Link href="/search">
                                <Button 
                                    variant="outline" 
                                    className="px-8 py-6 text-base border-2 hover:bg-[hsl(var(--accent))] transition-all duration-300"
                                >
                                    Explore Collections
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        <div className="pt-12 border-t border-[hsl(var(--border))] mt-12">
                            <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm mb-4">
                                Have questions? We're here to help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm">
                                <a 
                                    href="tel:+15551234567" 
                                    className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--secondary))] transition-colors flex items-center gap-2"
                                >
                                    <span className="font-medium">Call us:</span> +1 (555) 123-4567
                                </a>
                                <span className="hidden sm:inline text-[hsl(var(--border))]">|</span>
                                <a 
                                    href="mailto:hello@everandalways.com" 
                                    className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--secondary))] transition-colors flex items-center gap-2"
                                >
                                    <span className="font-medium">Email:</span> hello@everandalways.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
