
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  Search,
  Settings,
  User,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { AppSidebar } from "./app-sidebar";
import { YatraSetuLogo } from "../icons";
import { useAuth } from "@/hooks/use-auth";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


const searchKeywords: Record<string, string[]> = {
    '/dashboard': ['dashboard', 'home', 'main'],
    '/ai-planner': ['ai', 'planner', 'journey', 'trip'],
    '/train-booking': ['train', 'ticket', 'trains', 'booking'],
    '/hotel-booking': ['hotel', 'stay', 'room', 'hotels'],
    '/food-ordering': ['food', 'meal', 'eat', 'order food'],
    '/waitlist-prediction': ['waitlist', 'prediction', 'pnr', 'chance'],
    '/tatkal-automation': ['tatkal', 'automation', 'auto book'],
    '/history': ['history', 'bookings', 'past trips'],
    '/profile': ['profile', 'account', 'user', 'passenger'],
    '/settings': ['settings', 'password', 'delete', 'notification'],
};

export function AppHeader() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };
  
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const lowerCaseTerm = searchTerm.toLowerCase();
    
    if (!lowerCaseTerm) return;

    for (const path in searchKeywords) {
        if (searchKeywords[path].some(keyword => lowerCaseTerm.includes(keyword))) {
            router.push(path);
            setSearchTerm("");
            return;
        }
    }

    toast({
        variant: "default",
        title: "Not Found",
        description: `No page found for "${searchTerm}". Try a different keyword.`,
    });
  }


  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <YatraSetuLogo className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <AppSidebar />
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search features (e.g., 'hotel', 'profile')..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage
                src={user?.photoURL || ""}
                alt={user?.displayName || "User"}
              />
              <AvatarFallback>{user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.displayName || user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
