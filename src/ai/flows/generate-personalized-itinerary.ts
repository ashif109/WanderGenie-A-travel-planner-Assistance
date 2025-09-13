
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
  budget: z.enum(['budget-friendly', 'balanced', 'luxury']).describe('The user\'s budget preference for the trip.'),
  isSoloFemaleTraveler: z.boolean().describe('Whether the user is a solo female traveler seeking safety-conscious recommendations.'),
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
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert travel planner and designer. Transform the user's request into a **highly aesthetic, stylish, and readable day-by-day travel itinerary** that people will actually enjoy reading.

User Request:
- Destination: {{{destination}}}
- Preferences: {{{preferences}}}
- Duration: {{{duration}}} days
- Budget: {{{budget}}}
{{#if isSoloFemaleTraveler}}
- **Special Consideration**: User is a **Solo Female Traveler**. Prioritize safety above all else.
{{/if}}

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
    -   **Tailor all recommendations** (activities, food, accommodation) to the specified **budget**. For 'budget-friendly', suggest free activities, street food, and hostels. For 'luxury', suggest private tours, fine dining, and 5-star hotels. 'Balanced' should be a mix.

{{#if isSoloFemaleTraveler}}
4.  **WOMEN SAFETY RULES (CRITICAL):**
    -   **Accommodation**: ONLY recommend hotels/hostels in well-lit, central, and reputable neighborhoods known for safety. Mention why the area is safe.
    -   **Activities & Timing**: Prioritize daytime activities. For evening activities, suggest group tours, well-populated areas, or early evening plans. Avoid suggesting late-night solo wandering or clubs in dubious areas.
    -   **Transportation**: Recommend trusted taxi apps (like Uber/Lyft if available, or a specific local equivalent), and public transport options known for being safe.
    -   **Notes & Tips**: This is the most important section for safety. Each day's \`notes\` MUST include:
        -   Local emergency number (e.g., Police: 112).
        -   A specific, practical safety tip (e.g., "Always share your live location with a friend," "Be aware of your surroundings in crowded markets," "Opt for pre-booked taxis at night instead of hailing one.").
        -   Advice on cultural etiquette or dress code if relevant to safety.
{{/if}}

Example of a single day object for a standard user:
{
  "day": "Day 1",
  "date": "2025-10-01",
  "morning": "🛫 9:00–12:00: Arrive in Paris, check into **Hotel Le Meurice**. Quick coffee at local café ☕.",
  "afternoon": "🖼️ 12:00–16:00: Explore **Louvre Museum**. Must-see: Mona Lisa, Venus de Milo. Secret tip: Visit Egyptian Antiquities wing first to avoid crowds.",
  "evening": "🌆 17:00–20:00: Stroll **Tuileries Garden**, enjoy sunset at Place de la Concorde. Dinner at Le Fumoir 🍷.",
  "accommodation": "**Hotel Le Meurice**, First Arrondissement",
  "notes": "Take metro line 1 for quick access. Best photo spot: Arc de Triomphe in evening."
}

Example of a single day object for a SOLO FEMALE TRAVELER:
{
  "day": "Day 1",
  "date": "2025-10-01",
  "morning": "🛫 9:00–12:00: Arrive in Paris (CDG), take an official taxi to **Hotel Adèle & Jules** in the safe 9th Arr. Settle in with a coffee ☕.",
  "afternoon": "🖼️ 12:00–16:00: Explore the charming **Le Marais district**. Lots of boutiques and cafes. It's a very walkable and busy area, great for solo exploration.",
  "evening": "🌆 17:00–19:30: Early evening visit to **Montmartre & Sacré-Cœur**. Stick to the main streets as it gets dark. Dinner at a well-reviewed restaurant like 'La Boîte aux Lettres'.",
  "accommodation": "**Hotel Adèle & Jules**, 9th Arr. - Known for its safe, central location.",
  "notes": "Emergency: 112. Use the 'G7 Taxi' app for reliable transport. For evenings, pre-book your restaurant and let someone know your plans. Best photo spot: Place du Tertre in Montmartre during the day."
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
