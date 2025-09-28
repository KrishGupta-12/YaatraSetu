
"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Hotel, LogOut, LayoutDashboard } from "lucide-react";
import { YaatraSetuLogo } from "@/components/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";


function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const adminStatus = sessionStorage.getItem('isAdminAuthenticated');
    if (adminStatus === 'true') {
        setIsAdmin(true);
        const adminEmail = sessionStorage.getItem('adminEmail');
        if (adminEmail?.toLowerCase() === 'krish@yaatrasetu.com') {
            setAdminName("Krish");
        }
    } else {
        router.push("/auth/login");
    }
    setLoading(false);
  }, [router]);

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const handleLogout = () => {
      sessionStorage.removeItem('isAdminAuthenticated');
      sessionStorage.removeItem('adminEmail');
      setIsAdmin(false);
      router.push('/auth/login');
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
                <YaatraSetuLogo className="h-6 w-6" />
                <span className="">YaatraSetu Admin</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                     <Link
                        href="/admin/dashboard"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname === '/admin/dashboard' && 'bg-muted text-primary'}`}
                        >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/hotels"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${pathname === '/admin/hotels' && 'bg-muted text-primary'}`}
                        >
                        <Hotel className="h-4 w-4" />
                        Hotels
                    </Link>
                </nav>
            </div>
             <div className="mt-auto p-4">
                <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4"/> Logout
                </Button>
            </div>
        </div>
      </aside>
      <div className="flex flex-col">
         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
                <h1 className="text-lg font-semibold">Welcome, {adminName}!</h1>
            </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
    return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
