
"use client";

import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { updateUserProfile } from "@/lib/firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { updateProfile } from "firebase/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useUserProfile } from "@/hooks/use-user-profile";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const savedPassengers = [
  { id: 1, name: "Priya Sharma", age: 29, gender: "Female" },
  { id: 2, name: "Anjali Mehta", age: 58, gender: "Female" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { profileData, loading } = useUserProfile();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [passengers, setPassengers] = useState(savedPassengers);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        displayName: profileData.displayName || "",
        phone: profileData.phone || "",
      });
    }
  }, [profileData, form]);

  const removePassenger = (id: number) => {
    setPassengers(passengers.filter((p) => p.id !== id));
  };
  
  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!user) return;
    setUpdating(true);
    try {
      // Update Firestore
      await updateUserProfile(user.uid, {
        displayName: data.displayName,
        phone: data.phone,
      });

      // Update Firebase Auth profile
      if (user && user.displayName !== data.displayName) {
        await updateProfile(user, { displayName: data.displayName });
      }

      toast({
        title: "Profile Updated",
        description: "Your information has been saved.",
      });
    } catch (error: any) {
      console.error("Profile Update Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

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
            </Card>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Skeleton className="h-10 w-full" /></div>
                  <div className="space-y-2"><Label>Email Address</Label><Skeleton className="h-10 w-full" /></div>
                </div>
                 <div className="space-y-2"><Label>Phone Number</Label><Skeleton className="h-10 w-full" /></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
                <AvatarFallback>
                  {profileData?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{profileData?.displayName}</CardTitle>
              <CardDescription>{profileData?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>Edit Profile Picture</Button>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your personal details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Full Name</Label>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label>Email Address</Label>
                      <Input type="email" value={profileData?.email || ""} disabled />
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Phone Number</Label>
                        <FormControl>
                          <Input type="tel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={updating}>
                    {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Saved Passengers</CardTitle>
              <CardDescription>
                Manage your co-travellers for faster bookings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passengers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {p.age}, {p.gender}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removePassenger(p.id)}
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add New Passenger
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
