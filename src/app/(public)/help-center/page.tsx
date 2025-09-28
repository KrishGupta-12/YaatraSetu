
"use client";

import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LifeBuoy, Search, Train, Hotel, Sparkles, CookingPot } from "lucide-react";
import { useState } from "react";

const faqs = [
    {
        category: "Train Booking",
        icon: Train,
        questions: [
            { q: "How do I book a train ticket?", a: "Navigate to the 'Train Booking' page, enter your source, destination, and date. Select a train and class, add passengers, and proceed to payment." },
            { q: "Can I check PNR status?", a: "Yes, on the 'Train Booking' page, there is a quick action button to check your PNR status instantly by entering your 10-digit PNR number." },
            { q: "What quotas are available for booking?", a: "We support General, Tatkal, Premium Tatkal, and Ladies quotas for booking through our platform." },
            { q: "How do I add or manage saved passengers?", a: "You can add, view, and remove co-travellers from the 'My Profile' page. These saved passengers can be quickly added to any train booking." },
        ]
    },
    {
        category: "Hotel Booking",
        icon: Hotel,
        questions: [
            { q: "How do I find hotels in a specific city?", a: "On the 'Hotel Booking' page, enter your destination city, check-in/check-out dates, and number of guests to see a list of available hotels." },
            { q: "Can I filter hotels by amenities?", a: "Yes, you can use the filters on the left sidebar to narrow down your search by price range, star rating, and amenities like WiFi, Pool, and Gym." },
            { q: "How do I save a hotel to my wishlist?", a: "Click the heart icon on any hotel card to add it to your personal wishlist for later comparison and easy booking." },
        ]
    },
    {
        category: "Tatkal Automation",
        icon: Sparkles,
        questions: [
            { q: "How does Tatkal Automation work?", a: "You pre-fill your journey and passenger details on the 'Tatkal Automation' page. Our secure backend system then automatically attempts to book your ticket the moment the Tatkal window opens (10 AM for AC, 11 AM for non-AC)." },
            { q: "Is booking guaranteed with the automation tool?", a: "While our tool significantly increases your chances by automating the process at high speed, it is not a 100% guarantee due to the extremely high demand for Tatkal tickets. We recommend setting up your request well in advance." },
            { q: "Where can I see my scheduled Tatkal requests?", a: "On the 'Tatkal Automation' page, click the 'View Scheduled Requests' button to see a list of your pending and completed automation tasks and their status." },
        ]
    },
    {
        category: "Food Ordering",
        icon: CookingPot,
        questions: [
            { q: "How do I order food to my train seat?", a: "Go to the 'Food Orders' page, enter your 10-digit PNR, and we will show you verified restaurants that can deliver to your upcoming stations. Add items to your cart and check out." },
            { q: "How is the food delivery timed?", a: "Our system tracks your train's live running status to ensure food is prepared and delivered fresh when your train arrives at the selected delivery station." },
            { q: "What kind of dietary options are available?", a: "You can filter restaurants and food items by dietary preferences such as Veg, Non-Veg, and Jain to suit your needs." },
        ]
    },
]

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = faqs.map(category => ({
      ...category,
      questions: category.questions.filter(
          q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) || q.a.toLowerCase().includes(searchTerm.toLowerCase())
      )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <LifeBuoy className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Help Center</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Have questions? We're here to help. Find answers to common queries
          below.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for answers..."
            className="w-full pl-10 py-6 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(category => (
            <div key={category.category} className="mb-8">
              <h2 className="text-2xl font-bold font-headline flex items-center gap-3 mb-4">
                <category.icon className="h-6 w-6 text-primary"/>
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {category.questions.map(faq => (
                  <AccordionItem key={faq.q} value={faq.q} className="bg-muted/50 rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No results found for &quot;{searchTerm}&quot;.</p>
        )}
      </div>
    </div>
  );
}
