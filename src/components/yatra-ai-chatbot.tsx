
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2, Send, Languages } from "lucide-react";
import { YatraSetuLogo } from "./icons";
import { yatraChatbot, type ChatMessage } from "@/ai/flows/yatra-chatbot";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";

export function YatraAIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("English");
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "model", content: "Hello! I am Yatra.ai. How can I help you plan your travel in India today?" },
    ]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const response = await yatraChatbot({
                history: messages,
                message: input,
                language: language
            });
            const modelMessage: ChatMessage = { role: "model", content: response.response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = { role: "model", content: "I'm sorry, something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                size="icon"
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
                onClick={() => setIsOpen(true)}
            >
                <Bot className="h-8 w-8" />
                <span className="sr-only">Open Yatra.ai Chat</span>
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px] md:max-w-[600px] grid-rows-[auto_1fr_auto] p-0 h-[80vh] max-h-[700px]">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="flex items-center gap-2">
                           <YatraSetuLogo className="h-6 w-6 text-primary"/> Yatra.ai Chat
                        </DialogTitle>
                         <div className="flex items-center space-x-2 pt-2">
                            <Languages className="h-4 w-4 text-muted-foreground" />
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-[180px] h-8 text-xs">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="English">English</SelectItem>
                                    <SelectItem value="Hindi">हिन्दी (Hindi)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </DialogHeader>
                    <ScrollArea className="p-4" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div key={index} className={cn(
                                    "flex items-end gap-2",
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}>
                                    {message.role === 'model' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn(
                                        "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                                        message.role === 'user'
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}>
                                        {message.content}
                                    </div>
                                     {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex items-end gap-2 justify-start">
                                     <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-lg px-3 py-2 flex items-center">
                                         <Loader2 className="h-5 w-5 animate-spin"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-4 border-t">
                        <div className="flex w-full items-center space-x-2">
                            <Input
                                placeholder="Ask about your travel plans..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                disabled={loading}
                            />
                            <Button onClick={handleSend} disabled={loading}>
                                <Send className="h-4 w-4" />
                                <span className="sr-only">Send</span>
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
