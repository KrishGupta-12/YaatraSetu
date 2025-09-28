"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent,SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Search, ArrowRightLeft, Users, Train } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const mockTrains = [
    { id: "12951", name: "Mumbai Rajdhani", from: "BCT", to: "NDLS", departure: "17:00", arrival: "08:32", duration: "15h 32m", classes: ["1A", "2A", "3A"] },
    { id: "12909", name: "NZM Garib Rath", from: "BDTS", to: "NZM", departure: "17:35", arrival: "10:40", duration: "17h 05m", classes: ["3A"] },
    { id: "22209", name: "Mumbai Duronto", from: "BCT", to: "NDLS", departure: "23:10", arrival: "15:55", duration: "16h 45m", classes: ["1A", "2A", "3A"] },
    { id: "12263", name: "Pune Duronto", from: "PUNE", to: "NZM", departure: "11:10", arrival: "06:45", duration: "19h 35m", classes: ["1A", "2A", "3A"] }
]

export default function TrainBookingPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = () => {
        setLoading(true);
        setShowResults(false);
        setTimeout(() => {
            setLoading(false);
            setShowResults(true);
        }, 1500)
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Train Booking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search for Trains</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
                <Label htmlFor="from">From</Label>
                <Input id="from" placeholder="e.g., Mumbai (BCT)"/>
            </div>
            <div className="relative">
                 <Button variant="ghost" size="icon" className="absolute left-1/2 -translate-x-1/2 top-4 sm:top-1/2 sm:-translate-y-1/2 bg-background rounded-full border">
                    <ArrowRightLeft className="h-4 w-4"/>
                </Button>
                <Label htmlFor="to">To</Label>
                <Input id="to" placeholder="e.g., New Delhi (NDLS)"/>
            </div>
            <div>
                <Label>Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
             <Button className="w-full" onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                Search Trains
             </Button>
        </CardContent>
      </Card>

      {loading && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Finding available trains...</h2>
            <p className="text-muted-foreground">This will just take a moment.</p>
          </div>
      )}

      {showResults && !loading && (
          <div className="space-y-6">
              <h2 className="text-2xl font-bold">4 trains found from Mumbai to New Delhi</h2>
              {mockTrains.map(train => (
                  <Card key={train.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{train.name} ({train.id})</CardTitle>
                            <span className="text-sm text-muted-foreground">{train.duration}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{train.departure} ({train.from})</span>
                            <Separator className="w-12"/>
                             <span>{train.arrival} ({train.to})</span>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {train.classes.map(cls => (
                             <Card key={cls} className="p-4 bg-muted/50">
                                <p className="font-semibold">{cls}</p>
                                <p className="text-green-600 font-medium">Available 123</p>
                                <p className="text-sm text-muted-foreground">₹2,500</p>
                            </Card>
                        ))}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="ghost">Check PNR Status</Button>
                        <Button>Book Now</Button>
                    </CardFooter>
                  </Card>
              ))}
          </div>
      )}

    </div>
  );
}
