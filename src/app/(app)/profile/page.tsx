
"use client";

import { useState } from "react";
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

const savedPassengers = [
  { id: 1, name: "Priya Sharma", age: 29, gender: "Female" },
  { id: 2, name: "Anjali Mehta", age: 58, gender: "Female" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const { profileData, loading } = useUserProfile();
  const [passengers, setPassengers] = useState(savedPassengers);

  const removePassenger = (id: number) => {
    setPassengers(passengers.filter((p) => p.id !== id));
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
                <AvatarImage src={user?.photoURL || ""} alt={profileData?.displayName || ""} />
                <AvatarFallback>
                  {profileData?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{profileData?.displayName || user?.displayName}</CardTitle>
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
                    <Input value={profileData?.displayName || ''} disabled />
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
