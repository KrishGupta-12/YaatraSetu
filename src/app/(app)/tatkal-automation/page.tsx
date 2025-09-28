
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getSavedPassengers } from "@/lib/firebase/firestore";
import { tatkalBookerFlow, type TatkalBookingRequest } from "@/ai/flows/tatkal-booker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";


const savedPassengerSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.string(),
});
type SavedPassenger = z.infer<typeof savedPassengerSchema>;

const formSchema = z.object({
    trainNumber: z.string().length(5, "Train number must be 5 digits."),
    journeyDate: z.string().min(1, "Journey date is required."),
    fromStation: z.string().min(3, "From station code is required."),
    toStation: z.string().min(3, "To station code is required."),
    bookingClass: z.string().min(1, "Booking class is required."),
    berthPreference: z.string().optional(),
    upiId: z.string().min(3, "UPI ID is required."),
    autoPay: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

export default function TatkalAutomationPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [savedPassengers, setSavedPassengers] = useState<SavedPassenger[]>([]);
    const [selectedPassengers, setSelectedPassengers] = useState<SavedPassenger[]>([]);

     const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            berthPreference: 'any',
            upiId: 'yatra.user@okhdfcbank',
            autoPay: true,
        }
    });

    useEffect(() => {
        if (user) {
            const unsubscribe = getSavedPassengers(user.uid, (data) => {
                setSavedPassengers(data);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const addPassenger = (passenger: SavedPassenger) => {
        if (selectedPassengers.length < 4) {
            if (!selectedPassengers.find(p => p.id === passenger.id)) {
                setSelectedPassengers([...selectedPassengers, passenger]);
            }
        } else {
            toast({
                variant: "destructive",
                title: "Passenger limit reached",
                description: "You can add a maximum of 4 passengers for a single Tatkal booking.",
            });
        }
    }

    const removePassenger = (id: string) => {
        setSelectedPassengers(selectedPassengers.filter(p => p.id !== id));
    }

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        if (selectedPassengers.length === 0) {
            toast({
                variant: "destructive",
                title: "No passengers selected",
                description: "Please add at least one passenger.",
            });
            return;
        }

        setLoading(true);
        try {
            const request: TatkalBookingRequest = {
                userId: user!.uid,
                journeyDetails: {
                    trainNumber: data.trainNumber,
                    journeyDate: data.journeyDate,
                    fromStationCode: data.fromStation,
                    toStationCode: data.toStation,
                    bookingClass: data.bookingClass,
                    berthPreference: data.berthPreference || 'any',
                },
                passengers: selectedPassengers,
                paymentDetails: {
                    upiId: data.upiId,
                    autoPay: data.autoPay,
                }
            };
            
            await tatkalBookerFlow(request);

            toast({
                title: "Automation Activated!",
                description: "We will attempt to book your Tatkal ticket. You'll be notified of the result.",
            });
        } catch (error) {
            console.error("Tatkal Automation Error:", error);
            toast({
                variant: "destructive",
                title: "Activation Failed",
                description: "Could not activate the Tatkal automation. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline mb-8 flex items-center gap-2"><Sparkles className="h-7 w-7 text-primary"/> Tatkal Booking Automation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2 space-y-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Train & Journey Details</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="trainNumber" render={({ field }) => (
                        <FormItem><FormLabel>Train Number</FormLabel><FormControl><Input placeholder="e.g., 12951" {...field}/></FormControl><FormMessage /></FormItem>
                    )}/>
                     <FormField control={form.control} name="journeyDate" render={({ field }) => (
                        <FormItem><FormLabel>Date of Journey</FormLabel><FormControl><Input type="date" {...field}/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="fromStation" render={({ field }) => (
                        <FormItem><FormLabel>From Station Code</FormLabel><FormControl><Input placeholder="e.g., BCT" {...field}/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="toStation" render={({ field }) => (
                        <FormItem><FormLabel>To Station Code</FormLabel><FormControl><Input placeholder="e.g., NDLS" {...field}/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="bookingClass" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Booking Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="2A">AC 2 Tier (2A)</SelectItem>
                                    <SelectItem value="3A">AC 3 Tier (3A)</SelectItem>
                                    <SelectItem value="SL">Sleeper (SL)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="berthPreference" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Berth Preference</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select Berth"/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="any">Any</SelectItem>
                                    <SelectItem value="lower">Lower</SelectItem>
                                    <SelectItem value="middle">Middle</SelectItem>
                                    <SelectItem value="upper">Upper</SelectItem>
                                </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Passenger Details</CardTitle>
                    <CardDescription>Add passengers who will be travelling. You can add up to 4.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedPassengers.length > 0 && (
                        <div className="space-y-2">
                        {selectedPassengers.map(p => (
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
                    {selectedPassengers.length === 0 && <p className="text-center text-muted-foreground py-4">No passengers added yet.</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                    <CardDescription>Ensure you have sufficient balance for the booking.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                    <FormField control={form.control} name="upiId" render={({ field }) => (
                        <FormItem><FormLabel>UPI ID</FormLabel><FormControl><Input placeholder="yourname@upi" {...field}/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="autoPay" render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                            <Label htmlFor="auto-pay">Enable Auto-pay (Recommended)</Label>
                        </FormItem>
                    )}/>
                 </CardContent>
            </Card>

            <Button size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : <Sparkles className="h-5 w-5 mr-2"/>}
                {loading ? "Activating..." : "Activate Tatkal Automation"}
            </Button>
            </form>
            </Form>
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
                            <Button size="sm" variant="outline" onClick={() => addPassenger(p)} disabled={selectedPassengers.some(sp => sp.id === p.id)}>
                                <Plus className="h-4 w-4 mr-1"/> Add
                            </Button>
                        </div>
                    ))}
                     {savedPassengers.length === 0 && <p className="text-sm text-muted-foreground text-center">No saved passengers found.</p>}
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

    