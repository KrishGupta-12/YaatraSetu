
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { getBookings } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CookingPot, Download, Hotel, Train, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { YaatraSetuLogo } from "@/components/icons";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
                    <YaatraSetuLogo className="h-8 w-8 text-primary"/>
                    <h1 className="text-2xl font-bold">YaatraSetu</h1>
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
                <p>Thank you for booking with YaatraSetu!</p>
                <p>This is a computer-generated invoice and does not require a signature.</p>
            </div>
        </div>
    )
}


const HistoryCard = ({ booking }: { booking: any }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

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
          extra: [
            { label: "Guests", value: booking.guests.length },
            { label: "Rooms", value: booking.rooms },
          ]
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

      pdf.save(`YaatraSetu-Invoice-${booking.id.slice(0, 8)}.pdf`);
    });
  };

  const { title, description, icon, extra } = getDetails();

  return (
    <>
      <div style={{ position: 'fixed', left: '-2000px', top: 0 }}>
          <Invoice booking={booking} innerRef={invoiceRef} />
      </div>
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
            <Button variant="outline" className="w-full" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
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
        const bookingsWithUserData = data.map(b => ({ ...b, userName: user.displayName, userEmail: user.email }));
        setBookings(bookingsWithUserData);
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
  
  if (bookings.length === 0 && !loading) {
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
