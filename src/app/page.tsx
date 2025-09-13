'use client';

import { useState } from 'react';
import Image from 'next/image';
import { generatePersonalizedItinerary, GeneratePersonalizedItineraryOutput } from '@/ai/flows/generate-personalized-itinerary';
import { ItineraryForm, ItineraryFormValues } from '@/components/itinerary-form';
import ItineraryDisplay from '@/components/itinerary-display';
import ItinerarySkeleton from '@/components/itinerary-skeleton';
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Route } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Header from '@/components/header';

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
      <Header />
      <main className="flex-grow">
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white shadow-lg">
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
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex flex-col items-center p-4">
            <div className="flex items-center gap-4 mb-4">
               <Sparkles className="h-16 w-16 md:h-20 md:w-20 text-primary-foreground/80" />
              <h1 className="text-6xl md:text-8xl font-headline font-extrabold tracking-tight drop-shadow-lg">
                WanderGenie
              </h1>
            </div>
            <p className="mt-2 text-xl md:text-2xl max-w-3xl text-primary-foreground/90 drop-shadow-md">
              Your AI-powered travel partner. Craft your perfect journey in seconds.
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:sticky lg:top-24 lg:col-span-1">
              <ItineraryForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
            <div className="min-h-[600px] lg:col-span-2">
              {isLoading && <ItinerarySkeleton />}
              {itinerary && <ItineraryDisplay itineraryData={itinerary.itinerary} />}
              {!isLoading && !itinerary && (
                 <div className="flex flex-col items-center justify-center h-full text-center p-10 border-2 border-dashed rounded-xl bg-card/50 text-card-foreground mt-0">
                    <Route size={80} className="text-muted-foreground/50 mb-6" strokeWidth={1} />
                    <h3 className="text-3xl font-bold mb-3 font-headline">Your Itinerary Awaits</h3>
                    <p className="text-muted-foreground max-w-md text-lg">Fill out the form to generate your personalized travel plan and see the magic happen here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-8 text-muted-foreground">
        <p className="mt-4">Powered by WanderGenie</p>
      </footer>
    </div>
  );
}
