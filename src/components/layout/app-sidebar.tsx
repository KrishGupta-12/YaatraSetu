
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bot,
  CookingPot,
  History,
  Hotel,
  LayoutDashboard,
  TicketCheck,
  Train,
  Bell,
  Sparkles,
  User,
  Settings,
  LifeBuoy,
  Info,
  Lock,
  Mail,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { YaatraSetuLogo } from "@/components/icons";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

const mainNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/ai-planner", icon: Bot, label: "AI Planner" },
  { href: "/train-booking", icon: Train, label: "Train Booking" },
  { href: "/hotel-booking", icon: Hotel, label: "Hotel Booking" },
  { href: "/food-ordering", icon: CookingPot, label: "Food Orders" },
  { href: "/waitlist-prediction", icon: TicketCheck, label: "Waitlist Pred." },
  { href: "/tatkal-automation", icon: Sparkles, label: "Tatkal Automation"},
  { href: "/rewards", icon: Trophy, label: "Rewards" },
  { href: "/history", icon: History, label: "History" },
];

const secondaryNavItems = [
    { href: "/features", icon: Info, label: "Features"},
    { href: "/founder", icon: User, label: "Founder"},
    { href: "/help-center", icon: LifeBuoy, label: "Help Center"},
    { href: "/contact", icon: Mail, label: "Contact Us"},
    { href: "/privacy-policy", icon: Lock, label: "Privacy Policy"},
]

const mockNotifications = [
    { title: "Booking Confirmed!", description: "Your ticket for train 12951 is confirmed. Seat: B4, 32.", time: "5 min ago"},
    { title: "Platform Change", description: "Train 12951 will now depart from Platform 6 instead of 3.", time: "1 hour ago"},
    { title: "Food Delivered", description: "Your order from 'Ghar ka Khana' has been delivered to your seat.", time: "Yesterday"},
]

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <YaatraSetuLogo className="h-6 w-6" />
          <span className="">YaatraSetu</span>
        </Link>
         <Popover>
          <PopoverTrigger asChild>
             <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Notifications</h4>
                <p className="text-sm text-muted-foreground">
                  You have 3 unread messages.
                </p>
              </div>
              <div className="grid gap-2">
                {mockNotifications.map((notification, index) => (
                    <div
                        key={index}
                        className="mb-2 grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0"
                    >
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <div className="grid gap-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                  "bg-muted text-primary": pathname === item.href,
                }
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <Separator className="my-4" />
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
           {secondaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                  "bg-muted text-primary": pathname === item.href,
                }
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
       <div className="mt-auto p-4 border-t">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>My Account</CardTitle>
              <CardDescription>
                Access your profile and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
               <Link href="/profile" passHref>
                <Button size="sm" variant="outline" className="w-full mb-2">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Button>
              </Link>
              <Link href="/settings" passHref>
                <Button size="sm" variant="outline" className="w-full">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}
