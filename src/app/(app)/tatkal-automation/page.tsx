
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash, Sparkles, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getSavedPassengers, getTatkalRequests } from "@/lib/firebase/firestore";
import { tatkalBookerFlow, type TatkalBookingRequest } from "@/ai/flows/tatkal-booker";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
    const [scheduledRequests, setScheduledRequests] = useState<any[]>([]);
    const [requestsLoading, setRequestsLoading] = useState(true);

     const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            trainNumber: "",
            journeyDate: "",
            fromStation: "",
            toStation: "",
            bookingClass: "",
            berthPreference: 'any',
            upiId: 'yatra.user@okhdfcbank',
            autoPay: true,
        }
    });

    useEffect(() => {
        if (user) {
            const unsubscribePassengers = getSavedPassengers(user.uid, (data) => {
                setSavedPassengers(data);
            });

            setRequestsLoading(true);
            const unsubscribeRequests = getTatkalRequests(user.uid, (data) => {
                setScheduledRequests(data);
                setRequestsLoading(false);
            })

            return () => {
                unsubscribePassengers();
                unsubscribeRequests();
            };
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
        if (!user) {
            toast({
                variant: "destructive",
                title: "Not logged in",
                description: "You must be logged in to activate automation.",
            });
            return;
        }

        setLoading(true);
        try {
            const request: TatkalBookingRequest = {
                userId: user.uid,
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
            
            const response = await tatkalBookerFlow(request);

            if(response.success) {
                toast({
                    title: "Automation Scheduled!",
                    description: response.message,
                });
                form.reset({
                    trainNumber: "",
                    journeyDate: "",
                    fromStation: "",
                    toStation: "",
                    bookingClass: "",
                    berthPreference: 'any',
                    upiId: 'yatra.user@okhdfcbank',
                    autoPay: true,
                });
                setSelectedPassengers([]);
            } else {
                 toast({
                    variant: "destructive",
                    title: "Scheduling Failed",
                    description: response.message,
                });
            }

        } catch (error) {
            console.error("Tatkal Automation Error:", error);
            toast({
                variant: "destructive",
                title: "Scheduling Failed",
                description: "Could not schedule the Tatkal automation. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    }

  return (
    <Dialog>
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline mb-8 flex items-center gap-2"><Sparkles className="h-7 w-7 text-primary"/> Tatkal Booking Automation</h1>
        <DialogTrigger asChild>
            <Button variant="outline"><Eye className="mr-2 h-4 w-4"/>View Scheduled Requests</Button>
        </DialogTrigger>
      </div>
      
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
                        <FormItem><FormLabel>Date of Journey</FormLabel><FormControl><Input type="date" {...field} min={new Date().toISOString().split("T")[0]}/></FormControl><FormMessage /></FormItem>
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
                            <Select onValueChange={field.onChange} value={field.value}>
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
                             <Select onValueChange={field.onChange} value={field.value}>
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
                        <FormItem className="flex items-center space-x-2 pt-2">
                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange}/></FormControl>
                            <FormLabel>Enable Auto-pay (Recommended)</FormLabel>
                        </FormItem>
                    )}/>
                 </CardContent>
            </Card>

            <Button size="lg" className="w-full" type="submit" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2"/> : <Sparkles className="h-5 w-5 mr-2"/>}
                {loading ? "Scheduling..." : "Schedule Tatkal Automation"}
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
                   <p>2. We securely save your request to be processed by our backend.</p>
                   <p>3. A scheduled Cloud Function will trigger at the Tatkal opening time.</p>
                   <p>4. The function will attempt to book your ticket automatically using the details you provided.</p>
                   <p>5. You'll be notified via Push and Email about the booking status.</p>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
     <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Scheduled Tatkal Requests</DialogTitle>
          <DialogDescription>
            Here are your pending Tatkal automation requests.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
            {requestsLoading ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                </div>
            ) : scheduledRequests.length === 0 ? (
                 <p className="text-center text-muted-foreground py-8">No requests have been scheduled yet.</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Train</TableHead>
                            <TableHead>Journey</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scheduledRequests.map(req => (
                            <TableRow key={req.id}>
                                <TableCell className="font-mono text-xs">{req.id}</TableCell>
                                <TableCell>{req.journeyDetails.trainNumber}</TableCell>
                                <TableCell>{req.journeyDetails.fromStationCode} → {req.journeyDetails.toStationCode}</TableCell>
                                <TableCell>{req.journeyDetails.journeyDate}</TableCell>
                                <TableCell>
                                    <Badge variant={req.status === 'SCHEDULED' ? 'secondary' : 'default'}>{req.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

