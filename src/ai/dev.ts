import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-reviews.ts';
import '@/ai/flows/ai-journey-planner.ts';
import '@/ai/flows/waitlist-prediction.ts';
import '@/ai/flows/tatkal-booker.ts';
import '@/ai/flows/send-contact-email.ts';
import '@/ai/flows/yatra-chatbot.ts';
