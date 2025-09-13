
'use server';

/**
 * @fileOverview A conversational AI flow for a travel assistant chatbot.
 *
 * - chat - A function that responds to user queries.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message or question.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s message.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are WanderGenie, a friendly and expert AI travel assistant. Your goal is to help travelers with their questions and make their journey planning enjoyable and easy.

Respond to the user's message in a helpful, conversational, and friendly tone. You can answer questions about destinations, travel tips, culture, food, safety, and anything else related to travel.

If the user asks a question in a language other than English, you MUST respond in that same language to be as helpful as possible.

User's message: {{{message}}}
`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
