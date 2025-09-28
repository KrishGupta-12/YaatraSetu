"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const savedPassengers = [
  { id: 1, name: "Ravi Kumar", age: 34, gender: "Male" },
  { id: 2, name: "Priya Sharma", age: 29, gender: "Female" },
  { id: 3, name: "Anjali Mehta", age: 58, gender: "Female" }
];

export default function TatkalAutomationPage() {
    const [loading, setLoading] = useState(false);
    const [passengers, setPassengers] = useState<any[]>([]);

    const addPassenger = (passenger: any) => {
        if(passengers.length < 4) {
            setPassengers([...passengers, passenger]);
        } else {
            toast({
                variant: "destructive",
                title: "Passenger limit reached",
                description: "You can add a maximum of 4 passengers for a single Tatkal booking.",
            });
        }
    }

    const removePassenger = (id: number) => {
        setPassengers(passengers.filter(p => p.id !== id));
    }

    const handleAutomate = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast({
                title: "Automation Activated!",
                description: "We will attempt to book your Tatkal ticket at 10:00 AM for AC class or 11:00 AM for Sleeper class.",
            });
        }, 2000);
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8 flex items-center gap-2"><Sparkles className="h-7 w-7 text-primary"/> Tatkal Booking Automation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Train & Journey Details</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="train-number">Train Number</Label>
                        <Input id="train-number" placeholder="e.g., 12951"/>
                    </div>
                     <div>
                        <Label htmlFor="journey-date">Date of Journey</Label>
                        <Input id="journey-date" type="date"/>
                    </div>
                    <div>
                        <Label htmlFor="from-station">From Station Code</Label>
                        <Input id="from-station" placeholder="e.g., BCT"/>
                    </div>
                    <div>
                        <Label htmlFor="to-station">To Station Code</Label>
                        <Input id="to-station" placeholder="e.g., NDLS"/>
                    </div>
                    <div>
                        <Label htmlFor="class">Booking Class</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2A">AC 2 Tier (2A)</SelectItem>
                                <SelectItem value="3A">AC 3 Tier (3A)</SelectItem>
                                <SelectItem value="SL">Sleeper (SL)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="berth">Berth Preference</Label>
                         <Select>
                            <SelectTrigger><SelectValue placeholder="Select Berth"/></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="lower">Lower</SelectItem>
                                <SelectItem value="middle">Middle</SelectItem>
                                <SelectItem value="upper">Upper</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Passenger Details</CardTitle>
                    <CardDescription>Add passengers who will be travelling. You can add up to 4.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {passengers.length > 0 && (
                        <div className="space-y-2">
                        {passengers.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                <div>
                                    <p className="font-semibold">{p.name}</p>
                                    <p className="text-sm text-muted-foreground">{p.age}, {p.gender}</p>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => removePassenger(p.id)}><Trash className="h-4 w-4 text-destructive"/></Button>
                            </div>
                        ))}
                        </div>
                    )}
                    {passengers.length === 0 && <p className="text-center text-muted-foreground py-4">No passengers added yet.</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Ensure you have sufficient balance for the booking.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="upi-id">UPI ID</Label>
                        <Input id="upi-id" placeholder="yourname@upi" defaultValue="yatra.user@okhdfcbank"/>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch id="auto-pay" defaultChecked/>
                        <Label htmlFor="auto-pay">Enable Auto-pay (Recommended)</Label>
                    </div>
                 </CardContent>
            </Card>

            <Button size="lg" className="w-full" onClick={handleAutomate} disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : <Sparkles className="h-5 w-5 mr-2"/>}
                {loading ? "Activating..." : "Activate Tatkal Automation"}
            </Button>
        </div>

        <div className="md:col-span-1 space-y-6 sticky top-6">
            <Card>
                <CardHeader>
                    <CardTitle>Add Saved Passengers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {savedPassengers.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                            <div>
                                <p className="font-medium">{p.name}</p>
                                <p className="text-sm text-muted-foreground">{p.age}, {p.gender}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => addPassenger(p)}>
                                <Plus className="h-4 w-4 mr-1"/> Add
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
             <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950">
                <CardHeader>
                    <CardTitle className="text-amber-800 dark:text-amber-200">How it works?</CardTitle>
                </CardHeader>
                <CardContent className="text-amber-700 dark:text-amber-300 text-sm space-y-2">
                   <p>1. Fill in all details for your journey and passengers.</p>
                   <p>2. We'll securely save your choices for the big moment.</p>
                   <p>3. At 9:59 AM (AC) or 10:59 AM (Sleeper), our system will get ready.</p>
                   <p>4. The moment the Tatkal window opens, we will attempt to book your ticket automatically.</p>
                   <p>5. You'll be notified via Push and Email about the booking status.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

    