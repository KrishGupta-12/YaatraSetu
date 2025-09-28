
import { AppFooter } from "@/components/layout/app-footer";
import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <PublicHeader />
            <main className="flex-1">
                {children}
            </main>
            <AppFooter />
        </div>
    );
}
