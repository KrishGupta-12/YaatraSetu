
'use server';
/**
 * @fileOverview A Genkit flow for generating audio from text for the Yatra.ai chatbot.
 *
 * - generateChatbotAudio - The main flow function to handle text-to-speech.
 * - GenerateAudioInput - The input type for the function.
 * - GenerateAudioResponse - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import wav from 'wav';

// Defines the structure for the audio generation input
const GenerateAudioInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  language: z.string().optional().describe('The language of the text (e.g., "English", "Hindi").'),
});
export type GenerateAudioInput = z.infer<typeof GenerateAudioInputSchema>;

// Defines the structure for the audio generation response
const GenerateAudioResponseSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI in WAV format.'),
});
export type GenerateAudioResponse = z.infer<typeof GenerateAudioResponseSchema>;

// This is the exported function that the client-side will call
export async function generateChatbotAudio(input: GenerateAudioInput): Promise<GenerateAudioResponse> {
  return generateAudioFlow(input);
}

// Function to convert PCM buffer to WAV base64 string
async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.write(pcmData);
    writer.end();
  });
}

const generateAudioFlow = ai.defineFlow(
  {
    name: 'generateChatbotAudioFlow',
    inputSchema: GenerateAudioInputSchema,
    outputSchema: GenerateAudioResponseSchema,
  },
  async ({ text, language }) => {
    
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Prebuilt voices are language-agnostic
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No media was returned from the TTS model.');
    }

    // The audio data is a base64 string in a data URI, we need to extract it
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    
    // Convert the raw PCM audio buffer to WAV format
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
