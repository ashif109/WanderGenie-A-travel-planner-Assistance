
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
  preferences: z.string().describe('The user\'s interests and preferences (e.g., historical sites, beaches, nightlife).'),
  duration: z.number().describe('The duration of the trip in days.'),
});
export type GeneratePersonalizedItineraryInput = z.infer<typeof GeneratePersonalizedItineraryInputSchema>;

const ItineraryDaySchema = z.object({
    day: z.string().describe('The day of the itinerary, e.g., "Day 1".'),
    date: z.string().describe('The date for this day of the itinerary in YYYY-MM-DD format. Start from today\'s date.'),
    morning: z.string().describe('Morning (9am-12pm) activities with time blocks, emojis, short description and highlights.'),
    afternoon: z.string().describe('Afternoon (12pm-4pm) activities with time blocks, emojis, short description and highlights.'),
    evening: z.string().describe('Evening (5pm-8pm) activities with time blocks, emojis, short description and highlights.'),
    accommodation: z.string().describe('Stylish name for accommodation and optional highlight.'),
    notes: z.string().describe('Secret spots, photo/selfie tips, local travel hacks, and safety tips.'),
});

const GeneratePersonalizedItineraryOutputSchema = z.object({
  itinerary: z.array(ItineraryDaySchema).describe('A highly aesthetic, stylish, and readable day-by-day travel itinerary.'),
});
export type GeneratePersonalizedItineraryOutput = z.infer<typeof GeneratePersonalizedItineraryOutputSchema>;

export async function generatePersonalizedItinerary(input: GeneratePersonalizedItineraryInput): Promise<GeneratePersonalizedItineraryOutput> {
  return generatePersonalizedItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedItineraryPrompt',
  input: {schema: GeneratePersonalizedItineraryInputSchema},
  output: {schema: GeneratePersonalizedItineraryOutputSchema},
  prompt: `You are an expert travel planner and designer. Transform the user's request into a **highly aesthetic, stylish, and readable day-by-day travel itinerary** that people will actually enjoy reading.

User Request:
- Destination: {{{destination}}}
- Preferences: {{{preferences}}}
- Duration: {{{duration}}} days

Follow these rules strictly:
1.  **Output Format**: Generate a strict JSON array where each object represents a single day. Do not output any text outside of the JSON array.
2.  **JSON Object Structure (per day)**:
    -   \`day\`: (string) "Day X"
    -   \`date\`: (string) "YYYY-MM-DD". Start from today's date.
    -   \`morning\`: (string) Include time blocks (e.g., 9:00-12:00), emojis, short description, and highlight key activities in bold.
    -   \`afternoon\`: (string) Same format as morning.
    -   \`evening\`: (string) Same format as morning.
    -   \`accommodation\`: (string) Provide a stylish name and an optional highlight (e.g., "**The Grand Parisian**, Rooftop view of the Eiffel Tower").
    -   \`notes\`: (string) Include a mix of secret spots, photo/selfie tips, local travel hacks, and safety tips.

3.  **Content Features**:
    -   Break long paragraphs into short, punchy sentences.
    -   Add relevant **emojis** for activities (e.g., 🏰, 🍷, 🖼️, 🛶).
    -   Highlight **must-visit landmarks** in bold.
    -   Include specific **time allocations** for each activity.
    -   Add **offbeat/secret places**, local food/cafe recommendations, and interactive tips (e.g., best photo spots, reservation advice).
    -   Keep the tone **readable and fun**; avoid heavy, dense text.

Example of a single day object:
{
  "day": "Day 1",
  "date": "2025-10-01",
  "morning": "🛫 9:00–12:00: Arrive in Paris, check into **Hotel Le Meurice**. Quick coffee at local café ☕.",
  "afternoon": "🖼️ 12:00–16:00: Explore **Louvre Museum**. Must-see: Mona Lisa, Venus de Milo. Secret tip: Visit Egyptian Antiquities wing first to avoid crowds.",
  "evening": "🌆 17:00–20:00: Stroll **Tuileries Garden**, enjoy sunset at Place de la Concorde. Dinner at Le Fumoir 🍷.",
  "accommodation": "**Hotel Le Meurice**, First Arrondissement",
  "notes": "Take metro line 1 for quick access. Best photo spot: Arc de Triomphe in evening."
}
`,
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
