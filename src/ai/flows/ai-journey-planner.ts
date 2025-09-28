'use server';

/**
 * @fileOverview An AI journey planner that suggests train routes, hotels, and food options.
 *
 * - aiJourneyPlanner - A function that handles the journey planning process.
 * - AIJourneyPlannerInput - The input type for the aiJourneyPlanner function.
 * - AIJourneyPlannerOutput - The return type for the aiJourneyPlanner function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIJourneyPlannerInputSchema = z.object({
  departureLocation: z.string().describe('The starting location of the journey.'),
  destinationLocation: z.string().describe('The destination location of the journey.'),
  departureDate: z.string().describe('The desired departure date (YYYY-MM-DD).'),
  budget: z.string().describe('The budget for the entire journey (e.g., "low", "medium", "high").'),
  preferredClass: z.string().describe('The preferred class of travel (e.g., "sleeper", "AC", "first class").'),
  dietaryRestrictions: z.string().describe('Any dietary restrictions (e.g., "vegetarian", "vegan", "halal").'),
});
export type AIJourneyPlannerInput = z.infer<typeof AIJourneyPlannerInputSchema>;

const AIJourneyPlannerOutputSchema = z.object({
  trainRoutes: z.array(z.string()).describe('Suggested train routes with train numbers and timings.'),
  hotelOptions: z.array(z.string()).describe('Suggested hotel options with prices and ratings.'),
  foodOptions: z.array(z.string()).describe('Suggested food options at various stations or locations.'),
  totalEstimatedCost: z.string().describe('The total estimated cost of the journey.'),
});
export type AIJourneyPlannerOutput = z.infer<typeof AIJourneyPlannerOutputSchema>;

export async function aiJourneyPlanner(input: AIJourneyPlannerInput): Promise<AIJourneyPlannerOutput> {
  return aiJourneyPlannerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiJourneyPlannerPrompt',
  input: {schema: AIJourneyPlannerInputSchema},
  output: {schema: AIJourneyPlannerOutputSchema},
  prompt: `You are an AI travel assistant specializing in planning journeys within India. 

  Based on the user's preferences and real-time data, suggest optimal train routes, hotel options, and food choices for their journey.  Consider budget, preferred class of travel, and dietary restrictions.

  Departure Location: {{{departureLocation}}}
  Destination Location: {{{destinationLocation}}}
  Departure Date: {{{departureDate}}}
  Budget: {{{budget}}}
  Preferred Class: {{{preferredClass}}}
  Dietary Restrictions: {{{dietaryRestrictions}}}

  Provide train routes, hotel options, and food options, and provide the total estimated cost of the journey.
  `,
});

const aiJourneyPlannerFlow = ai.defineFlow(
  {
    name: 'aiJourneyPlannerFlow',
    inputSchema: AIJourneyPlannerInputSchema,
    outputSchema: AIJourneyPlannerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
