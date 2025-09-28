import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Booking History</h1>
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="trains">Trains</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="food">Food</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">A unified list of all your bookings will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trains">
          <Card>
            <CardHeader>
              <CardTitle>Train Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your train booking history will be here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
