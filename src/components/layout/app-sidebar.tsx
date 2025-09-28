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
  Bell
} from "lucide-react";

import { cn } from "@/lib/utils";
import { YatraSetuLogo } from "@/components/icons";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/ai-planner", icon: Bot, label: "AI Planner" },
  { href: "/train-booking", icon: Train, label: "Train Booking" },
  { href: "/hotel-booking", icon: Hotel, label: "Hotel Booking" },
  { href: "/food-ordering", icon: CookingPot, label: "Food Orders" },
  { href: "/waitlist-prediction", icon: TicketCheck, label: "Waitlist Pred." },
  { href: "/history", icon: History, label: "History" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <YatraSetuLogo className="h-6 w-6" />
          <span className="">YatraSetu</span>
        </Link>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                {
                  "bg-muted text-primary": pathname.startsWith(item.href),
                }
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Card x-chunk="dashboard-02-chunk-0">
          <CardHeader className="p-2 pt-0 md:p-4">
            <CardTitle>Tatkal Automation</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
            <p className="text-xs text-muted-foreground mb-2">
              Set up automated Tatkal bookings. Never miss a ticket again!
            </p>
            <Button size="sm" className="w-full">
              Automate Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}