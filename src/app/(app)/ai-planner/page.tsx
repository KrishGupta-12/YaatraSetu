"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, CalendarIcon, Loader2, LocateFixed, MapPin, Milestone, Utensils, Wallet } from "lucide-react";

import {
  aiJourneyPlanner,
  type AIJourneyPlannerInput,
  type AIJourneyPlannerOutput,
} from "@/ai/flows/ai-journey-planner";
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
  FormDescription,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  departureLocation: z.string().min(2, "Departure location is required."),
  destinationLocation: z.string().min(2, "Destination is required."),
  departureDate: z.date({ required_error: "A departure date is required." }),
  budget: z.enum(["low", "medium", "high"]),
  preferredClass: z.enum(["sleeper", "AC", "first class"]),
  dietaryRestrictions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AIPlannerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIJourneyPlannerOutput | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      departureLocation: "",
      destinationLocation: "",
      budget: "medium",
      preferredClass: "AC",
      dietaryRestrictions: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    setResult(null);
    try {
      const input: AIJourneyPlannerInput = {
        ...data,
        departureDate: format(data.departureDate, "yyyy-MM-dd"),
      };
      const response = await aiJourneyPlanner(input);
      setResult(response);
    } catch (error) {
      console.error("AI Journey Planner Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a travel plan. Please try again.",
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
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Bot className="h-6 w-6" /> AI Journey Planner</CardTitle>
            <CardDescription>
              Fill in your travel details, and let our AI craft the perfect journey for you.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destinationLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., New Delhi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Departure Date</FormLabel>
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
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your budget" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Class</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred class" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sleeper">Sleeper</SelectItem>
                          <SelectItem value="AC">AC</SelectItem>
                          <SelectItem value="first class">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Needs (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Vegetarian, Vegan" {...field} />
                      </FormControl>
                       <FormDescription>
                        Helps in suggesting food options.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Generating Plan..." : "Plan My Journey"}
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
            <h2 className="text-xl font-semibold">Generating Your Itinerary</h2>
            <p className="text-muted-foreground">Our AI is hard at work. This may take a moment...</p>
          </div>
        )}
        {result && (
          <Card className="bg-white/50">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your AI-Generated Itinerary</CardTitle>
              <CardDescription>
                From {form.getValues("departureLocation")} to {form.getValues("destinationLocation")} on {format(form.getValues("departureDate"), "PPP")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Milestone className="h-5 w-5 text-primary" /> Train Routes</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {result.trainRoutes.map((route, i) => <li key={i}>{route}</li>)}
                </ul>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><LocateFixed className="h-5 w-5 text-primary" /> Hotel Options</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {result.hotelOptions.map((hotel, i) => <li key={i}>{hotel}</li>)}
                </ul>
              </div>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2"><Utensils className="h-5 w-5 text-primary" /> Food Options</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {result.foodOptions.map((food, i) => <li key={i}>{food}</li>)}
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Alert>
                <Wallet className="h-4 w-4" />
                <AlertTitle>Total Estimated Cost</AlertTitle>
                <AlertDescription className="font-bold text-lg text-primary">
                    {result.totalEstimatedCost}
                </AlertDescription>
              </Alert>
            </CardFooter>
          </Card>
        )}
        {!loading && !result && (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border border-dashed p-8 text-center bg-card">
                <Bot className="h-12 w-12 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold">Ready for an adventure?</h2>
                <p className="text-muted-foreground">Your personalized travel plan will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
}
