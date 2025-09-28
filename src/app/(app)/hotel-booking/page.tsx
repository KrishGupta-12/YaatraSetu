"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BedDouble, CalendarIcon, Loader2, MapPin, Minus, Plus, Search, Star, User } from "lucide-react";
import { format, addDays } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

const mockHotels = [
  { id: 1, name: "The Oberoi Grand", city: "Kolkata", rating: 5, price: 12000, image: "https://picsum.photos/seed/hotel1/400/300", amenities: ["Pool", "Gym", "WiFi"] },
  { id: 2, name: "Taj Falaknuma Palace", city: "Hyderabad", rating: 5, price: 35000, image: "https://picsum.photos/seed/hotel2/400/300", amenities: ["Spa", "Fine Dining", "WiFi"] },
  { id: 3, name: "Lemon Tree Premier", city: "Jaipur", rating: 4, price: 8000, image: "https://picsum.photos/seed/hotel3/400/300", amenities: ["Pool", "Restaurant"] },
  { id: 4, name: "Radisson Blu", city: "Goa", rating: 4, price: 9500, image: "https://picsum.photos/seed/hotel4/400/300", amenities: ["Beach Access", "Pool", "WiFi"] },
  { id: 5, name: "Ginger Hotel", city: "Mumbai", rating: 3, price: 5500, image: "https://picsum.photos/seed/hotel5/400/300", amenities: ["WiFi", "Restaurant"] },
];

export default function HotelBookingPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setShowResults(false);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Hotel Booking</h1>

      <Card>
        <CardHeader>
          <CardTitle>Find your perfect stay</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Label htmlFor="destination">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="destination" placeholder="e.g., New Delhi" className="pl-10" />
            </div>
          </div>
          <div>
            <Label>Check-in / Check-out</Label>
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
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>Guests & Rooms</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <User className="mr-2 h-4 w-4"/>
                  {guests} Guests, {rooms} Room(s)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Guests</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setGuests(p => Math.max(1, p-1))}><Minus className="h-4 w-4"/></Button>
                        <span>{guests}</span>
                        <Button variant="outline" size="icon" onClick={() => setGuests(p => p+1)}><Plus className="h-4 w-4"/></Button>
                      </div>
                    </div>
                     <div className="flex items-center justify-between">
                      <Label>Rooms</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setRooms(p => Math.max(1, p-1))}><Minus className="h-4 w-4"/></Button>
                        <span>{rooms}</span>
                        <Button variant="outline" size="icon" onClick={() => setRooms(p => p+1)}><Plus className="h-4 w-4"/></Button>
                      </div>
                    </div>
                  </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4" />}
              Search Hotels
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center min-h-[300px]">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <h2 className="text-xl font-semibold">Searching for hotels...</h2>
          <p className="text-muted-foreground">Finding the best deals for your stay.</p>
        </div>
      )}

      {showResults && !loading && (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">5 hotels found in New Delhi</h2>
            <div className="flex items-center gap-2">
              <Label>Sort by:</Label>
              <Select defaultValue="popularity">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
           </div>
          <div className="grid gap-6">
            {mockHotels.map(hotel => (
              <Card key={hotel.id} className="grid md:grid-cols-3 gap-4 overflow-hidden">
                <div className="md:col-span-1">
                  <Image data-ai-hint="hotel room" src={hotel.image} alt={hotel.name} width={400} height={300} className="h-full w-full object-cover" />
                </div>
                <div className="md:col-span-2 flex flex-col p-4">
                  <CardHeader className="p-0">
                    <div className="flex justify-between items-start">
                      <CardTitle>{hotel.name}</CardTitle>
                      <div className="flex items-center gap-1 text-primary font-bold">
                        <Star className="h-5 w-5 fill-current" />
                        <span>{hotel.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <CardDescription>{hotel.city}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-4 flex-grow space-y-2">
                    <div className="flex gap-2">
                      {hotel.amenities.map(amenity => (
                        <Badge key={amenity} variant="secondary">{amenity}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-muted-foreground">Price per night</p>
                      <p className="text-2xl font-bold">₹{hotel.price.toLocaleString()}</p>
                    </div>
                    <Button>Book Now</Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
