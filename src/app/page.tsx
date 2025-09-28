import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Clock, Hotel, Rocket, ShieldCheck, Train, Utensils, Wallet, Facebook, Twitter, Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";
import { YatraSetuLogo } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Train,
    title: "Seamless Train Booking",
    description: "Effortlessly search, book, and manage your train tickets with real-time availability and PNR tracking.",
  },
  {
    icon: Hotel,
    title: "Curated Hotel Stays",
    description: "Find the perfect hotel with smart filters for price, ratings, and amenities. Save your favorites to a wishlist.",
  },
  {
    icon: Utensils,
    title: "Food on the Go",
    description: "Order delicious meals from a variety of restaurants, delivered right to your seat at upcoming stations.",
  },
  {
    icon: Bot,
    title: "AI Journey Planner",
    description: "Let our intelligent AI assistant plan your entire trip, from train routes to hotel stays and meal suggestions.",
  },
  {
    icon: Rocket,
    title: "Tatkal Automation",
    description: "Never miss a Tatkal ticket again. Our automated system books your ticket the moment the window opens.",
  },
  {
    icon: Wallet,
    title: "Unified Wallet & Payments",
    description: "Enjoy a secure and streamlined checkout experience with our integrated wallet and multiple payment options.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <YatraSetuLogo className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">YatraSetu</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Signup <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0 z-0">
             <Image
              src="https://images.unsplash.com/photo-1601208940863-7c4c11438a30?q=80&w=2070&auto=format&fit=crop"
              alt="A train moving through a scenic landscape"
              data-ai-hint="train landscape bridge"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="relative z-10 p-4 space-y-6 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">
              Your Complete Bharatiya Travel Companion
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Seamlessly book trains, hotels, and meals for your next journey across Bharat. All in one place.
            </p>
             <p className="text-lg md:text-xl text-amber-300/90 font-serif italic max-w-2xl mx-auto">
              यात्रा सुगमं भवतु – “May your journey be smooth.”
            </p>
            <div className="flex justify-center pt-4">
                <Button size="lg" asChild>
                    <Link href="/login">
                        Start Planning Your Trip
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-muted/40">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Everything You Need for Bharatiya Travel</h2>
                    <p className="text-lg text-muted-foreground mt-4">YatraSetu integrates every step of your journey into a single, easy-to-use platform.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map(feature => (
                        <Card key={feature.title} className="bg-background/80 backdrop-blur">
                            <CardHeader className="flex flex-row items-center gap-4">
                                <feature.icon className="h-8 w-8 text-primary"/>
                                <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="py-16 md:py-24">
            <div className="container grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Why YatraSetu?</h2>
                    <p className="text-lg text-muted-foreground">We built YatraSetu to solve the headaches of Bharatiya travel. No more juggling multiple apps and websites. Plan, book, and manage with confidence.</p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1"/>
                            <div>
                                <h3 className="font-semibold">All-in-One Convenience</h3>
                                <p className="text-muted-foreground">From AI-powered planning to live tracking, everything you need is right here.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1"/>
                            <div>
                                <h3 className="font-semibold">Save Time & Effort</h3>
                                <p className="text-muted-foreground">With saved profiles and Tatkal automation, booking is faster than ever.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-4">
                            <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1"/>
                            <div>
                                <h3 className="font-semibold">Travel Smarter</h3>
                                <p className="text-muted-foreground">Use our AI tools for waitlist prediction and journey planning to make informed decisions.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative h-96 rounded-lg overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1534792410332-9a3d8093a42d?q=80&w=1974&auto=format&fit=crop"
                        alt="A person looking at a map"
                        data-ai-hint="person map"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-gray-900 text-white">
        <div className="container py-12">
            <div className="grid md:grid-cols-4 gap-8">
                 <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <YatraSetuLogo className="h-6 w-6" />
                        YatraSetu
                    </h3>
                    <p className="text-sm text-gray-400">Your complete Bharatiya travel companion.</p>
                 </div>
                 <div>
                     <h4 className="font-semibold mb-4">Quick Links</h4>
                     <nav className="flex flex-col gap-2 text-sm">
                        <Link href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</Link>
                        <Link href="#features" className="text-gray-400 hover:text-white">Features</Link>
                        <Link href="/login" className="text-gray-400 hover:text-white">Login</Link>
                     </nav>
                 </div>
                 <div>
                     <h4 className="font-semibold mb-4">Support</h4>
                     <nav className="flex flex-col gap-2 text-sm">
                        <Link href="#" className="text-gray-400 hover:text-white">Help Center</Link>
                        <Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link>
                        <Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                     </nav>
                 </div>
                 <div>
                    <h4 className="font-semibold mb-4">Follow Us</h4>
                    <div className="flex items-center gap-4">
                        <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-gray-400 hover:text-white"/></Link>
                        <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-gray-400 hover:text-white"/></Link>
                        <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-gray-400 hover:text-white"/></Link>
                    </div>
                 </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} YatraSetu. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}
