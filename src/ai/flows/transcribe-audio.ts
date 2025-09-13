
'use server';

/**
 * @fileOverview A flow that transcribes audio data to text.
 *
 * - transcribeAudio - A function that takes an audio data URI and returns the transcribed text.
 * - TranscribeAudioInput - The input type for the function.
 * - TranscribeAudioOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TranscribeAudioInputSchema = z.object({
  audioDataUri: z.string().describe("A recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});

const TranscribeAudioOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});

export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioFlow(input);
}

const transcriptionPrompt = ai.definePrompt({
  name: 'transcriptionPrompt',
  input: { schema: TranscribeAudioInputSchema },
  output: { schema: TranscribeAudioOutputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `Transcribe the following audio recording. Only output the transcribed text.
Audio: {{media url=audioDataUri}}
`,
});

const transcribeAudioFlow = ai.defineFlow(
  {
    name: 'transcribeAudioFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const { output } = await transcriptionPrompt(input);
    if (!output) {
        throw new Error('Transcription failed to produce an output.');
    }
    return {
        transcription: output.transcription,
    };
  }
);
