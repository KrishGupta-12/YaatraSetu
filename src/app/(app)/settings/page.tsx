
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="traveller@example.com" disabled />
            <p className="text-sm text-muted-foreground">Your email is used for login and notifications.</p>
          </div>
          <Separator />
          <div>
            <Label>Change Password</Label>
            <div className="grid sm:grid-cols-2 gap-4 mt-2">
                <Input type="password" placeholder="Current Password"/>
                <Input type="password" placeholder="New Password"/>
            </div>
            <Button variant="outline" className="mt-4">Update Password</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how you receive notifications from YatraSetu.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates on bookings, delays, and promotions.</p>
            </div>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Get real-time alerts on your mobile device.</p>
            </div>
            <Switch id="push-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
            <div>
              <Label htmlFor="tatkal-alerts">Tatkal Opening Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified 5 minutes before Tatkal booking opens.</p>
            </div>
            <Switch id="tatkal-alerts" />
          </div>
        </CardContent>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Delete Account</CardTitle>
          <CardDescription>Permanently delete your account and all associated data. This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Delete My Account</Button>
        </CardContent>
      </Card>
    </div>
  );
}
