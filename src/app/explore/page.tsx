
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { generateDestinationHighlights, GenerateDestinationHighlightsOutput } from '@/ai/flows/generate-destination-highlights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Globe, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ExploreDisplay from './explore-display';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/header';

type Inputs = {
  destination: string;
};

export default function ExplorePage() {
  const [highlights, setHighlights] = useState<GenerateDestinationHighlightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<Inputs>({
    defaultValues: {
      destination: '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setHighlights(null);
    try {
      const result = await generateDestinationHighlights(data);
      setHighlights(result);
    } catch (error) {
      console.error('Error generating highlights:', error);
      toast({
        title: "Error Generating Highlights",
        description: "Something went wrong. Please check your query or API setup.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <Card className="shadow-lg border-border/80 rounded-xl mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-4 text-3xl font-headline font-bold text-foreground">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-7 w-7 text-primary" />
                </div>
                Explore a Destination
              </CardTitle>
               <CardDescription className="text-lg pt-1">
                Virtually discover new places, from top attractions to local gems.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-4">
                  <FormField
                    control={form.control}
                    name="destination"
                    rules={{ required: 'Destination is required' }}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="e.g., Japan, Brazil, India..." {...field} className="pl-12 h-14 text-lg" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="h-14 text-lg px-8">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Explore'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="space-y-12">
               <div className="space-y-4">
                 <Skeleton className="h-10 w-1/3" />
                 <Skeleton className="h-6 w-1/2" />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
               </div>
            </div>
          )}
          {highlights && <ExploreDisplay highlights={highlights} />}
        </div>
      </main>
      <footer className="text-center p-8 text-muted-foreground">
        <p>Powered by WanderGenie</p>
      </footer>
    </div>
  );
}
