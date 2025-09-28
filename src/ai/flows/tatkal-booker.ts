
'use server';
/**
 * @fileOverview A Genkit flow for automating Tatkal train ticket bookings.
 *
 * - tatkalBookerFlow - The main flow function to handle the booking request.
 * - TatkalBookingRequest - The input type for the tatkalBookerFlow function.
 * - TatkalBookingResponse - The return type for the tatkalBookerFlow function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

// Defines the structure for a single passenger
const PassengerSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  gender: z.string(),
  // idType and idNumber from profile are not needed here for the booking request itself
});

// Defines the structure for the Tatkal booking request
const TatkalBookingRequestSchema = z.object({
  userId: z.string().describe('The unique ID of the user requesting the booking.'),
  journeyDetails: z.object({
    trainNumber: z.string().describe('The 5-digit train number.'),
    journeyDate: z.string().describe('Date of journey in YYYY-MM-DD format.'),
    fromStationCode: z.string().describe('The source station code (e.g., BCT).'),
    toStationCode: z.string().describe('The destination station code (e.g., NDLS).'),
    bookingClass: z.string().describe('The travel class (e.g., 3A, SL).'),
    berthPreference: z.string().describe('The preferred berth (e.g., lower, any).'),
  }),
  passengers: z.array(PassengerSchema).min(1).max(4).describe('An array of passenger details.'),
  paymentDetails: z.object({
    upiId: z.string().describe('The UPI ID for payment.'),
    autoPay: z.boolean().describe('Whether auto-pay is enabled.'),
  }),
});
export type TatkalBookingRequest = z.infer<typeof TatkalBookingRequestSchema>;

// Defines the structure for the response of the booking flow
const TatkalBookingResponseSchema = z.object({
  success: z.boolean().describe('Whether the automation was successfully scheduled.'),
  message: z.string().describe('A message indicating the status of the scheduling.'),
  bookingId: z.string().optional().describe('The unique ID for this booking attempt.'),
});
export type TatkalBookingResponse = z.infer<typeof TatkalBookingResponseSchema>;

// The exported function that the client-side will call
export async function tatkalBookerFlow(input: TatkalBookingRequest): Promise<TatkalBookingResponse> {
  return bookTatkalTicket(input);
}


/**
 * This is the main Genkit flow for Tatkal booking.
 * In a real application, this flow would be deployed as a Cloud Function
 * and triggered by a scheduler (e.g., Cloud Scheduler) at the exact Tatkal opening time.
 * For this simulation, we'll just log the request and save it to Firestore.
 */
const bookTatkalTicket = ai.defineFlow(
  {
    name: 'bookTatkalTicket',
    inputSchema: TatkalBookingRequestSchema,
    outputSchema: TatkalBookingResponseSchema,
  },
  async (request) => {
    console.log('Tatkal booking request received:', JSON.stringify(request, null, 2));
    
    // In a real implementation, you would add logic here to:
    // 1. Validate the user's session and payment details.
    // 2. Determine the exact Tatkal opening time (10:00 AM for AC, 11:00 AM for Sleeper).
    // 3. Schedule this flow to run at that precise moment using a task queue or scheduler.
    // 4. When triggered, connect to the IRCTC website/API using a browser automation tool (like Puppeteer) or direct API calls.
    // 5. Fill in all the details rapidly.
    // 6. Process the payment.
    // 7. Send a notification (push/email) back to the user with the result.

    // For now, we will simulate this by saving the request to Firestore.
    // This demonstrates that the backend has received the data.
    const bookingId = `tatkal_${request.userId}_${Date.now()}`;
    const bookingRef = doc(db, 'tatkal_requests', bookingId);
    
    try {
      await setDoc(bookingRef, {
        ...request,
        status: 'SCHEDULED',
        createdAt: new Date().toISOString(),
      });
      
      console.log(`Tatkal request ${bookingId} has been successfully scheduled.`);

      // Simulate a successful scheduling.
      return {
        success: true,
        message: `Tatkal automation has been successfully scheduled. We will attempt to book your ticket for train ${request.journeyDetails.trainNumber}.`,
        bookingId: bookingId,
      };

    } catch (error) {
       console.error("Failed to save Tatkal request to Firestore:", error);
       return {
        success: false,
        message: 'Failed to schedule the Tatkal automation in the backend.',
       }
    }
  }
);

    
