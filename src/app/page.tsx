import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Hotel, Train, Utensils, Facebook, Twitter, Instagram } from "lucide-react";

import { Button } from "@/components/ui/button";
import { YatraSetuLogo } from "@/components/icons";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <YatraSetuLogo className="h-6 w-6" />
            <span className="font-bold inline-block">YatraSetu</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/train-booking">Train Booking</Link>
            <Link href="/hotel-booking">Hotels</Link>
            <Link href="/food-ordering">Food</Link>
            <Link href="#">Contact</Link>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" asChild>
                <Link href="/dashboard">Login</Link>
            </Button>
            <Button asChild>
                <Link href="#">Signup <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-center text-white">
          <div className="absolute inset-0">
             <Image
              src="https://images.unsplash.com/photo-1620994320253-315a6b0b5610?q=80&w=2070&auto=format&fit=crop"
              alt="Vande Bharat Express"
              data-ai-hint="train landscape"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
          <div className="relative z-10 p-4 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">
              Your Complete Indian Travel Companion
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Seamlessly book trains, hotels, and meals for your next journey across India.
            </p>
            <div className="flex justify-center pt-4">
                <Button size="lg" asChild>
                    <Link href="/dashboard">
                        Start Planning Your Trip
                        <ArrowRight className="ml-2" />
                    </Link>
                </Button>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/40">
            <div className="container">
                 <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
                    <div className="flex items-center gap-3">
                        <Train className="h-6 w-6 text-primary" />
                        <span className="font-semibold">Book Trains</span>
                    </div>
                     <div className="hidden md:block h-6 w-px bg-border"></div>
                    <div className="flex items-center gap-3">
                        <Hotel className="h-6 w-6 text-primary" />
                        <span className="font-semibold">Book Hotels</span>
                    </div>
                     <div className="hidden md:block h-6 w-px bg-border"></div>
                    <div className="flex items-center gap-3">
                        <Utensils className="h-6 w-6 text-primary" />
                        <span className="font-semibold">Food on Train</span>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <footer className="bg-background border-t">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
                <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} YatraSetu. All rights reserved.</p>
            </div>
             <nav className="flex items-center gap-6 text-sm font-medium mb-4 md:mb-0">
                <Link href="#" className="text-muted-foreground hover:text-primary">Support</Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">Helpline</Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link>
             </nav>
            <div className="flex items-center gap-4">
                <Link href="#" aria-label="Facebook"><Facebook className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
                <Link href="#" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary"/></Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
