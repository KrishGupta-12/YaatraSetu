
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CreditCard, Landmark, Loader2, PartyPopper, Train } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { createBooking } from "@/lib/firebase/firestore";

export default function PaymentPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("upi");
    const [processing, setProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const details = sessionStorage.getItem('bookingDetails');
        if (details) {
            setBookingDetails(JSON.parse(details));
        }
        setLoading(false);
    }, []);

    const handlePayment = async () => {
        if (!user || !bookingDetails) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "User or booking details are missing.",
            });
            return;
        }

        setProcessing(true);

        try {
            await createBooking(user.uid, bookingDetails);

            setTimeout(() => {
                setProcessing(false);
                setPaymentSuccess(true);
                toast({
                    title: "Payment Successful!",
                    description: "Your tickets have been booked.",
                });
                sessionStorage.removeItem('bookingDetails');
            }, 2000);

        } catch (error) {
            console.error("Booking failed:", error);
            toast({
                variant: "destructive",
                title: "Booking Failed",
                description: "There was an error saving your booking. Please try again.",
            });
            setProcessing(false);
        }
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin"/></div>
    }

    if (!bookingDetails && !paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <h2 className="text-2xl font-semibold">No booking details found.</h2>
                <p className="text-muted-foreground">Please start a new booking to proceed to payment.</p>
                <Button onClick={() => router.push('/train-booking')} className="mt-4">Book a Train</Button>
            </div>
        )
    }
    
    if (paymentSuccess) {
        return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <PartyPopper className="h-16 w-16 text-green-500 mb-4"/>
                <h1 className="text-3xl font-bold font-headline">Booking Confirmed!</h1>
                <p className="text-muted-foreground max-w-md mx-auto mt-2">
                    Your tickets have been successfully booked. You will receive an email and SMS with the details shortly.
                </p>
                <div className="mt-6 flex gap-4">
                    <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
                    <Button variant="outline" onClick={() => router.push('/history')}>View Booking History</Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight font-headline mb-8">Complete Your Payment</h1>
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Choose Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                <div className="p-4 rounded-lg border bg-muted/50 flex items-center gap-4 has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                    <RadioGroupItem value="upi" id="upi"/>
                                    <Label htmlFor="upi" className="flex-grow flex items-center gap-2 cursor-pointer">
                                        <img src="https://www.vectorlogo.zone/logos/upi/upi-icon.svg" alt="UPI" className="h-6 w-6"/>
                                        UPI
                                    </Label>
                                </div>
                                <div className="p-4 rounded-lg border bg-muted/50 flex items-center gap-4 has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                    <RadioGroupItem value="card" id="card"/>
                                    <Label htmlFor="card" className="flex-grow flex items-center gap-2 cursor-pointer"><CreditCard/> Credit/Debit Card</Label>
                                </div>
                                <div className="p-4 rounded-lg border bg-muted/50 flex items-center gap-4 has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary">
                                    <RadioGroupItem value="netbanking" id="netbanking"/>
                                    <Label htmlFor="netbanking" className="flex-grow flex items-center gap-2 cursor-pointer"><Landmark/> Net Banking</Label>
                                </div>
                            </RadioGroup>

                            <div className="mt-6">
                                {paymentMethod === 'upi' && (
                                    <div>
                                        <Label htmlFor="upi-id">Enter UPI ID</Label>
                                        <div className="flex gap-2 mt-2">
                                            <Input id="upi-id" placeholder="yourname@bank" />
                                            <Button>Verify</Button>
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === 'card' && (
                                     <div className="space-y-4">
                                        <div><Label>Card Number</Label><Input placeholder="XXXX XXXX XXXX XXXX"/></div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="col-span-2"><Label>Expiry Date</Label><Input placeholder="MM/YY"/></div>
                                            <div><Label>CVV</Label><Input placeholder="XXX"/></div>
                                        </div>
                                        <div><Label>Name on Card</Label><Input placeholder="Cardholder's Name"/></div>
                                     </div>
                                )}
                                {paymentMethod === 'netbanking' && (
                                    <div>
                                        <Label>Select Bank</Label>
                                        <Select>
                                            <SelectTrigger><SelectValue placeholder="Choose your bank..."/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sbi">State Bank of India</SelectItem>
                                                <SelectItem value="hdfc">HDFC Bank</SelectItem>
                                                <SelectItem value="icici">ICICI Bank</SelectItem>
                                                <SelectItem value="axis">Axis Bank</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Booking Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Train className="h-6 w-6 text-primary"/>
                                <div>
                                    <p className="font-semibold">{bookingDetails.train.name} ({bookingDetails.train.id})</p>
                                    <p className="text-sm text-muted-foreground">{bookingDetails.train.from} → {bookingDetails.train.to}</p>
                                </div>
                            </div>
                             <div>
                                <p className="font-semibold">{bookingDetails.passengers.length} Passenger(s)</p>
                                <ul className="text-sm text-muted-foreground list-disc pl-5">
                                    {bookingDetails.passengers.map((p: any) => <li key={p.id}>{p.name}</li>)}
                                </ul>
                            </div>
                            <Separator/>
                             <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                    <span>Ticket Fare</span>
                                    <span>Rs. {(bookingDetails.fare - 59).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Convenience Fee</span>
                                    <span>Rs. 59</span>
                                </div>
                             </div>
                             <Separator/>
                             <div className="flex justify-between font-bold text-lg">
                                <span>Amount to Pay</span>
                                <span>Rs. {bookingDetails.fare.toLocaleString('en-IN')}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={handlePayment} disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                                {processing ? 'Processing...' : `Pay Rs. ${bookingDetails.fare.toLocaleString('en-IN')}`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

    