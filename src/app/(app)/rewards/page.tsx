
"use client";

import { useUserProfile } from "@/hooks/use-user-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Trophy, Star, Gift, Ticket, Train, Hotel, CookingPot, UserPlus, Calendar } from "lucide-react";

export default function RewardsPage() {
    const { profileData, loading } = useUserProfile();

    const rewardsHistory = profileData?.rewardsHistory || [];
    const totalPoints = profileData?.loyaltyPoints || 0;

    const earnMethods = [
        { icon: Hotel, title: "Hotel Booking", description: "Earn 2 RP per ₹100 spent." },
        { icon: Train, title: "Train Booking", description: "Earn 1 RP per ₹100 spent." },
        { icon: CookingPot, title: "Food Orders", description: "Earn 0.5 RP per ₹100 spent." },
        { icon: UserPlus, title: "Refer a Friend", description: "Earn 100 RP when your friend books." },
        { icon: Calendar, title: "Daily Login", description: "Earn bonus points for streaks." },
    ];
    
    const redeemMethods = [
        { icon: Ticket, title: "Booking Discounts", description: "Redeem 100 RP for a ₹50 discount." },
        { icon: Star, title: "Upgrade Vouchers", description: "Coming soon: Use points for class/room upgrades." },
        { icon: Gift, title: "Partner Offers", description: "Coming soon: Exclusive deals from our partners." },
    ];

    if (loading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-9 w-64" />
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                        <Skeleton className="h-48 w-full" />
                    </div>
                     <div className="md:col-span-2">
                        <Skeleton className="h-80 w-full" />
                    </div>
                </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                 </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                <Trophy className="h-8 w-8 text-primary"/>
                My Rewards
            </h1>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card className="h-full bg-gradient-to-br from-primary to-purple-700 text-primary-foreground">
                        <CardHeader>
                            <CardTitle>Your Points Wallet</CardTitle>
                            <CardDescription className="text-primary-foreground/80">Your available rewards balance.</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                            <p className="text-6xl font-bold">{totalPoints}</p>
                            <p>Reward Points</p>
                        </CardContent>
                    </Card>
                </div>
                 <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest points transactions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Points</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rewardsHistory.length > 0 ? (
                                        rewardsHistory.slice(0, 5).map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>{format(new Date(item.date), 'dd MMM yyyy')}</TableCell>
                                                <TableCell>{item.source}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={item.type === 'earn' ? 'default' : 'destructive'} className={item.type === 'earn' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}>
                                                        {item.type === 'earn' ? `+${item.points}` : item.points}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">No reward activity yet.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
                 <Card>
                    <CardHeader>
                        <CardTitle>How to Earn Points</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {earnMethods.map(method => (
                            <div key={method.title} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <method.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0"/>
                                <div>
                                    <h3 className="font-semibold">{method.title}</h3>
                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>How to Redeem Points</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {redeemMethods.map(method => (
                            <div key={method.title} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                                <method.icon className="h-6 w-6 text-accent mt-1 flex-shrink-0 text-red-500"/>
                                <div>
                                    <h3 className="font-semibold">{method.title}</h3>
                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
