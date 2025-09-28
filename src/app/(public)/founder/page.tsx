
"use client";

import Image from "next/image";
import { Mail, Linkedin, Globe, Users, Target, Rocket } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";

export default function FounderPage() {
  const founderImage = PlaceHolderImages.find(
    (img) => img.id === "founder-photo"
  );

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <section className="grid md:grid-cols-3 gap-8 md:gap-12 items-center">
        <div className="md:col-span-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl border-4 border-primary/50">
            {founderImage && (
              <Image
                src={founderImage.imageUrl}
                alt={founderImage.description}
                layout="fill"
                objectFit="cover"
                data-ai-hint={founderImage.imageHint}
              />
            )}
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div>
            <p className="text-primary font-semibold text-lg">
              Founder & CEO
            </p>
            <h1 className="text-4xl md:text-6xl font-bold font-headline text-foreground">
              Krish Gupta
            </h1>
          </div>
          <div className="space-y-3 text-muted-foreground">
            <a
              href="mailto:krishgupta200510@gmail.com"
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span>krishgupta200510@gmail.com</span>
            </a>
            <a
              href="https://krishgupta.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span>https://krishgupta.in</span>
            </a>
            <a
              href="https://www.linkedin.com/in/krish-gupta-11612327a/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>
      </section>

      <Separator className="my-16" />

      <section className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold font-headline mb-8">
          Vision & Mission
        </h2>
        <div className="grid md:grid-cols-2 gap-8 text-left">
           <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                <Target className="h-10 w-10 text-primary"/>
                <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              To become the most trusted and seamless travel platform for every
              citizen of Bharat, simplifying journeys and connecting people through
              technology and innovation.
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center gap-4">
                 <Rocket className="h-10 w-10 text-primary"/>
                <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Our mission is to integrate all aspects of Indian travel—trains,
              hotels, and local services—into a single, intelligent, and
              user-friendly application, powered by cutting-edge AI.
            </CardContent>
          </Card>
        </div>
      </section>

       <Separator className="my-16" />

      <section className="text-center">
        <h2 className="text-3xl font-bold font-headline mb-4">Meet the Team</h2>
         <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          We are a small but passionate team dedicated to revolutionizing travel in India. More team members coming soon!
        </p>
        <div className="flex justify-center">
            <div className="p-8 border-2 border-dashed rounded-lg text-muted-foreground flex flex-col items-center gap-4">
                <Users className="h-12 w-12"/>
                <p>More brilliant minds joining our journey soon.</p>
            </div>
        </div>
      </section>
    </div>
  );
}
