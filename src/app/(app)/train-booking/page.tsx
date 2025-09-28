"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent,SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Search, ArrowRightLeft, Users, Train, Star } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const mockTrains = [
    { id: "12951", name: "Mumbai Rajdhani", from: "BCT", to: "NDLS", departure: "17:00", arrival: "08:32", duration: "15h 32m", classes: [
        { name: "1A", availability: "Available 12", price: 4755 },
        { name: "2A", availability: "Available 45", price: 2825 },
        { name: "3A", availability: "Waitlist 23", price: 2050 },
    ]},
    { id: "12909", name: "NZM Garib Rath", from: "BDTS", to: "NZM", departure: "17:35", arrival: "10:40", duration: "17h 05m", classes: [
        { name: "3A", availability: "Available 102", price: 1050 }
    ]},
    { id: "22209", name: "Mumbai Duronto", from: "BCT", to: "NDLS", departure: "23:10", arrival: "15:55", duration: "16h 45m", classes: [
        { name: "1A", availability: "Available 5", price: 5200 },
        { name: "2A", availability: "Waitlist 5", price: 3150 },
        { name: "3A", availability: "Waitlist 35", price: 2250 },
    ]},
    { id: "12263", name: "Pune Duronto", from: "PUNE", to: "NZM", departure: "11:10", arrival: "06:45", duration: "19h 35m", classes: [
        { name: "1A", availability: "Regret", price: 5010 },
        { name: "2A", availability: "Available 21", price: 2980 },
        { name: "3A", availability: "Available 50", price: 2100 },
    ]}
]

const savedPassengers = [
  { id: 1, name: "Ravi Kumar", age: 34, gender: "Male" },
  { id: 2, name: "Priya Sharma", age: 29, gender: "Female" },
]

