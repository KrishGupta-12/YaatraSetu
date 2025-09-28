
'use server';
/**
 * @fileOverview A Genkit flow for handling contact form submissions.
 *
 * - sendContactEmail - The main flow function to handle the form data.
 * - ContactFormInput - The input type for the sendContactEmail function.
 * - ContactFormResponse - The return type for the sendContactEmail function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Defines the structure for the contact form input
const ContactFormInputSchema = z.object({
  name: z.string().describe('The name of the person sending the message.'),
  email: z.string().email().describe('The email address of the sender.'),
  subject: z.string().describe('The subject of the message.'),
  message: z.string().describe('The content of the message.'),
});
export type ContactFormInput = z.infer<typeof ContactFormInputSchema>;

// Defines the structure for the response
const ContactFormResponseSchema = z.object({
  success: z.boolean().describe('Whether the email was successfully processed.'),
  message: z.string().describe('A message indicating the status.'),
});
export type ContactFormResponse = z.infer<typeof ContactFormResponseSchema>;

// This is the exported function that the client-side will call
export async function sendContactEmail(input: ContactFormInput): Promise<ContactFormResponse> {
  return sendContactEmailFlow(input);
}

/**
 * This Genkit flow simulates sending an email from the contact form.
 * In a real-world application, this would integrate with an email sending service
 * like SendGrid, Mailgun, or Firebase Extensions for email.
 *
 * For this demo, we will simply log the content to the console as if it were sent.
 */
const sendContactEmailFlow = ai.defineFlow(
  {
    name: 'sendContactEmailFlow',
    inputSchema: ContactFormInputSchema,
    outputSchema: ContactFormResponseSchema,
  },
  async (formData) => {
    console.log('New contact form submission received:');
    console.log(`- From: ${formData.name} <${formData.email}>`);
    console.log(`- Subject: ${formData.subject}`);
    console.log(`- Message: ${formData.message}`);

    // Here you would add your email sending logic.
    // Example using a hypothetical email service:
    //
    // try {
    //   await emailService.send({
    //     to: 'krishgupta200510@gmail.com',
    //     from: 'contact-form@yatrasetu.app',
    //     replyTo: formData.email,
    //     subject: `New YatraSetu Contact: ${formData.subject}`,
    //     text: `You have a new message from ${formData.name}:\n\n${formData.message}`,
    //   });
    //   return { success: true, message: 'Email sent successfully.' };
    // } catch (error) {
    //   console.error("Failed to send email:", error);
    //   throw new Error("Could not send email due to a backend error.");
    // }

    // Simulating a successful operation for now.
    return {
      success: true,
      message: 'Contact form data has been successfully processed by the backend.',
    };
  }
);
