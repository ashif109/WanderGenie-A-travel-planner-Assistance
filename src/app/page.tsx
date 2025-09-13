'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generatePersonalizedItinerary, GeneratePersonalizedItineraryOutput } from '@/ai/flows/generate-personalized-itinerary';
import { ItineraryForm, ItineraryFormValues } from '@/components/itinerary-form';
import ItineraryDisplay from '@/components/itinerary-display';
import ItinerarySkeleton from '@/components/itinerary-skeleton';
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const [itinerary, setItinerary] = useState<GeneratePersonalizedItineraryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  const handleFormSubmit = async (data: ItineraryFormValues) => {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generatePersonalizedItinerary(data);
      setItinerary(result);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast({
        title: "Error Generating Itinerary",
        description: "Something went wrong. Please check your setup (e.g., API key) and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <main className="flex-grow">
        <section className="relative h-80 flex items-center justify-center text-center text-white">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center p-4">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="h-12 w-12 text-primary" />
              <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight">
                WanderGenie
              </h1>
            </div>
            <p className="mt-2 text-lg md:text-xl max-w-2xl text-primary-foreground/90">
              Your AI-powered travel partner. Craft your perfect journey in seconds.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start">
            <div className="md:sticky md:top-8 md:col-span-1">
              <ItineraryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
            <div className="min-h-[600px] md:col-span-2">
              {isLoading && <ItinerarySkeleton />}
              {itinerary && <ItineraryDisplay itineraryData={itinerary.itinerary} />}
              {!isLoading && !itinerary && (
                 <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg bg-card/80 text-card-foreground mt-0 md:mt-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-muted-foreground mb-4"><path d="M12.22 2h-4.44a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.88z"/><path d="M15 2v6h6"/><path d="m14 11-4 4 2 2 4-4-2-2z"/></svg>
                    <h3 className="text-2xl font-semibold mb-2 font-headline">Your Itinerary Awaits</h3>
                    <p className="text-muted-foreground max-w-sm">Fill out the form on the left to generate your personalized travel plan and see it appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-6 text-muted-foreground">
        <p>Powered by WanderGenie</p>
      </footer>
    </div>
  );
}
