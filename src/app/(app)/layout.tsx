
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { AppFooter } from "@/components/layout/app-footer";

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Allow access to public pages within the app structure
  const publicAppPages = ['/features', '/founder', '/help-center', '/contact', '/privacy-policy'];
  const isPublicPage = publicAppPages.includes(pathname);

  useEffect(() => {
    if (!loading && !user && !isPublicPage) {
      router.push("/auth/login");
    }
  }, [user, loading, router, pathname, isPublicPage]);

  if ((loading || !user) && !isPublicPage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden border-r bg-muted/40 md:block">
        <AppSidebar />
      </aside>
      <div className="flex flex-col">
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  );
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
    return <AppLayoutContent>{children}</AppLayoutContent>;
}
