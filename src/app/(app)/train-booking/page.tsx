import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrainBookingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Train Booking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search Trains</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Train search and booking form will be here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
