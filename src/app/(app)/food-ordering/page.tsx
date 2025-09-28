
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CookingPot, Loader2, Minus, Plus, Search, ShoppingCart, Star, Utensils, Wheat, Leaf, Drumstick } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  { id: 1, name: "Veg Thali", price: 120, image: "https://picsum.photos/seed/food1/200/200", description: "Rice, Roti, Dal, Sabzi, Salad", dietary: 'veg', ingredients: ["Basmati Rice", "Whole Wheat Flour", "Lentils", "Mixed Vegetables", "Spices"], calories: 550, vendor: { name: "Railicious Restaurant", rating: 4.2 } },
  { id: 2, name: "Chicken Biryani", price: 180, image: "https://picsum.photos/seed/food2/200/200", description: "Aromatic rice with chicken", dietary: 'non-veg', ingredients: ["Basmati Rice", "Chicken", "Yogurt", "Onion", "Spices"], calories: 750, vendor: { name: "Railicious Restaurant", rating: 4.2 } },
  { id: 3, name: "Paneer Butter Masala", price: 150, image: "https://picsum.photos/seed/food3/200/200", description: "Creamy paneer curry", dietary: 'veg', ingredients: ["Paneer", "Tomato", "Cream", "Butter", "Spices"], calories: 650, vendor: { name: "Railicious Restaurant", rating: 4.2 } },
  { id: 4, name: "Masala Dosa", price: 90, image: "https://picsum.photos/seed/food4/200/200", description: "Crispy dosa with potato filling", dietary: 'veg', ingredients: ["Rice Flour", "Lentils", "Potato", "Onion", "Spices"], calories: 400, vendor: { name: "Railicious Restaurant", rating: 4.2 } },
  { id: 5, name: "Egg Curry", price: 110, image: "https://picsum.photos/seed/food5/200/200", description: "Spicy egg curry", dietary: 'non-veg', ingredients: ["Eggs", "Onion", "Tomato", "Ginger-Garlic Paste", "Spices"], calories: 500, vendor: { name: "Railicious Restaurant", rating: 4.2 } },
  { id: 6, name: "Jain Thali", price: 130, image: "https://picsum.photos/seed/food6/200/200", description: "Special thali with no onion/garlic", dietary: 'jain', ingredients: ["Rice", "Roti", "Dal (no onion/garlic)", "Banana-based sabzi"], calories: 500, vendor: { name: "Railicious Restaurant", rating: 4.2 } },
];

const deliveryStations = [ "Ratlam (RTM)", "Vadodara (BRC)", "Surat (ST)" ];

const orderStatusSteps = ["Order Placed", "Preparing", "Out for Delivery", "Delivered"];

const dietIcons = {
    veg: <Leaf className="h-4 w-4 text-green-600"/>,
    'non-veg': <Drumstick className="h-4 w-4 text-red-600"/>,
    jain: <Leaf className="h-4 w-4 text-green-800"/>,
    'gluten-free': <Wheat className="h-4 w-4 text-amber-600"/>
} as const;

const dietLabels = {
    veg: 'Veg',
    'non-veg': 'Non-Veg',
    jain: 'Jain',
    'gluten-free': 'Gluten-Free',
};


