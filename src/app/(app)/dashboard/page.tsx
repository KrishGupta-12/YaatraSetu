
"use client";

import {
  ArrowRight,
  Bot,
  Hotel,
  TicketCheck,
  Train,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

const features = [
  {
    title: "AI Journey Planner",
    description: "Let our AI plan the perfect trip for you.",
    href: "/ai-planner",
    icon: Bot,
    cta: "Start Planning",
  },
  {
    title: "Book a Train",
    description: "Search and book train tickets in minutes.",
    href: "/train-booking",
    icon: Train,
    cta: "Book Now",
  },
  {
    title: "Waitlist Prediction",
    description: "Check your ticket confirmation chances.",
    href: "/waitlist-prediction",
    icon: TicketCheck,
    cta: "Predict Chance",
  },
  {
    title: "Book a Hotel",
    description: "Find the best hotels for your stay.",
    href: "/hotel-booking",
    icon: Hotel,
    cta: "Find Hotels",
  },
];

const upcomingTrips = [
  {
    id: "PNR847563",
    type: "Train",
    details: "Mumbai to Delhi - 12951 Rajdhani Exp",
    date: "2024-08-15",
    status: "Confirmed",
  },
  {
    id: "HTL937465",
    type: "Hotel",
    details: "Taj Palace, New Delhi",
    date: "2024-08-16",
    status: "Booked",
  },
  {
    id: "PNR293847",
    type: "Train",
    details: "Delhi to Agra - 12002 Shatabdi Exp",
    date: "2024-08-18",
    status: "Waitlisted (WL-12)",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, {user?.displayName || "Traveller"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your travel hub. Manage bookings and plan your next adventure.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {feature.title}
              </CardTitle>
              <feature.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-xs text-muted-foreground mb-4">
                {feature.description}
              </p>
              <Button asChild size="sm" className="w-full mt-auto">
                <Link href={feature.href}>
                  {feature.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Trips</CardTitle>
          <CardDescription>
            A quick look at your upcoming travel plans.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium">{trip.id}</TableCell>
                  <TableCell>{trip.type}</TableCell>
                  <TableCell>{trip.details}</TableCell>
                  <TableCell>{trip.date}</TableCell>
                  <TableCell>
                    <Badge variant={trip.status.includes("Confirmed") || trip.status.includes("Booked") ? "default" : trip.status.includes("Waitlisted") ? "secondary" : "destructive"} className={trip.status.includes("Waitlisted") ? "bg-amber-500/20 text-amber-700 border-amber-500/30" : ""}>
                        {trip.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
