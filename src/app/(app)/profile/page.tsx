
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Trash, Plus } from "lucide-react";
import { useState } from "react";

const savedPassengers = [
  { id: 1, name: "Ravi Kumar", age: 34, gender: "Male" },
  { id: 2, name: "Priya Sharma", age: 29, gender: "Female" },
  { id: 3, name: "Anjali Mehta", age: 58, gender: "Female" }
];

export default function ProfilePage() {
  const [passengers, setPassengers] = useState(savedPassengers);

  const removePassenger = (id: number) => {
    setPassengers(passengers.filter(p => p.id !== id));
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User"/>
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <CardTitle>Ravi Kumar</CardTitle>
              <CardDescription>traveller@example.com</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </CardContent>
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
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Ravi Kumar" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="traveller@example.com" disabled />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="9876543210" />
              </div>
            </CardContent>
             <CardContent>
                <Button>Save Changes</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Saved Passengers</CardTitle>
              <CardDescription>Manage your co-travellers for faster bookings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {passengers.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-sm text-muted-foreground">{p.age}, {p.gender}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removePassenger(p.id)}><Trash className="h-4 w-4 text-destructive"/></Button>
                </div>
              ))}
              <Button variant="outline" className="w-full"><Plus className="h-4 w-4 mr-2"/> Add New Passenger</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
