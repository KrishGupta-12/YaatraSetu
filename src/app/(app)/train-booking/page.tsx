
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CalendarIcon, Loader2, Search, ArrowRightLeft, Users, Info, Clock, Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/hooks/use-auth";
import { getSavedPassengers } from "@/lib/firebase/firestore";
import type { User } from 'firebase/auth';
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import allTrainsData from "@/lib/mock-data/trains.json";

type Passenger = {
  id: string | number;
  name: string;
  age: number;
  gender: string;
}

export default function TrainBookingPage() {
    const [searchQuery, setSearchQuery] = useState({ from: "BCT", to: "NDLS" });
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [loading, setLoading] = useState(false);
    const [trains, setTrains] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    
    const [selectedTrain, setSelectedTrain] = useState<any>(null);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [viewingTrain, setViewingTrain] = useState<any>(null);
    
    const { user } = useAuth();
    const router = useRouter();
    const [savedPassengers, setSavedPassengers] = useState<Passenger[]>([]);
    const [bookingPassengers, setBookingPassengers] = useState<Passenger[]>([]);

    const allStationCodes = useMemo(() => {
        const allStations = allTrainsData.flatMap(train => [train.from, train.to]);
        return [...new Set(allStations)].sort();
    }, []);

    useEffect(() => {
        if (user) {
            const unsubscribe = getSavedPassengers(user.uid, (data) => {
                setSavedPassengers(data);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleSearch = async () => {
        setLoading(true);
        setTrains([]);
        setShowResults(false);
        try {
            const params = new URLSearchParams({
                from: searchQuery.from,
                to: searchQuery.to,
                date: date ? format(date, "yyyy-MM-dd") : ""
            });

            const response = await fetch(`/api/trains?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch trains');
            }
            const data = await response.json();
            setTrains(data);

        } catch (error) {
            console.error("Failed to search trains:", error);
            toast({
                variant: "destructive",
                title: "Search Failed",
                description: "Could not fetch train data. Please try again."
            })
        } finally {
            setLoading(false);
            setShowResults(true);
        }
    }
    
    const handleSwapStations = () => {
        setSearchQuery({ from: searchQuery.to, to: searchQuery.from });
    }

    const handleBookNow = (train: any, trainClass: any) => {
      setSelectedTrain(train);
      setSelectedClass(trainClass);
      setViewingTrain(null);
      setBookingPassengers([]);
    }
    
    const handleViewDetails = (train: any) => {
        setViewingTrain(train);
        setSelectedTrain(null);
    }

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setSelectedTrain(null);
            setViewingTrain(null);
        }
    }
    
    const addPassengerToBooking = (passenger: Passenger) => {
        if (!bookingPassengers.find(p => p.id === passenger.id)) {
            setBookingPassengers([...bookingPassengers, passenger]);
        }
    }

    const removePassengerFromBooking = (passengerId: string | number) => {
        setBookingPassengers(bookingPassengers.filter(p => p.id !== passengerId));
    }
    
    const getTotalFare = () => {
        if (!selectedClass) return 0;
        const ticketFare = selectedClass.price * bookingPassengers.length;
        if (ticketFare === 0) return 0;
        const convenienceFee = 59;
        return ticketFare + convenienceFee;
    }

    const handleProceedToPayment = () => {
        const bookingDetails = {
            type: "Train",
            train: selectedTrain,
            selectedClass,
            passengers: bookingPassengers,
            fare: getTotalFare(),
            date: date ? format(date, "yyyy-MM-dd") : ""
        };
        sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        router.push('/payment');
    }

  return (
    <Dialog onOpenChange={handleDialogClose}>
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Train Ticket Booking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Search for Trains</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div className="lg:col-span-2 grid grid-cols-[1fr_auto_1fr] gap-2 items-end">
                <div>
                    <Label htmlFor="from">From</Label>
                    <Select value={searchQuery.from} onValueChange={(value) => setSearchQuery({...searchQuery, from: value})}>
                        <SelectTrigger><SelectValue placeholder="From station..."/></SelectTrigger>
                        <SelectContent>
                            {allStationCodes.map(station => (
                                <SelectItem key={station} value={station}>{station}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                 <Button variant="ghost" size="icon" className="bg-background rounded-full border" onClick={handleSwapStations}>
                    <ArrowRightLeft className="h-4 w-4"/>
                </Button>

                <div>
                    <Label htmlFor="to">To</Label>
                     <Select value={searchQuery.to} onValueChange={(value) => setSearchQuery({...searchQuery, to: value})}>
                        <SelectTrigger><SelectValue placeholder="To station..."/></SelectTrigger>
                        <SelectContent>
                            {allStationCodes.map(station => (
                                <SelectItem key={station} value={station}>{station}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
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
                        disabled={(date) => new Date(date) < new Date(new Date().setHours(0,0,0,0))}
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
              {trains.length > 0 ? (
                <>
                <h2 className="text-2xl font-bold">{trains.length} trains found from {searchQuery.from.toUpperCase()} to {searchQuery.to.toUpperCase()}</h2>
                {trains.map(train => (
                  <Card key={train.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{train.name} ({train.id})</CardTitle>
                             <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4"/>{train.duration}</span>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(train)}><Info className="h-4 w-4 mr-2"/> View Details</Button>
                                </DialogTrigger>
                             </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div><span className="font-semibold">{train.departure}</span> ({train.from})</div>
                            <Separator className="flex-1"/>
                             <div><span className="font-semibold">{train.arrival}</span> ({train.to})</div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {train.classes.map((cls:any) => {
                          const isAvailable = cls.availability.toLowerCase().includes('available');
                          const isWaitlist = cls.availability.toLowerCase().includes('waitlist');
                          return (
                             <Card key={cls.name} className="p-4 bg-muted/50 flex flex-col justify-between">
                                <p className="font-semibold">{cls.name}</p>
                                <p className={cn("font-medium", isAvailable ? 'text-green-600' : isWaitlist ? 'text-amber-600' : 'text-red-600')}>{cls.availability}</p>
                                <p className="text-lg font-bold">Rs. {cls.price.toLocaleString('en-IN')}</p>
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
                </>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center min-h-[300px]">
                    <h2 className="text-xl font-semibold">No trains found</h2>
                    <p className="text-muted-foreground">We couldn't find any direct trains for the selected route and date. Please try a different search.</p>
                </div>
              )}
          </div>
      )}

      <DialogContent className="max-w-4xl">
        {selectedTrain ? (
          <>
            <DialogHeader>
              <DialogTitle>Passenger Details for {selectedTrain?.name} ({selectedTrain?.id})</DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                  <span>{selectedTrain?.departure} ({selectedTrain?.from})</span>
                  <Separator className="w-12"/>
                  <span>{selectedTrain?.arrival} ({selectedTrain?.to})</span>
                  <Separator orientation="vertical" className="h-4"/>
                  <span>Class: <span className="font-bold text-primary">{selectedClass?.name}</span></span>
                  <Separator orientation="vertical" className="h-4"/>
                  <span>Price: <span className="font-bold text-primary">Rs. {selectedClass?.price.toLocaleString('en-IN')}</span></span>
                </div>
            </DialogHeader>
            <div className="grid md:grid-cols-3 gap-8 pt-4 max-h-[70vh] overflow-y-auto">
                <div className="md:col-span-2 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Passengers for this Booking</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bookingPassengers.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center">No passengers added yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {bookingPassengers.map(p => (
                                        <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-muted">
                                            <div>
                                                <p className="font-medium">{p.name}</p>
                                                <p className="text-sm text-muted-foreground">{p.age}, {p.gender}</p>
                                            </div>
                                            <Button size="icon" variant="ghost" onClick={() => removePassengerFromBooking(p.id)}><Trash className="h-4 w-4 text-destructive"/></Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div><Label>Email</Label><Input type="email" placeholder="Email address" defaultValue={user?.email || ""}/></div>
                            <div><Label>Phone</Label><Input type="tel" placeholder="Phone number"/></div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1 space-y-4">
                    <Card>
                        <CardHeader><CardTitle className="text-base">Add from Saved Passengers</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {savedPassengers.length > 0 ? savedPassengers.map(p => (
                                <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                                    <div>
                                        <p className="font-medium">{p.name}</p>
                                        <p className="text-sm text-muted-foreground">{p.age}, {p.gender}</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => addPassengerToBooking(p)} disabled={bookingPassengers.some(bp => bp.id === p.id)}>
                                        <Plus className="h-4 w-4 mr-1"/> Add
                                    </Button>
                                </div>
                            )) : <p className="text-xs text-muted-foreground text-center">No saved passengers.</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Fare Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-2 text-sm">
                             <div className="flex justify-between"><span>Ticket Fare ({bookingPassengers.length} x Rs. {selectedClass?.price.toLocaleString('en-IN')})</span><span>Rs. {(selectedClass.price * bookingPassengers.length).toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span>Convenience Fee</span><span>Rs. 59</span></div>
                            <Separator/>
                            <div className="flex justify-between font-bold text-base"><span>Total</span><span>Rs. {getTotalFare().toLocaleString('en-IN')}</span></div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" disabled={bookingPassengers.length === 0} onClick={handleProceedToPayment}>Proceed to Payment</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
          </>
        ) : viewingTrain ? (
            <DialogHeader>
                <DialogTitle>Train Details: {viewingTrain.name} ({viewingTrain.id})</DialogTitle>
                <DialogDescription>
                    Route from {viewingTrain.from} to {viewingTrain.to}
                </DialogDescription>
                {viewingTrain.route && viewingTrain.route.length > 0 ? (
                <Card className="mt-4">
                    <CardContent className="p-0 max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Station</TableHead>
                                <TableHead>Arrival</TableHead>
                                <TableHead>Departure</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {viewingTrain.route.map((stop: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{stop.station}</TableCell>
                                    <TableCell>{stop.arrival}</TableCell>
                                    <TableCell>{stop.departure}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </CardContent>
                </Card>
                ) : (
                    <p className="mt-4 text-muted-foreground">Route information is not available for this train.</p>
                )}
            </DialogHeader>
        ) : (
            <DialogHeader>
                <DialogTitle>PNR Status Check</DialogTitle>
                <DialogDescription>Enter your 10-digit PNR number to check the status.</DialogDescription>
                <div className="flex items-center space-x-2 pt-4">
                    <Input placeholder="Enter PNR" />
                    <Button>Check Status</Button>
                </div>
            </DialogHeader>
        )}
      </DialogContent>
    </div>
    </Dialog>
  );
}

    