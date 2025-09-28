import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HotelBookingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Hotel Booking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Hotels</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Hotel search and booking form will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
