
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { YaatraSetuLogo } from "@/components/icons";
import { useAdminAuth } from "../layout";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

type FormData = z.infer<typeof formSchema>;

const ADMIN_USERS = {
    "admin@yaatrasetu.com": "admin123",
    "Krish@yaatrasetu.com": "Krish@9885"
}

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setIsAdmin } = useAdminAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const expectedPassword = ADMIN_USERS[data.email as keyof typeof ADMIN_USERS];

    if (expectedPassword && data.password === expectedPassword) {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsAdmin(true);
        toast({ title: "Login Successful", description: "Welcome, Admin!" });
        router.push("/admin/dashboard");
    } else {
        toast({ variant: "destructive", title: "Login Failed", description: "Invalid email or password." });
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <YaatraSetuLogo className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">Admin Panel</CardTitle>
          <CardDescription>
            Please login to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@yaatrasetu.com" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    