
"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Loader2, Send, CheckCircle, Info } from "lucide-react";
import { sendContactEmail } from "@/ai/flows/send-contact-email";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("A valid email is required."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(20, "Message must be at least 20 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      await sendContactEmail(data);
      setSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
    } catch (error) {
      console.error("Contact form error:", error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Could not send your message. Please try again or use the email provided.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <CheckCircle className="h-20 w-20 text-green-500 mb-6"/>
        <h1 className="text-3xl font-bold font-headline mb-2">Message Sent Successfully!</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Thank you for reaching out. Our team has received your message and will get back to you as soon as possible.
        </p>
        <Button onClick={() => { setSubmitted(false); form.reset(); }}>Send Another Message</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Mail className="h-16 w-16 mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold font-headline">Contact Us</h1>
        <p className="text-lg text-muted-foreground mt-4">
          Have a question, feedback, or need support? Drop us a line.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We typically respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your Name" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="subject" render={({ field }) => (
                    <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="What is your message about?" {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea rows={6} placeholder="Write your message here..." {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <Button type="submit" disabled={loading} size="lg">
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Alternative Contact</AlertTitle>
                <AlertDescription className="space-y-2">
                    <p>For urgent issues, you can email us directly:</p>
                    <a href="mailto:krishgupta200510@gmail.com" className="font-semibold text-primary hover:underline">
                        krishgupta200510@gmail.com
                    </a>
                </AlertDescription>
            </Alert>
        </div>
      </div>
    </div>
  );
}
