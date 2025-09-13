
'use server';

/**
 * @fileOverview A flow that translates text and converts it to speech.
 *
 * - translateAndSpeak - A function that translates text and returns audio.
 * - TranslateAndSpeakInput - The input type for the function.
 * - TranslateAndSpeakOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

// Define Zod schemas for input and output
const TranslateAndSpeakInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The language to translate the text into (e.g., "Spanish", "Japanese").'),
});

const TranslateAndSpeakOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
  audioDataUri: z.string().describe('The translated speech as a base64 encoded data URI in WAV format.'),
});

export type TranslateAndSpeakInput = z.infer<typeof TranslateAndSpeakInputSchema>;
export type TranslateAndSpeakOutput = z.infer<typeof TranslateAndSpeakOutputSchema>;

// The main function that will be called from the frontend
export async function translateAndSpeak(input: TranslateAndSpeakInput): Promise<TranslateAndSpeakOutput> {
  return translateAndSpeakFlow(input);
}

// Helper function to convert PCM audio buffer to WAV format
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
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

// Define the translation prompt
const translationPrompt = ai.definePrompt({
    name: 'translationPrompt',
    input: { schema: TranslateAndSpeakInputSchema },
    output: { schema: z.object({ translatedText: z.string() }) },
    model: 'googleai/gemini-1.5-flash',
    prompt: `Translate the following text to {{targetLanguage}}. Only output the translated text, with no additional explanation or context.
Text to translate:
{{{text}}}
`
});


// Define the main Genkit flow
const translateAndSpeakFlow = ai.defineFlow(
  {
    name: 'translateAndSpeakFlow',
    inputSchema: TranslateAndSpeakInputSchema,
    outputSchema: TranslateAndSpeakOutputSchema,
  },
  async (input) => {
    // 1. Translate the text
    const translationResult = await translationPrompt(input);
    const translatedText = translationResult.output?.translatedText;

    if (!translatedText) {
      throw new Error('Translation failed or returned no text.');
    }
    
    // 2. Convert the translated text to speech
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: translatedText,
    });

    if (!media?.url) {
      throw new Error('Text-to-speech generation failed to return audio media.');
    }

    // 3. Convert the raw PCM audio to a WAV data URI
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);

    return {
      translatedText,
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
