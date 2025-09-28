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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { YatraSetuLogo } from "@/components/icons";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

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
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <YatraSetuLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline group-data-[collapsible=icon]:hidden">
            YatraSetu
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="group-data-[collapsible=icon]:hidden">
         <Separator className="my-2" />
         <div className="p-2 space-y-2 bg-muted/50 rounded-lg">
            <h4 className="font-semibold text-sm">Tatkal Automation</h4>
            <p className="text-xs text-muted-foreground">
                Set up automated Tatkal bookings. Never miss a ticket again!
            </p>
            <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Automate Now
            </Button>
         </div>
      </SidebarFooter>
    </>
  );
}
