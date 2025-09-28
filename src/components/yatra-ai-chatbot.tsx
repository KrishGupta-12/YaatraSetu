
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Loader2, Send, Languages, Volume2 } from "lucide-react";
import { YatraSetuLogo } from "./icons";
import { yatraChatbot, type ChatMessage } from "@/ai/flows/yatra-chatbot";
import { generateChatbotAudio } from "@/ai/flows/generate-chatbot-audio";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

const languages = [
    { value: "English", label: "English" },
    { value: "Hindi", label: "हिन्दी (Hindi)" },
    { value: "Tamil", label: "தமிழ் (Tamil)" },
    { value: "Bengali", label: "বাংলা (Bengali)" },
    { value: "Marathi", label: "मराठी (Marathi)" },
    { value: "Telugu", label: "తెలుగు (Telugu)" },
    { value: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
    { value: "Gujarati", label: "ગુજરાતી (Gujarati)" },
    { value: "Malayalam", label: "മലയാളം (Malayalam)" },
    { value: "Punjabi", label: "ਪੰਜਾਬੀ (Punjabi)" },
];

export function YatraAIChatbot() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("English");
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "model", content: "Hello! I am Yatra.ai. How can I help you plan your travel in India today?" },
    ]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

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
            const textResponse = await yatraChatbot({
                userId: user?.uid,
                history: messages,
                message: input,
                language: language
            });
            const modelMessage: ChatMessage = { role: "model", content: textResponse.response };
            setMessages(prev => [...prev, modelMessage]);
            
            // Generate and play audio
            const audioResponse = await generateChatbotAudio({ text: textResponse.response, language });
            if (audioResponse.audioDataUri && audioRef.current) {
                audioRef.current.src = audioResponse.audioDataUri;
                audioRef.current.play();
            }

        } catch (error) {
            console.error("Chatbot error:", error);
            const errorMessage: ChatMessage = { role: "model", content: "I'm sorry, something went wrong. Please try again." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };
    
    const replayAudio = async (text: string) => {
        try {
            setLoading(true);
            const audioResponse = await generateChatbotAudio({ text, language });
            if (audioResponse.audioDataUri && audioRef.current) {
                audioRef.current.src = audioResponse.audioDataUri;
                audioRef.current.play();
            }
        } catch(error) {
            console.error("Audio replay error:", error);
        } finally {
            setLoading(false);
        }
    }

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
                                    {languages.map(lang => (
                                        <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                    ))}
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
                                        "max-w-[75%] rounded-lg px-3 py-2 text-sm relative group",
                                        message.role === 'user'
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted"
                                    )}>
                                        {message.content}
                                        {message.role === 'model' && (
                                            <Button size="icon" variant="ghost" className="absolute -right-8 top-0 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => replayAudio(message.content)}>
                                                <Volume2 className="h-4 w-4"/>
                                            </Button>
                                        )}
                                    </div>
                                     {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
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
            <audio ref={audioRef} className="hidden" />
        </>
    );
}
