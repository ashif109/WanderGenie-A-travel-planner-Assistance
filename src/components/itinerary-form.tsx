'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { MapPin, CalendarDays, Star, Plane, Loader2 } from 'lucide-react';

const formSchema = z.object({
  destination: z.string().min(2, {
    message: 'Destination must be at least 2 characters.',
  }),
  preferences: z.string().min(10, {
    message: 'Tell us a bit more about your interests.',
  }),
  duration: z.number().min(1).max(30),
});

export type ItineraryFormValues = z.infer<typeof formSchema>;

interface ItineraryFormProps {
  onSubmit: (data: ItineraryFormValues) => void;
  isLoading: boolean;
}

export function ItineraryForm({ onSubmit, isLoading }: ItineraryFormProps) {
  const form = useForm<ItineraryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      preferences: '',
      duration: 7,
    },
  });

  return (
    <Card className="shadow-lg border-2 border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-3xl font-headline">
          <Plane className="h-8 w-8 text-primary" />
          Plan Your Adventure
        </CardTitle>
        <CardDescription>Tell us where you want to go and what you love to do.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Destination
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Paris, France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-lg">
                    <Star className="h-5 w-5" />
                    Interests & Preferences
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., historical museums, vegan food, jazz clubs, hiking"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel className="flex items-center justify-between text-lg">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Trip Duration
                    </span>
                    <span className="font-bold text-primary">{value} {value > 1 ? 'days' : 'day'}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={30}
                      step={1}
                      defaultValue={[value]}
                      onValueChange={(vals) => onChange(vals[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Crafting Your Trip...
                </>
              ) : (
                'Generate Itinerary'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
