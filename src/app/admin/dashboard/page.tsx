
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAdminStats } from "@/lib/firebase/firestore";
import { Hotel, Loader2, Users, BookMarked } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Stats = {
    hotels: number;
    users: number;
    bookings: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const data = await getAdminStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
             <div className="space-y-4">
                 <h1 className="text-2xl font-bold">Dashboard</h1>
                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                     <Skeleton className="h-28" />
                     <Skeleton className="h-28" />
                     <Skeleton className="h-28" />
                 </div>
             </div>
        )
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Hotels</CardTitle>
                        <Hotel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.hotels ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Managed across the platform</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.users ?? 0}</div>
                         <p className="text-xs text-muted-foreground">Registered on YaatraSetu</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                        <BookMarked className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.bookings ?? 0}</div>
                        <p className="text-xs text-muted-foreground">Across all services</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    