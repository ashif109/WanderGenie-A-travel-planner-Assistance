import { config } from 'dotenv';
config();

import '@/ai/flows/generate-personalized-itinerary.ts';
import '@/ai/flows/generate-destination-highlights.ts';
import '@/ai/flows/chat.ts';
import '@/ai/flows/translate-and-speak.ts';
import '@/ai/flows/transcribe-audio.ts';
