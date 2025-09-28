
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BedDouble, CalendarIcon, Loader2, MapPin, Minus, Plus, Search, Star, User, Heart, Wifi, Dumbbell, Utensils } from "lucide-react";
import { format, addDays, differenceInDays } from "date-fns";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

const allAmenities = ["Pool", "Gym", "WiFi", "Spa", "Fine Dining", "Restaurant", "Beach Access", "Casino"];

type Hotel = { 
  id: number; 
  name: string; 
  city: string; 
  rating: number; 
  price: number; 
  image: string; 
  amenities: string[]; 
  description: string; 
  liked: boolean 
};

export default function HotelBookingPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("Mumbai");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(new Date());
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(addDays(new Date(), 3));
  
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("popularity");

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [viewingHotel, setViewingHotel] = useState<Hotel | null>(null);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    setShowResults(false);
    setHotels([]);
    try {
        const params = new URLSearchParams({
            city: destination,
            price_min: String(priceRange[0]),
            price_max: String(priceRange[1]),
            ratings: selectedRatings.join(','),
            amenities: selectedAmenities.join(','),
            sortBy: sortBy
        });

        const response = await fetch(`/api/hotels?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch hotels");
        const data = await response.json();
        setHotels(data);

    } catch (error) {
        console.error("Failed to fetch hotels:", error);
        toast({
            variant: "destructive",
            title: "Search Failed",
            description: "Could not fetch hotel data. Please try again."
        });
    } finally {
        setLoading(false);
        setShowResults(true);
    }
  };

  useEffect(() => {
    if (showResults) {
        handleSearch();
    }
  }, [priceRange, selectedRatings, selectedAmenities, sortBy]);
  
  const toggleLike = (hotelId: number) => {
    setHotels(hotels.map(h => h.id === hotelId ? {...h, liked: !h.liked} : h));
  }

  const handleBookNowClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsBooking(true);
  }

  const handleViewDetailsClick = (hotel: Hotel) => {
      setViewingHotel(hotel);
  }

  const handleProceedToPayment = () => {
    if (!selectedHotel || !checkInDate) return;
    const nights = checkOutDate ? differenceInDays(checkOutDate, checkInDate) : 1;
    const bookingDetails = {
      type: 'Hotel',
      hotel: selectedHotel,
      date: format(checkInDate, 'yyyy-MM-dd'),
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate?.toISOString(),
      guests: Array(guests).fill({ name: `Guest`}), // Simplified for mockup
      rooms,
      fare: selectedHotel.price * nights + 59, // 59 is convenience fee
    };
    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    router.push('/payment');
  }

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating) 
        : [...prev, rating]
    );
  }
  
  const handleAmenityChange = (amenity: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  }

  const nights = (checkInDate && checkOutDate) ? differenceInDays(checkOutDate, checkInDate) : 0;

  return (
    <Dialog 
        onOpenChange={(open) => {
            if (!open) {
                setViewingHotel(null);
                setIsBooking(false);
            }
        }}
    >
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Hotel Booking</h1>

        <Card>
          <CardHeader>
            <CardTitle>Find your perfect stay</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-1">
              <Label htmlFor="destination">Destination</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="destination" placeholder="e.g., Mumbai" className="pl-10" value={destination} onChange={e => setDestination(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Check-in</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "LLL dd, y") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
             <div>
              <Label>Check-out</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "LLL dd, y") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => (checkInDate && date <= checkInDate) || date < new Date(new Date().setHours(0,0,0,0))}
                    initialFocus
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
                          <span className="w-4 text-center">{guests}</span>
                          <Button variant="outline" size="icon" onClick={() => setGuests(p => p+1)}><Plus className="h-4 w-4"/></Button>
                        </div>
                      </div>
                       <div className="flex items-center justify-between">
                        <Label>Rooms</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => setRooms(p => Math.max(1, p-1))}><Minus className="h-4 w-4"/></Button>
                          <span className="w-4 text-center">{rooms}</span>
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
            <p className="text-muted-foreground">Finding the best deals for your stay in {destination}.</p>
          </div>
        )}

        {showResults && !loading && (
          <div className="grid grid-cols-4 gap-8 items-start">
            <div className="col-span-1 space-y-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <Card>
                <CardHeader><CardTitle className="text-base">Price Range</CardTitle></CardHeader>
                <CardContent>
                  <Slider
                      defaultValue={[0, 50000]}
                      max={50000}
                      step={1000}
                      min={0}
                      onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>Rs. {priceRange[0]}</span>
                      <span>Rs. {priceRange[1]}</span>
                  </div>
                </CardContent>
              </Card>
               <Card>
                <CardHeader><CardTitle className="text-base">Rating</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {[5,4,3].map(r => (
                    <div key={r} className="flex items-center space-x-2">
                      <Checkbox id={`rating-${r}`} onCheckedChange={() => handleRatingChange(r)}/>
                      <Label htmlFor={`rating-${r}`} className="flex items-center gap-1 cursor-pointer">
                        {Array(r).fill(0).map((_,i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-500"/>)}
                      </Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
               <Card>
                <CardHeader><CardTitle className="text-base">Amenities</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {allAmenities.slice(0, 5).map(a => (
                    <div key={a} className="flex items-center space-x-2">
                      <Checkbox id={`amenity-${a}`} onCheckedChange={() => handleAmenityChange(a)}/>
                      <Label htmlFor={`amenity-${a}`} className="cursor-pointer">{a}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="col-span-3 space-y-6">
             <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{hotels.length} hotels found</h2>
              <div className="flex items-center gap-2">
                <Label>Sort by:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
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
             {hotels.length > 0 ? (
                <div className="grid gap-6">
                {hotels.map(hotel => (
                    <Card key={hotel.id} className="grid md:grid-cols-3 gap-0 overflow-hidden relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white z-10" onClick={() => toggleLike(hotel.id)}>
                        <Heart className={cn("h-5 w-5", hotel.liked && "fill-red-500 text-red-500")}/>
                    </Button>
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
                        <p className="text-sm text-muted-foreground">{hotel.description}</p>
                        <div className="flex gap-2 flex-wrap pt-2">
                            {hotel.amenities.slice(0, 3).map(amenity => (
                            <Badge key={amenity} variant="secondary">{amenity}</Badge>
                            ))}
                            {hotel.amenities.length > 3 && <Badge variant="outline">+{hotel.amenities.length - 3} more</Badge>}
                        </div>
                        </CardContent>
                        <CardFooter className="p-0 mt-4 flex justify-between items-end">
                        <div>
                            <p className="text-sm text-muted-foreground">Price per night</p>
                            <p className="text-2xl font-bold">Rs. {hotel.price.toLocaleString('en-IN')}</p>
                        </div>
                        <div className="flex gap-2">
                            <DialogTrigger asChild>
                            <Button variant="outline" onClick={() => handleViewDetailsClick(hotel)}>View Details</Button>
                            </DialogTrigger>
                            <DialogTrigger asChild>
                            <Button onClick={() => handleBookNowClick(hotel)}>Book Now</Button>
                            </DialogTrigger>
                        </div>
                        </CardFooter>
                    </div>
                    </Card>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center min-h-[300px]">
                    <h2 className="text-xl font-semibold">No hotels found</h2>
                    <p className="text-muted-foreground">Try adjusting your filters or searching for a different city.</p>
                </div>
            )}
          </div>
        </div>
        )}
      </div>

    {viewingHotel && (
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle className="text-2xl">{viewingHotel.name}</DialogTitle>
                <DialogDescription>{viewingHotel.city}</DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="relative h-64 rounded-lg overflow-hidden">
                <Image src={viewingHotel.image} alt={viewingHotel.name} fill objectFit="cover" />
                </div>
                <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-primary font-bold">
                    <Star className="h-5 w-5 fill-current" />
                    <span>{viewingHotel.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">(245 Reviews)</span>
                </div>
                <p className="text-muted-foreground">{viewingHotel.description}</p>
                <div>
                    <h4 className="font-semibold mb-2">Amenities</h4>
                    <div className="flex flex-wrap gap-4 text-sm">
                    {viewingHotel.amenities.map(a => (
                        <div key={a} className="flex items-center gap-2">
                        {a === "WiFi" && <Wifi className="h-4 w-4 text-primary"/>}
                        {a === "Gym" && <Dumbbell className="h-4 w-4 text-primary"/>}
                        {a.includes("Dining") && <Utensils className="h-4 w-4 text-primary"/>}
                        {a === "Restaurant" && <Utensils className="h-4 w-4 text-primary"/>}
                        {a === "Pool" && <BedDouble className="h-4 w-4 text-primary"/>}
                        {a === "Spa" && <Heart className="h-4 w-4 text-primary"/>}
                        {a === "Beach Access" && <BedDouble className="h-4 w-4 text-primary"/>}
                        <span>{a}</span>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="pt-4">
                    <p className="text-sm text-muted-foreground">Price per night</p>
                    <p className="text-3xl font-bold">Rs. {viewingHotel.price.toLocaleString('en-IN')}</p>
                </div>
                </div>
            </div>
             <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                </DialogClose>
                <DialogClose asChild>
                     <Button onClick={() => { setViewingHotel(null); handleBookNowClick(viewingHotel)}}>Book Now</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    )}

    {isBooking && selectedHotel && (
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>Confirm Your Booking</DialogTitle>
                <DialogDescription>
                    Review the details below before proceeding to payment.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
                <Card className="bg-muted/50">
                    <CardHeader className="p-4">
                        <CardTitle>{selectedHotel.name}</CardTitle>
                        <CardDescription>{selectedHotel.city}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                         <div className="flex justify-between text-sm"><span>Check-in:</span> <span>{checkInDate ? format(checkInDate, 'PPP') : 'N/A'}</span></div>
                         <div className="flex justify-between text-sm"><span>Check-out:</span> <span>{checkOutDate ? format(checkOutDate, 'PPP') : 'N/A'}</span></div>
                         <div className="flex justify-between text-sm"><span>Guests:</span> <span>{guests}</span></div>
                         <div className="flex justify-between text-sm"><span>Rooms:</span> <span>{rooms}</span></div>
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader><CardTitle className="text-base">Fare Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Room Charges ({nights} nights)</span>
                            <span>Rs. {(selectedHotel.price * nights).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between"><span>Convenience Fee</span><span>Rs. 59</span></div>
                        <Separator/>
                        <div className="flex justify-between font-bold text-base">
                            <span>Total</span>
                            <span>Rs. {(selectedHotel.price * nights + 59).toLocaleString('en-IN')}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsBooking(false)}>Cancel</Button>
                <Button onClick={handleProceedToPayment}>Proceed to Payment</Button>
            </DialogFooter>
        </DialogContent>
    )}
    </Dialog>
  );
}
