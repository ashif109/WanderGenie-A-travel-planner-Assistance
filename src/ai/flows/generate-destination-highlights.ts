
'use server';

/**
 * @fileOverview Generates detailed highlights for a travel destination.
 *
 * - generateDestinationHighlights - A function that fetches tourist spots, regional info, and safety scores.
 * - GenerateDestinationHighlightsInput - The input type for the function.
 * - GenerateDestinationHighlightsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TouristSpotSchema = z.object({
  name: z.string().describe('The name of the tourist spot.'),
  description: z.string().describe('A brief, engaging description of the spot.'),
  googleMaps360Url: z.string().url().describe('A direct URL to a Google Maps 360-degree street view of the location.'),
  safetyScore: z.number().min(0).max(100).describe('A safety percentage for female travelers, based on available data and general reputation (0-100).'),
  safetyJustification: z.string().describe('A brief explanation for the assigned safety score.'),
});

const RegionalHighlightSchema = z.object({
    regionName: z.string().describe("The name of the state or region within the country."),
    famousFoods: z.array(z.string()).describe("A list of famous local foods or dishes."),
    famousApparel: z.array(z.string()).describe("A list of traditional or famous clothing items."),
    otherHighlights: z.array(z.string()).describe("A list of other unique cultural highlights or famous things.")
});

const GenerateDestinationHighlightsInputSchema = z.object({
  destination: z.string().describe('The desired travel destination country (e.g., "Japan", "Brazil").'),
});

const GenerateDestinationHighlightsOutputSchema = z.object({
  touristSpots: z.array(TouristSpotSchema).describe('A list of top tourist spots in the destination.'),
  regionalHighlights: z.array(RegionalHighlightSchema).describe("A list of highlights for different regions within the country.")
});

export type GenerateDestinationHighlightsInput = z.infer<typeof GenerateDestinationHighlightsInputSchema>;
export type GenerateDestinationHighlightsOutput = z.infer<typeof GenerateDestinationHighlightsOutputSchema>;

export async function generateDestinationHighlights(input: GenerateDestinationHighlightsInput): Promise<GenerateDestinationHighlightsOutput> {
  return generateDestinationHighlightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDestinationHighlightsPrompt',
  input: {schema: GenerateDestinationHighlightsInputSchema},
  output: {schema: GenerateDestinationHighlightsOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert travel researcher and data analyst. For the given destination, provide a detailed and structured list of tourist attractions and regional highlights.

Destination: {{{destination}}}

Follow these rules strictly:

1.  **Tourist Spots**:
    *   Identify 5-7 major tourist attractions.
    *   For each spot, provide a concise and appealing description.
    *   **Crucially**, find and provide a valid, direct URL to a Google Maps 360-degree Street View or Photo Sphere for that exact location. The URL must start with "https://www.google.com/maps?".
    *   Provide a "safetyScore" for solo female travelers as a percentage (0-100), where 100 is safest. Base this score on factors like crime rates (specifically against women if possible), general reputation, and tourist-friendliness.
    *   Provide a brief "safetyJustification" explaining the score.

2.  **Regional Highlights**:
    *   Identify 3-4 distinct states or regions within the destination country.
    *   For each region, list its most famous foods, traditional apparel, and other key cultural highlights.

3.  **Output Format**: Generate a strict JSON object that conforms to the output schema. Do not output any text outside of the JSON.

Example Output for "Italy":
{
  "touristSpots": [
    {
      "name": "Colosseum, Rome",
      "description": "The iconic ancient Roman amphitheater, a testament to architectural and historical grandeur.",
      "googleMaps360Url": "https://www.google.com/maps/@41.8902102,12.4922309,3a,75y,90h,90t/data=!3m8!1e1!3m6!1sAF1QipP_5s5q_V_tY-mQjA!2e10!3e11!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipP_5s5q_V_tY-mQjA%3Dw203-h100-k-no-pi-0-ya190-ro-0-fo100!7i8704!8i4352",
      "safetyScore": 85,
      "safetyJustification": "Generally safe, but be cautious of pickpockets in crowded areas. Well-policed and well-lit."
    }
  ],
  "regionalHighlights": [
      {
          "regionName": "Tuscany",
          "famousFoods": ["Ribollita", "Pappa al Pomodoro", "Bistecca alla Fiorentina"],
          "famousApparel": ["Handcrafted leather goods (Florentine style)"],
          "otherHighlights": ["Chianti wine", "Renaissance art"]
      }
  ]
}
`,
});

const generateDestinationHighlightsFlow = ai.defineFlow(
  {
    name: 'generateDestinationHighlightsFlow',
    inputSchema: GenerateDestinationHighlightsInputSchema,
    outputSchema: GenerateDestinationHighlightsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
