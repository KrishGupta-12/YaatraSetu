
"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAdminStats, getRecentBookings } from "@/lib/firebase/firestore";
import { Hotel, Users, BookMarked, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { format, subDays } from "date-fns";

type Stats = {
    hotels: number;
    users: number;
    bookings: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [bookingsData, setBookingsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            try {
                const [statsData, recentBookings] = await Promise.all([
                    getAdminStats(),
                    getRecentBookings(7)
                ]);
                setStats(statsData);

                const bookingsByDay = recentBookings.reduce((acc: any, booking: any) => {
                    const day = format(new Date(booking.date), 'yyyy-MM-dd');
                    acc[day] = (acc[day] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Array.from({ length: 7 }, (_, i) => {
                    const date = subDays(new Date(), i);
                    const formattedDate = format(date, 'yyyy-MM-dd');
                    return {
                        name: format(date, 'MMM d'),
                        total: bookingsByDay[formattedDate] || 0,
                    };
                }).reverse();
                
                setBookingsData(chartData);

            } catch (error) {
                console.error("Failed to fetch admin dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchDashboardData();
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
                 <Skeleton className="h-80 w-full"/>
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
            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardContent className="pl-2 pt-4">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={bookingsData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
                                <Tooltip
                                    contentStyle={{
                                        background: "hsl(var(--background))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "var(--radius)",
                                    }}
                                />
                                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
    );
}