export default function TrainBookingPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedTrain, setSelectedTrain] = useState<any>(null);
    const [selectedClass, setSelectedClass] = useState<any>(null);

    const handleSearch = () => {
        setLoading(true);
        setShowResults(false);
        setTimeout(() => {
            setLoading(false);
            setShowResults(true);
        }, 1500)
    }

    const handleBookNow = (train: any, trainClass: any) => {
      setSelectedTrain(train);
      setSelectedClass(trainClass);
    }

  return (
    <Dialog>
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Train Ticket Booking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search for Trains</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
                <Label htmlFor="from">From</Label>
                <Input id="from" placeholder="e.g., Mumbai (BCT)" defaultValue="Mumbai (BCT)"/>
            </div>
            <div className="relative">
                 <Button variant="ghost" size="icon" className="absolute left-1/2 -translate-x-1/2 top-4 sm:top-1/2 sm:-translate-y-1/2 bg-background rounded-full border">
                    <ArrowRightLeft className="h-4 w-4"/>
                </Button>
                <Label htmlFor="to">To</Label>
                <Input id="to" placeholder="e.g., New Delhi (NDLS)" defaultValue="New Delhi (NDLS)"/>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Class</Label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="1A">Anubhuti Class (EA)</SelectItem>
                    <SelectItem value="2A">AC 2 Tier (2A)</SelectItem>
                    <SelectItem value="3A">AC 3 Tier (3A)</SelectItem>
                    <SelectItem value="SL">Sleeper (SL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quota</Label>
                 <Select defaultValue="GN">
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GN">General</SelectItem>
                    <SelectItem value="TQ">Tatkal</SelectItem>
                    <SelectItem value="PT">Premium Tatkal</SelectItem>
                    <SelectItem value="LD">Ladies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <Button className="w-full" onClick={handleSearch} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                Search Trains
             </Button>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm">
                <p className="font-medium">Quick Actions:</p>
                <Button variant="ghost" size="sm">PNR Status</Button>
                <Button variant="ghost" size="sm">Live Train Status</Button>
                <Button variant="ghost" size="sm">Tatkal Automation</Button>
            </div>
        </CardFooter>
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
                            <div><span className="font-semibold">{train.departure}</span> ({train.from})</div>
                            <Separator className="flex-1"/>
                             <div><span className="font-semibold">{train.arrival}</span> ({train.to})</div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {train.classes.map(cls => {
                          const isAvailable = cls.availability.toLowerCase().includes('available');
                          const isWaitlist = cls.availability.toLowerCase().includes('waitlist');
                          return (
                             <Card key={cls.name} className="p-4 bg-muted/50 flex flex-col justify-between">
                                <p className="font-semibold">{cls.name}</p>
                                <p className={cn("font-medium", isAvailable ? 'text-green-600' : isWaitlist ? 'text-amber-600' : 'text-red-600')}>{cls.availability}</p>
                                <p className="text-lg font-bold">₹{cls.price.toLocaleString('en-IN')}</p>
                                <DialogTrigger asChild>
                                <Button size="sm" className="w-full mt-2" disabled={!isAvailable && !isWaitlist} onClick={() => handleBookNow(train, cls)}>
                                    Book Now
                                </Button>
                                </DialogTrigger>
                            </Card>
                        )})}
                    </CardContent>
                  </Card>
              ))}
          </div>
      )}

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Passenger Details for {selectedTrain?.name} ({selectedTrain?.id})</DialogTitle>
           <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{selectedTrain?.departure} ({selectedTrain?.from})</span>
              <Separator className="w-12"/>
              <span>{selectedTrain?.arrival} ({selectedTrain?.to})</span>
              <Separator orientation="vertical" className="h-4"/>
              <span>Class: <span className="font-bold text-primary">{selectedClass?.name}</span></span>
              <Separator orientation="vertical" className="h-4"/>
              <span>Price: <span className="font-bold text-primary">₹{selectedClass?.price.toLocaleString('en-IN')}</span></span>
            </div>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
                <Card>
                    <CardHeader><CardTitle>Add Passenger</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-6 gap-4">
                            <div className="col-span-3"><Label>Full Name</Label><Input placeholder="e.g. Rahul Verma"/></div>
                            <div className="col-span-1"><Label>Age</Label><Input type="number" placeholder="e.g. 32"/></div>
                            <div className="col-span-2"><Label>Gender</Label><Select><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div><Label>Meal Preference</Label><Select><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="veg">Veg</SelectItem><SelectItem value="non-veg">Non-Veg</SelectItem></SelectContent></Select></div>
                             <div><Label>Berth Preference</Label><Select><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent><SelectItem value="none">No Preference</SelectItem><SelectItem value="lower">Lower</SelectItem><SelectItem value="middle">Middle</SelectItem><SelectItem value="upper">Upper</SelectItem><SelectItem value="side-lower">Side Lower</SelectItem><SelectItem value="side-upper">Side Upper</SelectItem></SelectContent></Select></div>
                        </div>
                        <div><Label>ID Proof</Label><Select><SelectTrigger><SelectValue placeholder="Select ID type..."/></SelectTrigger><SelectContent><SelectItem value="aadhar">Aadhar Card</SelectItem><SelectItem value="dl">Driving License</SelectItem><SelectItem value="passport">Passport</SelectItem></SelectContent></Select></div>
                        <div><Input placeholder="Enter ID number"/></div>
                         <div className="flex items-center space-x-2 pt-2">
                            <Checkbox id="save-passenger"/>
                            <label htmlFor="save-passenger" className="text-sm font-medium">Save this passenger for future bookings</label>
                        </div>
                        <Button>Add Passenger</Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                        <div><Label>Email</Label><Input type="email" placeholder="Email address" defaultValue="traveller@example.com"/></div>
                         <div><Label>Phone</Label><Input type="tel" placeholder="Phone number" defaultValue="9876543210"/></div>
                    </CardContent>
                 </Card>
            </div>
            <div className="col-span-1 space-y-4">
                <Card>
                    <CardHeader><CardTitle>Saved Passengers</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                        {savedPassengers.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                <div>
                                    <p className="font-medium">{p.name}</p>
                                    <p className="text-sm text-muted-foreground">{p.age}, {p.gender}</p>
                                </div>
                                <Button size="sm" variant="outline">Add</Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Fare Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between"><span>Ticket Fare</span><span>₹{selectedClass?.price.toLocaleString('en-IN')}</span></div>
                        <div className="flex justify-between"><span>Convenience Fee</span><span>₹59</span></div>
                        <Separator/>
                        <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{(selectedClass?.price + 59).toLocaleString('en-IN')}</span></div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Proceed to Payment</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>

      </DialogContent>

    </div>
    </Dialog>
  );
}
