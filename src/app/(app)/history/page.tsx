
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getBookings } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookingPot, Download, Hotel, Train, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
    case "booked":
    case "delivered":
    case "completed":
      return "default";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

const HistoryCard = ({ booking }: { booking: any }) => {
  const getDetails = () => {
    switch (booking.type) {
      case "Train":
        return {
          title: `${booking.train.from} to ${booking.train.to}`,
          description: `${booking.id} | ${booking.train.name} (${booking.train.id})`,
          icon: <Train className="h-5 w-5 text-primary" />,
          extra: [
            { label: "Class", value: booking.selectedClass.name },
            { label: "Passengers", value: booking.passengers.length },
          ]
        };
      case "Hotel":
         return {
          title: booking.hotel.name,
          description: booking.id,
          icon: <Hotel className="h-5 w-5 text-primary" />,
          extra: []
        };
      case "Food":
         return {
          title: `Order at ${booking.station}`,
          description: booking.id,
          icon: <CookingPot className="h-5 w-5 text-primary" />,
          extra: [{label: "Items", value: booking.items}]
        };
      default:
         return { title: "Unknown Booking", description: booking.id, icon: null, extra: [] };
    }
  };

  const { title, description, icon, extra } = getDetails();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date</span>
          <span>{format(new Date(booking.date), "PPP")}</span>
        </div>
        {extra.map(item => (
            <div key={item.label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span>{item.value}</span>
            </div>
        ))}
        <div className="flex justify-between text-sm font-medium">
          <span className="text-muted-foreground">Amount</span>
          <span>Rs. {booking.fare.toLocaleString()}</span>
        </div>
      </CardContent>
      {booking.status !== "Cancelled" && (
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default function HistoryPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      const unsubscribe = getBookings(user.uid, (data) => {
        setBookings(data);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
        setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary"/>
        </div>
    )
  }
  
  if (bookings.length === 0) {
      return (
           <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Booking History</h1>
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center min-h-[40vh]">
                <h2 className="text-xl font-semibold">No Bookings Found</h2>
                <p className="text-muted-foreground">You haven't made any bookings yet.</p>
                <Button asChild className="mt-4"><Link href="/train-booking">Book a Ticket</Link></Button>
            </div>
        </div>
      )
  }

  const filteredBookings = (type: string) => bookings.filter(b => b.type === type);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Booking History</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
          <TabsTrigger value="trains">Trains ({filteredBookings("Train").length})</TabsTrigger>
          <TabsTrigger value="hotels">Hotels ({filteredBookings("Hotel").length})</TabsTrigger>
          <TabsTrigger value="food">Food ({filteredBookings("Food").length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-4 pt-4">
            {bookings.map(booking => <HistoryCard key={booking.id} booking={booking} />)}
          </div>
        </TabsContent>
        <TabsContent value="trains">
          <div className="space-y-4 pt-4">
            {filteredBookings("Train").map(booking => <HistoryCard key={booking.id} booking={booking} />)}
          </div>
        </TabsContent>
        <TabsContent value="hotels">
          <div className="space-y-4 pt-4">
            {filteredBookings("Hotel").map(booking => <HistoryCard key={booking.id} booking={booking} />)}
          </div>
        </TabsContent>
        <TabsContent value="food">
          <div className="space-y-4 pt-4">
            {filteredBookings("Food").map(booking => <HistoryCard key={booking.id} booking={booking} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
