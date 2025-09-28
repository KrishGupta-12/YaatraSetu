'use server';

/**
 * @fileOverview Predicts the likelihood of train ticket confirmation based on historical data.
 *
 * - predictConfirmationChance - Predicts the confirmation chance of a waitlisted train ticket.
 * - WaitlistPredictionInput - The input type for the predictConfirmationChance function.
 * - WaitlistPredictionOutput - The return type for the predictConfirmationChance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WaitlistPredictionInputSchema = z.object({
  trainNumber: z.string().describe('The train number.'),
  bookingDate: z.string().describe('The date for which the ticket is booked (YYYY-MM-DD).'),
  fromStation: z.string().describe('The departure station.'),
  toStation: z.string().describe('The destination station.'),
  waitlistNumber: z.number().describe('The current waitlist number.'),
  travelClass: z.string().describe('The travel class (e.g., Sleeper, AC 3 Tier).'),
});
export type WaitlistPredictionInput = z.infer<typeof WaitlistPredictionInputSchema>;

const WaitlistPredictionOutputSchema = z.object({
  confirmationChance: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'The predicted chance of confirmation, ranging from 0 (unlikely) to 1 (highly likely).' /* was "The predicted chance of confirmation (0-100)." */
    ),
  reason: z.string().describe('The reason for the predicted confirmation chance.'),
});
export type WaitlistPredictionOutput = z.infer<typeof WaitlistPredictionOutputSchema>;

export async function predictConfirmationChance(
  input: WaitlistPredictionInput
): Promise<WaitlistPredictionOutput> {
  return waitlistPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'waitlistPredictionPrompt',
  input: {schema: WaitlistPredictionInputSchema},
  output: {schema: WaitlistPredictionOutputSchema},
  prompt: `You are an AI assistant that predicts the likelihood of a train ticket getting confirmed, given the train number, booking date, from and to stations, current waitlist number, and travel class.

  Provide a confirmationChance as a number between 0 and 1.
  Justify your prediction with a reason based on historical trends, booking date, waitlist number, and travel class.

  Train Number: {{{trainNumber}}}
  Booking Date: {{{bookingDate}}}
  From Station: {{{fromStation}}}
  To Station: {{{toStation}}}
  Waitlist Number: {{{waitlistNumber}}}
  Travel Class: {{{travelClass}}}`,
});

const waitlistPredictionFlow = ai.defineFlow(
  {
    name: 'waitlistPredictionFlow',
    inputSchema: WaitlistPredictionInputSchema,
    outputSchema: WaitlistPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
