
"use client";

import {
  ArrowRight,
  Bot,
  CookingPot,
  Download,
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
  CardFooter,
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
import { useEffect, useState, useRef } from "react";
import { getBookings } from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { YatraSetuLogo } from "@/components/icons";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

const Invoice = ({ booking, innerRef }: { booking: any, innerRef: React.Ref<HTMLDivElement> }) => {
    const getDetails = () => {
        switch (booking.type) {
            case "Train":
                return {
                    title: `Train Ticket: ${booking.train.from} to ${booking.train.to}`,
                    items: booking.passengers,
                    itemLabel: "Passengers",
                    itemRender: (p: any) => `${p.name} (${p.age}, ${p.gender})`,
                };
            case "Hotel":
                return {
                    title: `Hotel Voucher: ${booking.hotel.name}`,
                    items: booking.guests,
                    itemLabel: "Guests",
                    itemRender: (g: any) => `${g.name}`,
                };
            case "Food":
                 return {
                    title: `Food Order at ${booking.station}`,
                    items: [{name: `${booking.items} items`}],
                    itemLabel: "Order",
                    itemRender: (i: any) => i.name,
                };
            default:
                return { title: "Booking Invoice", items: [], itemLabel: "Items", itemRender: () => ""};
        }
    };
    const { title, items, itemLabel, itemRender } = getDetails();
    
    return (
        <div ref={innerRef} className="bg-white text-black p-8 max-w-2xl mx-auto">
             <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-2">
                    <YatraSetuLogo className="h-8 w-8 text-primary"/>
                    <h1 className="text-2xl font-bold">YatraSetu</h1>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-semibold">Tax Invoice</h2>
                    <p className="text-sm">ID: {booking.id}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                    <h3 className="font-semibold">Billed To:</h3>
                    <p>{booking.userName || "Customer"}</p>
                    <p>{booking.userEmail || ""}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-semibold">Invoice Date:</span> {format(new Date(), "PPP")}</p>
                    <p><span className="font-semibold">Booking Date:</span> {format(new Date(booking.date), "PPP")}</p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="py-2">{itemLabel}</th>
                            <th className="py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                       {booking.type === 'Train' && items.map((item: any, index: number) => (
                           <tr key={index} className="border-b">
                                <td className="py-2">{itemRender(item)}</td>
                               <td className="py-2 text-right">Rs. {booking.selectedClass.price.toLocaleString()}</td>
                           </tr>
                       ))}
                        {booking.type !== 'Train' && 
                            <tr className="border-b">
                                <td className="py-2">Total Items</td>
                                <td className="py-2 text-right">Rs. {(booking.fare - 59).toLocaleString()}</td>
                           </tr>
                        }
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex justify-end">
                <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                        <span className="font-semibold">Subtotal:</span>
                        <span>Rs. {(booking.fare - 59).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Taxes & Fees:</span>
                        <span>Rs. 59</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>Rs. {booking.fare.toLocaleString()}</span>
                    </div>
                </div>
            </div>
             <div className="mt-12 text-center text-xs text-gray-500">
                <p>Thank you for booking with YatraSetu!</p>
                <p>This is a computer-generated invoice and does not require a signature.</p>
            </div>
        </div>
    )
};

const TripDetailsDialog = ({ trip }: { trip: any }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const input = invoiceRef.current;
        if (!input) return;

        html2canvas(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;
          const width = pdfWidth;
          const height = width / ratio;
          
          let position = 0;
          if (height > pdfHeight) {
              pdf.addImage(imgData, 'PNG', 0, 0, width, height);
          } else {
               position = (pdfHeight - height) / 2;
               pdf.addImage(imgData, 'PNG', 0, position, width, height);
          }

          pdf.save(`YatraSetu-Invoice-${trip.id.slice(0, 8)}.pdf`);
        });
    };
    
    const getDetails = () => {
        switch (trip.type) {
            case "Train":
                return {
                    title: `${trip.train.from} to ${trip.train.to}`,
                    description: `${trip.train.name} (${trip.train.id})`,
                    icon: <Train className="h-5 w-5 text-primary" />,
                };
            case "Hotel":
                return { title: trip.hotel.name, description: `Check-in: ${format(new Date(trip.date), "PPP")}`, icon: <Hotel className="h-5 w-5 text-primary" /> };
            case "Food":
                return { title: `Food Order at ${trip.station}`, description: `${trip.items} items`, icon: <CookingPot className="h-5 w-5 text-primary" /> };
            default:
                return { title: "Unknown Booking", description: "", icon: null };
        }
    };
    const { title, description, icon } = getDetails();

    return (
        <DialogContent className="max-w-md">
            <div style={{ position: 'fixed', left: '-2000px', top: 0 }}>
                <Invoice booking={trip} innerRef={invoiceRef} />
            </div>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">{icon}{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Booking ID</span>
                    <span className="font-mono text-xs">{trip.id}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span>{format(new Date(trip.date), "PPP")}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant={trip.status.includes("Confirmed") || trip.status.includes("Booked") ? "default" : "secondary"}>{trip.status}</Badge>
                </div>
                 {trip.type === 'Train' && (
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Passengers</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {trip.passengers.map((p: any) => <li key={p.id}>{p.name} ({p.age}, {p.gender})</li>)}
                        </ul>
                    </div>
                 )}
                  {trip.type === 'Hotel' && (
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Guests</h4>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {trip.guests.map((g: any, i: number) => <li key={i}>{g.name}</li>)}
                        </ul>
                    </div>
                 )}
                 <div className="flex justify-between font-bold pt-4 border-t">
                    <span>Total Amount</span>
                    <span>Rs. {trip.fare.toLocaleString()}</span>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" className="w-full" onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" /> Download Invoice
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}


export default function DashboardPage() {
  const { profileData, loading: profileLoading } = useUserProfile();
  const { user } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
        setBookingsLoading(true);
        const unsubscribe = getBookings(user.uid, (data) => {
            const enrichedData = data.map(b => ({ ...b, userName: user.displayName, userEmail: user.email }));
            const futureTrips = enrichedData.filter(trip => new Date(trip.date) >= new Date(new Date().setHours(0,0,0,0)));
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
    <Dialog onOpenChange={(open) => !open && setSelectedTrip(null)}>
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
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTrip(trip)}>
                        View
                      </Button>
                    </DialogTrigger>
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
    {selectedTrip && <TripDetailsDialog trip={selectedTrip} />}
    </Dialog>
  );
}

    