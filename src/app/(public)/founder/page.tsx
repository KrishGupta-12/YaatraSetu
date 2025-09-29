
"use client";

import Image from "next/image";
import { Mail, Linkedin, Globe, Target, Rocket } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const teamMembers = [
    {
        name: "To Be Announced",
        role: "Technical Operations",
        initials: "TO",
        email: "krishgupta200510@gmail.com",
        linkedin: "https://www.linkedin.com/in/krish-gupta-11612327a/",
        description: "Architects our robust backend, ensuring our platform runs with flawless stability, scalability, and security, managing everything from server infrastructure to deployment pipelines."
    },
    {
        name: "To Be Announced",
        role: "Strategy & Partnerships",
        initials: "SP",
        email: "krishgupta200510@gmail.com",
        linkedin: "https://www.linkedin.com/in/krish-gupta-11612327a/",
        description: "Forges key alliances and develops long-term growth roadmaps. This vision is pivotal in expanding YaatraSetu's services and market presence."
    },
    {
        name: "To Be Announced",
        role: "Operations & Logistics",
        initials: "OL",
        email: "krishgupta200510@gmail.com",
        linkedin: "https://www.linkedin.com/in/krish-gupta-11612327a/",
        description: "Coordinates booking fulfillment, hotel partner relations, and food delivery logistics to ensure a seamless user experience from start to finish."
    }
];

export default function FounderPage() {
  const founderImage = PlaceHolderImages.find(
    (img) => img.id === "founder-photo"
  );

  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null);

  return (
    <Dialog onOpenChange={(open) => !open && setSelectedMember(null)}>
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
            <p className="text-lg text-muted-foreground">
              Krish Gupta is a visionary technologist with a passion for innovation, dedicated to transforming how India experiences travel. He founded YaatraSetu to create a seamless, intelligent, and unified platform that simplifies journeys for millions of Indians. By combining cutting-edge technology, user-centric design, and real-time solutions, he is building a smarter, faster, and more enjoyable travel experience for everyone.
            </p>
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
            Our North Star: The Vision & Mission
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                  <Target className="h-10 w-10 text-primary"/>
                  <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                To engineer the most elegant and frictionless travel ecosystem for every citizen of Bharat, bridging destinations and aspirations through world-class technology and user-centric design.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                  <Rocket className="h-10 w-10 text-primary"/>
                  <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Our mission is to relentlessly integrate every facet of Indian travel—from trains and hotels to last-mile services—into a singular, predictive, and hyper-personalized application powered by cutting-edge AI.
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-16" />

        <section className="text-center">
          <h2 className="text-3xl font-bold font-headline mb-4">The Architects of YaatraSetu</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Meet the passionate minds dedicated to building the future of travel in India. Each member brings a unique blend of expertise and commitment to our shared vision.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teamMembers.map((member) => (
                  <DialogTrigger key={member.name} asChild>
                      <div onClick={() => setSelectedMember(member)}>
                          <Card className="text-center hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                              <CardContent className="flex flex-col items-center pt-6">
                                  <Avatar className="h-24 w-24 mb-4 border-2 border-primary/50">
                                      <AvatarFallback className="text-2xl font-bold">{member.initials}</AvatarFallback>
                                  </Avatar>
                                  <h3 className="text-lg font-semibold">{member.role}</h3>
                                  <p className="text-sm text-muted-foreground">{member.name}</p>
                              </CardContent>
                          </Card>
                      </div>
                  </DialogTrigger>
              ))}
          </div>
        </section>
      </div>
      
      {selectedMember && (
        <DialogContent>
          <DialogHeader>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-3xl">{selectedMember.initials}</AvatarFallback>
              </Avatar>
              <DialogTitle className="text-2xl">{selectedMember.role}</DialogTitle>
              <DialogDescription>{selectedMember.name}</DialogDescription>
            </div>
          </DialogHeader>
          <div className="py-4 space-y-6">
              <p className="text-sm text-muted-foreground text-center">{selectedMember.description}</p>
              <Separator />
              <h4 className="font-semibold text-center text-muted-foreground">Contact & Socials</h4>
              <div className="flex justify-center items-center gap-6">
                 <Button variant="outline" size="icon" asChild>
                      <a href={`mailto:${selectedMember.email}`}><Mail /></a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                      <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin /></a>
                  </Button>
              </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
