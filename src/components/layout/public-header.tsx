
"use client";

import Link from "next/link";
import { YatraSetuLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
     <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <YatraSetuLogo className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block font-headline">YatraSetu</span>
          </Link>
          <nav className="flex-1 items-center justify-center hidden md:flex">
             <div className="flex items-center gap-6 text-sm font-medium">
                <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
                <Link href="/founder" className="text-muted-foreground hover:text-foreground">Founder</Link>
                <Link href="/features" className="text-muted-foreground hover:text-foreground">Features</Link>
                 <Link href="/contact" className="text-muted-foreground hover:text-foreground">Contact Us</Link>
            </div>
          </nav>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
                <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/auth/signup">Signup</Link>
            </Button>
          </div>
        </div>
      </header>
  )
}
