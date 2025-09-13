// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates a personalized travel itinerary based on destination and preferences.
 *
 * - generatePersonalizedItinerary - A function that handles the itinerary generation process.
 * - GeneratePersonalizedItineraryInput - The input type for the generatePersonalizedItinerary function.
 * - GeneratePersonalizedItineraryOutput - The return type for the generatePersonalizedItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedItineraryInputSchema = z.object({
  destination: z.string().describe('The desired travel destination.'),
  preferences: z.string().describe('The user\u0027s interests and preferences (e.g., historical sites, beaches, nightlife).'),
  duration: z.number().describe('The duration of the trip in days.'),
});
export type GeneratePersonalizedItineraryInput = z.infer<typeof GeneratePersonalizedItineraryInputSchema>;

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itinerary: z.string().describe('A step-by-step travel itinerary.'),
});
export type GeneratePersonalizedItineraryOutput = z.infer<typeof GeneratePersonalizedItineraryOutputSchema>;

export async function generatePersonalizedItinerary(input: GeneratePersonalizedItineraryInput): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedItineraryPrompt',
  input: {schema: GeneratePersonalizedItineraryInputSchema},
  output: {schema: GeneratePersonalizedItineraryOutputSchema},
  prompt: `You are a travel expert. Generate a personalized travel itinerary for the user based on the following information:

Destination: {{{destination}}}
Preferences: {{{preferences}}}
Duration: {{{duration}}} days

Provide a detailed, step-by-step itinerary.`,
});

const generatePersonalizedItineraryFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedItineraryFlow',
    inputSchema: GeneratePersonalizedItineraryInputSchema,
    outputSchema: GeneratePersonalizedItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