export default function FoodOrderingPage() {
  const [pnr, setPnr] = useState("");
  const [loading, setLoading] = useState(false);
  const [restaurantsFound, setRestaurantsFound] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [dietFilter, setDietFilter] = useState("all");
  const router = useRouter();

  const handleSearch = () => {
    if (!pnr) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRestaurantsFound(true);
    }, 1500);
  };

  const handlePlaceOrder = () => {
    const totalItems = getTotalItems();
    if (totalItems === 0) return;

    const bookingDetails = {
        type: 'Food',
        station: deliveryStations[0],
        items: totalItems,
        fare: getTotalPrice() + 59, // 59 is convenience fee
        date: format(new Date(), 'yyyy-MM-dd'),
    };
    sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    router.push('/payment');
  }

  const addToCart = (itemId: number) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const filteredMenuItems = useMemo(() => {
    if (dietFilter === 'all') return menuItems;
    return menuItems.filter(item => {
        if (dietFilter === 'veg') return item.dietary === 'veg' || item.dietary === 'jain';
        return item.dietary === dietFilter
    });
  }, [dietFilter]);

  const getTotalItems = () => Object.values(cart).reduce((acc, curr) => acc + curr, 0);
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((acc, [itemId, quantity]) => {
      const item = menuItems.find(m => m.id === Number(itemId));
      return acc + (item?.price || 0) * quantity;
    }, 0);
  };
  
  if (orderPlaced) {
    return (
        <div className="flex justify-center items-center h-full">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Live Order Tracking</CardTitle>
                    <CardDescription>Your order from 'Railicious Restaurant' is on its way!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {orderStatusSteps.map((status, index) => (
                             <div key={status} className="flex items-center gap-4">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${index <= currentStatus ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    {index < currentStatus ? '✔' : index + 1}
                                </div>
                                <div>
                                    <p className={`font-medium ${index <= currentStatus ? 'text-primary' : ''}`}>{status}</p>
                                    {index === currentStatus && <p className="text-sm text-muted-foreground animate-pulse">Updating...</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => {setOrderPlaced(false); setCart({}); setCurrentStatus(0);}}>Place Another Order</Button>
                </CardFooter>
            </Card>
        </div>
    )
  }

  return (
    <Dialog>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Order Food on Train</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Enter PNR to find Restaurants</CardTitle>
            <CardDescription>We'll show you restaurants that can deliver at your upcoming stations.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input 
                type="text" 
                placeholder="Enter 10-digit PNR" 
                value={pnr} 
                onChange={(e) => setPnr(e.target.value)}
                maxLength={10}
              />
              <Button onClick={handleSearch} disabled={loading || pnr.length !== 10}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Search</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Finding Restaurants for you...</h2>
            <p className="text-muted-foreground">Checking your train's route and upcoming stations.</p>
          </div>
        )}

        {restaurantsFound && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                  <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                          <span>Railicious Restaurant</span>
                          <div className="flex items-center gap-1 text-sm font-bold text-primary"><Star className="h-4 w-4 fill-current"/> 4.2</div>
                      </CardTitle>
                      <CardDescription>Delivering to your next station: Ratlam (RTM)</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <RadioGroup value={dietFilter} onValueChange={setDietFilter} className="flex items-center gap-4">
                          <Label>Dietary:</Label>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="all" id="all"/><Label htmlFor="all">All</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="veg" id="veg"/><Label htmlFor="veg">Veg</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="non-veg" id="non-veg"/><Label htmlFor="non-veg">Non-Veg</Label></div>
                          <div className="flex items-center space-x-2"><RadioGroupItem value="jain" id="jain"/><Label htmlFor="jain">Jain</Label></div>
                      </RadioGroup>
                  </CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                {filteredMenuItems.map(item => (
                  <Card key={item.id} className="flex flex-col">
                    <CardHeader className="p-0 relative">
                       <Image data-ai-hint="food meal" src={item.image} alt={item.name} width={300} height={200} className="w-full h-32 object-cover rounded-t-lg" />
                        <div className="absolute top-2 right-2 bg-background/80 p-1 rounded-full">
                           {dietIcons[item.dietary as keyof typeof dietIcons]}
                       </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-grow flex flex-col">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="font-semibold text-primary">Rs. {item.price}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 flex-grow">{item.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto">View Details</Button>
                        </DialogTrigger>
                        {!cart[item.id] ? (
                          <Button size="sm" onClick={() => addToCart(item.id)}>Add to Cart</Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" onClick={() => removeFromCart(item.id)}><Minus className="h-4 w-4"/></Button>
                            <span className="font-bold w-4 text-center">{cart[item.id]}</span>
                            <Button size="icon" variant="outline" onClick={() => addToCart(item.id)}><Plus className="h-4 w-4"/></Button>
                          </div>
                        )}
                      </div>
                       <DialogContent className="max-w-lg">
                          <DialogHeader>
                              <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                                <Image data-ai-hint="food meal" src={item.image} alt={item.name} layout="fill" objectFit="cover" />
                              </div>
                              <DialogTitle className="text-2xl">{item.name}</DialogTitle>
                              <DialogDescription className="flex items-center gap-4">
                                  <span>{item.vendor.name}</span>
                                  <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-500"/> {item.vendor.rating}</span>
                              </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                              <div className="flex justify-between items-center font-bold text-lg">
                                  <p>Price: <span className="text-primary">Rs. {item.price}</span></p>
                                   <Badge variant="outline" className="flex items-center gap-1">
                                      {dietIcons[item.dietary as keyof typeof dietIcons]} {dietLabels[item.dietary as keyof typeof dietLabels]}
                                  </Badge>
                              </div>
                              <div>
                                  <h4 className="font-semibold">Main Ingredients</h4>
                                  <p className="text-sm text-muted-foreground">{item.ingredients.join(', ')}</p>
                              </div>
                               <div>
                                  <h4 className="font-semibold">Calorie Count</h4>
                                  <p className="text-sm text-muted-foreground">Approx. {item.calories} kcal</p>
                              </div>
                          </div>
                      </DialogContent>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="lg:col-span-1 sticky top-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ShoppingCart /> Your Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  {getTotalItems() === 0 ? (
                    <p className="text-muted-foreground text-center">Your cart is empty.</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(cart).map(([itemId, quantity]) => {
                        const item = menuItems.find(m => m.id === Number(itemId));
                        if (!item) return null;
                        return (
                          <div key={itemId} className="flex justify-between items-center text-sm">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-muted-foreground">Rs. {item.price} x {quantity}</p>
                            </div>
                            <p className="font-semibold">Rs. {item.price * quantity}</p>
                          </div>
                        )
                      })}
                      <Separator />
                      <div className="flex justify-between items-center font-bold">
                        <p>Total</p>
                        <p>Rs. {getTotalPrice()}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              {getTotalItems() > 0 && 
                <Card>
                  <CardHeader><CardTitle>Delivery Station</CardTitle></CardHeader>
                  <CardContent>
                      <Select defaultValue={deliveryStations[0]}>
                          <SelectTrigger>
                              <SelectValue placeholder="Select station"/>
                          </SelectTrigger>
                          <SelectContent>
                              {deliveryStations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                      </Select>
                  </CardContent>
                   <CardFooter>
                      <Button className="w-full" onClick={handlePlaceOrder}>Proceed to Payment</Button>
                  </CardFooter>
                </Card>
              }
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

    