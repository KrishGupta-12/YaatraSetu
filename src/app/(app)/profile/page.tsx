
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addSavedPassenger, removeSavedPassenger, getSavedPassengers } from "@/lib/firebase/firestore";

const passengerFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  age: z.coerce.number().min(1, "Age must be at least 1.").max(120),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required."}),
  idType: z.enum(["Aadhar", "Passport", "Driving License", "Other"], { required_error: "ID type is required."}),
  idNumber: z.string().min(5, "A valid ID number is required."),
});

type PassengerFormData = z.infer<typeof passengerFormSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { profileData, loading: profileLoading } = useUserProfile();
  const [passengers, setPassengers] = useState<any[]>([]);
  const [passengersLoading, setPassengersLoading] = useState(true);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (user) {
      setPassengersLoading(true);
      const unsubscribe = getSavedPassengers(user.uid, (data) => {
        setPassengers(data);
        setPassengersLoading(false);
      });
      return () => unsubscribe();
    } else {
      setPassengers([]);
      setPassengersLoading(false);
    }
  }, [user]);

  const form = useForm<PassengerFormData>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      name: "",
      age: "" as any,
      idNumber: "",
    }
  });

  const onAddPassenger: SubmitHandler<PassengerFormData> = async (data) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addSavedPassenger(user.uid, data);
      toast({
        title: "Passenger Added",
        description: `${data.name} has been added to your saved passengers.`,
      });
      form.reset();
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to add passenger:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add passenger. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemovePassenger = async (passengerId: string, passengerName: string) => {
    if (!user) return;
    try {
      await removeSavedPassenger(user.uid, passengerId);
      toast({
        title: "Passenger Removed",
        description: `${passengerName} has been removed from your list.`,
      });
    } catch (error) {
      console.error("Failed to remove passenger:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove passenger. Please try again.",
      });
    }
  };

  const loading = profileLoading || passengersLoading;

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="items-center text-center">
                <Skeleton className="h-24 w-24 rounded-full mb-4" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Skeleton className="h-10 w-full" /></div>
                  <div className="space-y-2"><Label>Email Address</Label><Skeleton className="h-10 w-full" /></div>
                </div>
                 <div className="space-y-2"><Label>Phone Number</Label><Skeleton className="h-10 w-full" /></div>
              </CardContent>
            </Card>
            <Card>
               <CardHeader>
                <CardTitle>Saved Passengers</CardTitle>
                <CardDescription>Manage your co-travellers for faster bookings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Skeleton className="h-16 w-full" />
                 <Skeleton className="h-16 w-full" />
                 <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profileData?.displayName || user?.displayName;
  const displayInitial = displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.photoURL || ""} alt={displayName || ""} />
                  <AvatarFallback>{displayInitial}</AvatarFallback>
                </Avatar>
                <CardTitle>{displayName}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" disabled>Edit Profile Picture</Button>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label>Full Name</Label>
                    <Input value={displayName || ''} disabled />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input type="email" value={user?.email || ""} disabled />
                </div>
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="tel" value={profileData?.phone || 'Not provided'} disabled />
              </div>
            </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Saved Passengers</CardTitle>
                <CardDescription>
                  Manage your co-travellers for faster bookings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {passengers.map((p: any) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.age}, {p.gender} | ID: {p.idType} - XXXX{p.idNumber.slice(-4)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemovePassenger(p.id, p.name)}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                 {passengers.length === 0 && (
                    <p className="text-sm text-center text-muted-foreground py-4">No passengers saved yet.</p>
                )}
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <Plus className="h-4 w-4 mr-2" /> Add New Passenger
                    </Button>
                </DialogTrigger>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
       <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Passenger</DialogTitle>
          <DialogDescription>
            Enter the details for your co-traveller.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddPassenger)} className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Priya Sharma" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl><Input type="number" placeholder="e.g., 35" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="idType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Aadhar">Aadhar</SelectItem>
                                        <SelectItem value="Passport">Passport</SelectItem>
                                        <SelectItem value="Driving License">Driving License</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="idNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID Number</FormLabel>
                                <FormControl><Input placeholder="Enter ID Number" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        Save Passenger
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    