
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
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useEffect, useState } from "react";
import { getBookings } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

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


export default function DashboardPage() {
  const { profileData, loading: profileLoading } = useUserProfile();
  const { user } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    if (user) {
        setBookingsLoading(true);
        const unsubscribe = getBookings(user.uid, (data) => {
            const futureTrips = data.filter(trip => new Date(trip.date) >= new Date(new Date().setHours(0,0,0,0)));
            setUpcomingTrips(futureTrips);
            setBookingsLoading(false);
        });
        return () => unsubscribe();
    }
  }, [user])

  const loading = profileLoading || bookingsLoading;

  if (loading) {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <Skeleton className="h-9 w-64" />
                <Skeleton className="h-5 w-96" />
            </div>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_,i) => <Skeleton key={i} className="h-40" />)}
             </div>
             <Skeleton className="h-64 w-full" />
        </div>
    )
  }

  const getTripDetails = (trip: any) => {
    switch (trip.type) {
      case "Train":
        return `${trip.train.from} to ${trip.train.to} - ${trip.train.name}`;
      case "Hotel":
        return trip.hotel.name;
      case "Food":
        return `Order at ${trip.station}`;
      default:
        return "Unknown Booking";
    }
  }

  const getStatus = (trip: any) => {
    if (trip.status && trip.status.toLowerCase().includes("waitlisted")) return `Waitlisted (${trip.status})`;
    return trip.status;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome back, {profileData?.displayName || "Traveller"}!
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
              {upcomingTrips.length > 0 ? upcomingTrips.map((trip) => (
                <TableRow key={trip.id}>
                  <TableCell className="font-medium truncate max-w-24">{trip.id}</TableCell>
                  <TableCell>{trip.type}</TableCell>
                  <TableCell>{getTripDetails(trip)}</TableCell>
                  <TableCell>{format(new Date(trip.date), "PPP")}</TableCell>
                  <TableCell>
                    <Badge variant={trip.status.includes("Confirmed") || trip.status.includes("Booked") ? "default" : trip.status.includes("Waitlisted") ? "secondary" : "destructive"} className={trip.status.includes("Waitlisted") ? "bg-amber-500/20 text-amber-700 border-amber-500/30" : ""}>
                        {getStatus(trip)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    You have no upcoming trips. Time to plan an adventure!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
