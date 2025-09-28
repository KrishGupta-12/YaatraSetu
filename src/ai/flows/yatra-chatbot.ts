
'use server';
/**
 * @fileOverview A Genkit flow for the Yatra.ai chatbot.
 *
 * - yatraChatbot - The main flow function to handle chat messages.
 * - YatraChatbotInput - The input type for the yatraChatbot function.
 * - YatraChatbotResponse - The return type for the yatraChatbot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { logChatbotConversation } from '@/lib/firebase/firestore';

// Defines a single message in the chat history
const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Defines the structure for the chatbot input
const YatraChatbotInputSchema = z.object({
  userId: z.string().optional().describe('The user ID for logging purposes.'),
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
  message: z.string().describe('The latest message from the user.'),
  language: z.string().default('English').describe('The language for the conversation.'),
});
export type YatraChatbotInput = z.infer<typeof YatraChatbotInputSchema>;

// Defines the structure for the chatbot response
const YatraChatbotResponseSchema = z.object({
  response: z.string().describe('The AI model\'s response to the user.'),
});
export type YatraChatbotResponse = z.infer<typeof YatraChatbotResponseSchema>;

// This is the exported function that the client-side will call
export async function yatraChatbot(input: YatraChatbotInput): Promise<YatraChatbotResponse> {
  return yatraChatbotFlow(input);
}

// System prompt defining the chatbot's persona and capabilities
const systemPrompt = `You are Yatra.ai, a friendly and expert travel assistant for the YatraSetu web application. Your goal is to help users plan and manage their travel across India.

You are integrated into the YatraSetu platform, which offers the following services:
- **Train Booking**: Search, book, and check PNR status.
- **Hotel Booking**: Find and book hotels with various filters.
- **Food Ordering**: Order food to be delivered to the train seat.
- **AI Journey Planner**: Get a complete travel itinerary based on preferences.
- **Tatkal Automation**: An automated service to book last-minute Tatkal tickets.
- **Waitlist Prediction**: Predicts the confirmation chances of a waitlisted ticket.

Your primary capabilities are:
1.  **Answering Questions**: Answer user questions about YatraSetu's features, Indian travel, popular destinations, train routes, and travel tips.
2.  **Guiding Users**: Help users navigate the YatraSetu app by explaining where to find features (e.g., "You can book hotels by clicking on the 'Hotel Booking' section in the sidebar.").
3.  **Providing Travel Information**: Offer general travel advice for India, such as best times to visit, what to pack, or details about specific tourist spots.
4.  **Multi-language Support**: You MUST respond in the language specified by the user.

**Current Language for this conversation: {{{language}}}**

Do not make up features that don't exist. Be helpful, concise, and friendly.
`;

const yatraChatbotFlow = ai.defineFlow(
  {
    name: 'yatraChatbotFlow',
    inputSchema: YatraChatbotInputSchema,
    outputSchema: YatraChatbotResponseSchema,
  },
  async ({ userId, history, message, language }) => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      history: history.map(msg => ({...msg, parts: [{text: msg.content}]})),
      prompt: message,
      system: systemPrompt.replace('{{{language}}}', language),
      config: {
        // Lower temperature for more factual, less creative responses
        temperature: 0.3,
      },
    });
    
    const responseText = output?.text || "I'm sorry, I couldn't process that. Please try again.";

    // Log the conversation asynchronously
    if (userId) {
       const updatedHistory = [...history, { role: 'user' as const, content: message}, { role: 'model' as const, content: responseText }];
       await logChatbotConversation(userId, updatedHistory, language);
    }

    return { response: responseText };
  }
);
