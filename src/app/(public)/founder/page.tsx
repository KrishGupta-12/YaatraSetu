
"use client";

import Image from "next/image";
import { Mail, Linkedin, Globe, Users, Target, Rocket } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const teamMembers = [
    {
        name: "Shreyansh Mall",
        role: "Head of Product & Innovation",
        avatar: "https://picsum.photos/seed/shreyansh/200/200"
    },
    {
        name: "Aman Sagar",
        role: "Head of Operations & Logistics",
        avatar: "https://picsum.photos/seed/aman/200/200"
    },
    {
        name: "Lata Saini",
        role: "Head of Customer Service & Support",
        avatar: "https://picsum.photos/seed/lata/200/200"
    },
    {
        name: "Varad Mahesh Rajadhyax",
        role: "Head of Strategy & Partnerships",
        avatar: "https://picsum.photos/seed/varad/200/200"
    },
    {
        name: "Methelesh Kumar",
        role: "Head of Technical Operations",
        avatar: "https://picsum.photos/seed/methelesh/200/200"
    }
];

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
                objectPosition="top"
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
          The passionate individuals dedicated to revolutionizing travel in India.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member) => (
                <Card key={member.name} className="text-center hover:shadow-lg hover:scale-105 transition-transform duration-300">
                    <CardContent className="flex flex-col items-center pt-6">
                        <Avatar className="h-24 w-24 mb-4 border-2 border-primary/50">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary">{member.role}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>
    </div>
  );
}

