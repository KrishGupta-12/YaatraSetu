"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookingPot, Download, Hotel, Train } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockHistory = {
  trains: [
    { id: "PNR847563", details: "Mumbai to Delhi", journey: "12951 Rajdhani Exp", date: "2024-08-15", status: "Confirmed", amount: 2500 },
    { id: "PNR293847", details: "Delhi to Agra", journey: "12002 Shatabdi Exp", date: "2024-08-18", status: "Cancelled", amount: 800 },
    { id: "PNR564321", details: "Chennai to Bengaluru", journey: "20607 Vande Bharat", date: "2024-07-20", status: "Completed", amount: 1250 },
  ],
  hotels: [
    { id: "HTL937465", name: "Taj Palace, New Delhi", date: "16 Aug - 18 Aug 2024", status: "Booked", amount: 15000 },
    { id: "HTL123876", name: "The Oberoi, Agra", date: "18 Aug - 19 Aug 2024", status: "Cancelled", amount: 9500 },
    { id: "HTL453345", name: "Leela Palace, Chennai", date: "19 Jul - 20 Jul 2024", status: "Completed", amount: 11000 },
  ],
  food: [
    { id: "FOOD54321", pnr: "PNR847563", station: "Ratlam (RTM)", items: "2x Veg Thali", date: "2024-08-15", status: "Delivered", amount: 280 },
    { id: "FOOD98765", pnr: "PNR564321", station: "Katpadi (KPD)", items: "1x Chicken Biryani, 1x Water Bottle", date: "2024-07-20", status: "Delivered", amount: 200 },
  ]
};

const allBookings = [
  ...mockHistory.trains.map(t => ({...t, type: "Train"})),
  ...mockHistory.hotels.map(h => ({...h, type: "Hotel"})),
  ...mockHistory.food.map(f => ({...f, type: "Food"})),
].sort((a,b) => new Date(b.date.split(" - ")[0]).getTime() - new Date(a.date.split(" - ")[0]).getTime());


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

const HistoryCard = ({ booking }: { booking: any }) => (
  <Card>
    <CardHeader className="flex flex-row items-start justify-between">
      <div>
        <CardTitle className="flex items-center gap-2">
          {booking.type === "Train" && <Train className="h-5 w-5 text-primary" />}
          {booking.type === "Hotel" && <Hotel className="h-5 w-5 text-primary" />}
          {booking.type === "Food" && <CookingPot className="h-5 w-5 text-primary" />}
          {booking.details || booking.name}
        </CardTitle>
        <CardDescription>{booking.id} {booking.pnr && `| PNR: ${booking.pnr}`}</CardDescription>
      </div>
      <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Date</span>
        <span>{booking.date}</span>
      </div>
      {booking.journey && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Train</span>
          <span>{booking.journey}</span>
        </div>
      )}
       {booking.items && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items</span>
          <span>{booking.items}</span>
        </div>
      )}
      <div className="flex justify-between text-sm font-medium">
        <span className="text-muted-foreground">Amount</span>
        <span>₹{booking.amount.toLocaleString()}</span>
      </div>
    </CardContent>
    {booking.status !== "Cancelled" && (
      <CardContent>
        <Button variant="outline" className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Download Invoice
        </Button>
      </CardContent>
    )}
  </Card>
);

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Booking History</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trains">Trains</TabsTrigger>

          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-4">
            {allBookings.map(booking => <HistoryCard key={booking.id} booking={booking} />)}
          </div>
        </TabsContent>
        <TabsContent value="trains">
          <div className="space-y-4">
            {mockHistory.trains.map(booking => <HistoryCard key={booking.id} booking={{...booking, type: "Train"}} />)}
          </div>
        </TabsContent>
        <TabsContent value="hotels">
          <div className="space-y-4">
            {mockHistory.hotels.map(booking => <HistoryCard key={booking.id} booking={{...booking, type: "Hotel"}} />)}
          </div>
        </TabsContent>
        <TabsContent value="food">
          <div className="space-y-4">
            {mockHistory.food.map(booking => <HistoryCard key={booking.id} booking={{...booking, type: "Food"}} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
