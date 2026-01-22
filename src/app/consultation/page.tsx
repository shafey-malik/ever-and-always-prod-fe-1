import type { Metadata } from 'next';
import { Calendar, Clock, Mail, Phone, MapPin, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SITE_NAME } from '@/lib/metadata';

export const metadata: Metadata = {
    title: 'Book a Consultation',
    description: `Schedule a personalized consultation with our jewelry experts at ${SITE_NAME}.`,
};

export default function ConsultationPage() {
    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Hero Section */}
            <section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-[hsl(var(--card))] to-[hsl(var(--background))]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[hsl(var(--accent))] mb-4">
                            <Sparkles className="w-8 h-8 text-[hsl(var(--accent-foreground))]" />
                        </div>
                        <h1 className="font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))]">
                            Book Your Consultation
                        </h1>
                        <p className="text-lg sm:text-xl text-[hsl(var(--muted-foreground))] font-luxury-sans max-w-2xl mx-auto">
                            Experience personalized service with our jewelry experts. Let us help you find or create the perfect piece.
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="animate-fade-in-up">
                                <CardHeader>
                                    <CardTitle className="font-luxury-serif text-2xl">Schedule Your Appointment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" placeholder="John" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" placeholder="Doe" required />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" placeholder="john@example.com" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone</Label>
                                                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="preferredDate">Preferred Date</Label>
                                            <Input id="preferredDate" type="date" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="preferredTime">Preferred Time</Label>
                                            <Input id="preferredTime" type="time" required />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="interest">What are you interested in?</Label>
                                            <select
                                                id="interest"
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                required
                                            >
                                                <option value="">Select an option</option>
                                                <option value="engagement-ring">Engagement Ring</option>
                                                <option value="wedding-ring">Wedding Ring</option>
                                                <option value="custom-jewelry">Custom Jewelry</option>
                                                <option value="diamond-selection">Diamond Selection</option>
                                                <option value="repair-service">Repair Service</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message (Optional)</Label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us about your vision or any specific requirements..."
                                                rows={5}
                                                className="resize-none"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full btn-luxury">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Request Consultation
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <Card className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                                <CardHeader>
                                    <CardTitle className="font-luxury-serif text-xl">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-[hsl(var(--accent))]">
                                            <Phone className="w-5 h-5 text-[hsl(var(--accent-foreground))]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[hsl(var(--foreground))]">Phone</p>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">+1 (555) 123-4567</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-[hsl(var(--accent))]">
                                            <Mail className="w-5 h-5 text-[hsl(var(--accent-foreground))]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[hsl(var(--foreground))]">Email</p>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">consultation@everandalways.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-[hsl(var(--accent))]">
                                            <MapPin className="w-5 h-5 text-[hsl(var(--accent-foreground))]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[hsl(var(--foreground))]">Location</p>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                123 Luxury Avenue<br />
                                                New York, NY 10001
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="p-2 rounded-lg bg-[hsl(var(--accent))]">
                                            <Clock className="w-5 h-5 text-[hsl(var(--accent-foreground))]" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-[hsl(var(--foreground))]">Hours</p>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                Mon - Sat: 10:00 AM - 6:00 PM<br />
                                                Sunday: By Appointment
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                <CardHeader>
                                    <CardTitle className="font-luxury-serif text-xl">What to Expect</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] mt-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            Personalized one-on-one consultation
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] mt-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            Expert guidance on diamond selection
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] mt-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            Custom design discussions
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] mt-2" />
                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                            No pressure, relaxed environment
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
