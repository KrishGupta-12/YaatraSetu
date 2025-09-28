"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, CalendarIcon, Loader2, TicketPercent } from "lucide-react";

import {
  predictConfirmationChance,
  type WaitlistPredictionInput,
  type WaitlistPredictionOutput,
} from "@/ai/flows/waitlist-prediction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  trainNumber: z.string().min(5, "A valid 5-digit train number is required."),
  bookingDate: z.date({ required_error: "A booking date is required." }),
  fromStation: z.string().min(2, "Departure station is required."),
  toStation: z.string().min(2, "Destination is required."),
  waitlistNumber: z.coerce.number().min(1, "Waitlist number must be at least 1."),
  travelClass: z.string({ required_error: "Please select a travel class."}),
});

type FormData = z.infer<typeof formSchema>;

export default function WaitlistPredictionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WaitlistPredictionOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const input: WaitlistPredictionInput = {
        ...data,
        bookingDate: format(data.bookingDate, "yyyy-MM-dd"),
      };
      const response = await predictConfirmationChance(input);
      setResult(response);
    } catch (error) {
      console.error("Waitlist Prediction Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to predict confirmation chance. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><TicketPercent className="h-6 w-6" /> Waitlist Prediction</CardTitle>
            <CardDescription>
              Enter your ticket details to predict the confirmation probability.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="trainNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Train Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 12951" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="bookingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Journey</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="fromStation"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., BCT" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="toStation"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., NDLS" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <FormField
                  control={form.control}
                  name="waitlistNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Waitlist Number</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="travelClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select travel class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sleeper">Sleeper (SL)</SelectItem>
                          <SelectItem value="AC 3 Tier">AC 3 Tier (3A)</SelectItem>
                          <SelectItem value="AC 2 Tier">AC 2 Tier (2A)</SelectItem>
                          <SelectItem value="AC First Class">AC First Class (1A)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Predicting..." : "Predict Confirmation"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border border-dashed p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h2 className="text-xl font-semibold">Analyzing Historical Data</h2>
            <p className="text-muted-foreground">Our AI is checking the odds. This shouldn't take long...</p>
          </div>
        )}
        {result && (
          <Card className="bg-white/50">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-2xl">Prediction Result</CardTitle>
              <CardDescription>
                Based on historical data for Train {form.getValues("trainNumber")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
                <div>
                    <p className="text-muted-foreground">Confirmation Chance</p>
                    <p className="text-6xl font-bold text-primary">
                        {Math.round(result.confirmationChance * 100)}%
                    </p>
                </div>
                <Progress value={result.confirmationChance * 100} className="w-full" />
                <div className="text-left bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><Bot className="h-5 w-5"/> AI Analysis</h4>
                    <p className="text-sm text-muted-foreground">{result.reason}</p>
                </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground text-center w-full">Disclaimer: This is an AI-powered prediction based on historical trends and does not guarantee confirmation. Final confirmation depends on real-time cancellations.</p>
            </CardFooter>
          </Card>
        )}
        {!loading && !result && (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border border-dashed p-8 text-center bg-card">
                <TicketPercent className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold">Anxious about your waitlisted ticket?</h2>
                <p className="text-muted-foreground">Get an AI-powered prediction of your confirmation chances here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
