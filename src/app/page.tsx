

import Link from "next/link";
import { ArrowRight, Bot, Clock, Hotel, Rocket, ShieldCheck, Train, Utensils, Wallet, Facebook, Twitter, Instagram, Linkedin, User, LifeBuoy, Info, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { YaatraSetuLogo } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { AppFooter } from "@/components/layout/app-footer";
import { PublicHeader } from "@/components/layout/public-header";

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
  const whyYaatraSetuImage = PlaceHolderImages.find(img => img.id === 'why-yatrasetu');
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background-train');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PublicHeader />

      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image 
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          <div className="relative z-10 p-4 space-y-6 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">
              The Future of Indian Travel
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Experience the next generation of travel with smart booking, AI-powered planning, and seamless service.
            </p>
             <p className="text-lg md:text-xl text-amber-300/90 font-serif italic max-w-2xl mx-auto">
              यात्रा सुगमं भवतु – “May your journey be smooth.”
            </p>
            <div className="flex justify-center pt-4">
                <Button size="lg" asChild>
                    <Link href="/auth/signup">
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
                    <p className="text-lg text-muted-foreground mt-4">YaatraSetu integrates every step of your journey into a single, easy-to-use platform.</p>
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
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Why YaatraSetu?</h2>
                    <p className="text-lg text-muted-foreground">We built YaatraSetu to solve the headaches of Bharatiya travel. No more juggling multiple apps and websites. Plan, book, and manage with confidence.</p>
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
                <div className="relative h-96 rounded-lg overflow-hidden bg-gray-200">
                  {whyYaatraSetuImage && (
                    <Image 
                        src={whyYaatraSetuImage.imageUrl} 
                        alt={whyYaatraSetuImage.description} 
                        fill
                        className="object-cover"
                        data-ai-hint={whyYaatraSetuImage.imageHint}
                    />
                  )}
                </div>
            </div>
        </section>

      </main>

      <AppFooter />
    </div>
  );
}
