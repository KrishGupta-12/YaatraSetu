
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, TicketCheck, ListFilter, Train, Bot, Languages } from "lucide-react";
import Image from "next/image";

const featureList = [
    {
        category: "Train Booking",
        title: "Tatkal Automation",
        description: "Our intelligent system automates the Tatkal booking process, dramatically increasing your chances of securing a last-minute ticket. Just set your journey details, and we'll handle the rest.",
        icon: Rocket,
        image: "https://picsum.photos/seed/feature1/600/400",
        imageHint: "fast train",
    },
    {
        category: "Train Booking",
        title: "Waitlist Prediction",
        description: "Anxious about a waitlisted ticket? Our AI analyzes historical data, PNR trends, and seasonal demand to give you an accurate prediction of your confirmation chances.",
        icon: TicketCheck,
        image: "https://picsum.photos/seed/feature2/600/400",
        imageHint: "data chart",
    },
    {
        category: "Hotel Booking",
        title: "Advanced Filters & Wishlist",
        description: "Find the perfect stay with powerful filters for price, amenities, and ratings. Save your favorite hotels to a wishlist for easy comparison and future booking.",
        icon: ListFilter,
        image: "https://picsum.photos/seed/feature3/600/400",
        imageHint: "hotel room"
    },
     {
        category: "Food Ordering",
        title: "Live Train Tracking for Delivery",
        description: "Order food with confidence. We track your train's live running status to ensure your meal is prepared and delivered fresh to your seat at the right station, right on time.",
        icon: Train,
        image: "https://picsum.photos/seed/feature4/600/400",
        imageHint: "food delivery"
    },
    {
        category: "AI Powered",
        title: "AI Journey Planner",
        description: "Describe your ideal trip, and let our AI do the work. It suggests optimal train routes, curated hotel options, and even multi-modal travel plans, all tailored to your budget and preferences.",
        icon: Bot,
        image: "https://picsum.photos/seed/feature5/600/400",
        imageHint: "AI planning"
    },
    {
        category: "AI Powered",
        title: "Multi-language Support",
        description: "YaatraSetu speaks your language. Our platform offers support for multiple Indian languages, making it accessible to everyone across Bharat. More languages are being added continuously.",
        icon: Languages,
        image: "https://picsum.photos/seed/feature6/600/400",
        imageHint: "language translation"
    }
]

export default function FeaturesPage() {
    return (
        <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">YaatraSetu Features</h1>
                <p className="text-lg text-muted-foreground mt-4">
                    Discover the powerful tools we've built to make your travel across Bharat seamless, intelligent, and stress-free.
                </p>
            </div>
            
            <div className="space-y-16">
                {featureList.map((feature, index) => (
                    <Card key={feature.title} className="overflow-hidden grid md:grid-cols-2 items-center">
                        <div className={`p-8 md:p-12 space-y-4 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">{feature.category}</div>
                            <h2 className="text-3xl font-bold font-headline flex items-center gap-3">
                                <feature.icon className="h-8 w-8 text-primary"/>
                                {feature.title}
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                {feature.description}
                            </p>
                        </div>
                        <div className={`relative h-64 md:h-full min-h-[300px] ${index % 2 === 0 ? 'md:order-2' : 'md-order-1'}`}>
                            <Image
                                src={feature.image}
                                alt={feature.title}
                                fill
                                className="object-cover"
                                data-ai-hint={feature.imageHint}
                            />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
