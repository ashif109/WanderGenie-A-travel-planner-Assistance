
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin, CalendarDays, Star, Plane, Loader2, Wallet, Leaf, Gem, Briefcase, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  destination: z.string().min(2, {
    message: 'Destination must be at least 2 characters.',
  }),
  preferences: z.string().min(10, {
    message: 'Tell us a bit more about your interests.',
  }),
  duration: z.number().min(1).max(30),
  budget: z.enum(['budget-friendly', 'balanced', 'luxury']),
  isSoloFemaleTraveler: z.boolean().default(false),
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
      budget: 'balanced',
      isSoloFemaleTraveler: false,
    },
  });

  return (
    <Card className="shadow-xl border-2 border-primary/20 rounded-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-4 text-3xl font-headline font-bold">
          <Plane className="h-9 w-9 text-primary" />
          Plan Your Adventure
        </CardTitle>
        <CardDescription className="text-lg">Tell us where you want to go and what you love to do.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-lg font-semibold">
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
                  <FormLabel className="flex items-center gap-2 text-lg font-semibold">
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
              name="budget"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormLabel className="flex items-center gap-2 text-lg font-semibold"><Wallet className="h-5 w-5" /> Budget Style</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-4"
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="budget-friendly" id="budget-friendly" className="sr-only" />
                        </FormControl>
                        <FormLabel htmlFor="budget-friendly" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:shadow-md">
                          <Leaf className="mb-3 h-7 w-7" />
                          Budget
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="balanced" id="balanced" className="sr-only" />
                        </FormControl>
                        <FormLabel htmlFor="balanced" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:shadow-md">
                          <Briefcase className="mb-3 h-7 w-7" />
                          Balanced
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                           <RadioGroupItem value="luxury" id="luxury" className="sr-only" />
                        </FormControl>
                        <FormLabel htmlFor="luxury" className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:shadow-md">
                           <Gem className="mb-3 h-7 w-7" />
                           Luxury
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
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
                  <FormLabel className="flex items-center justify-between text-lg font-semibold">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5" />
                      Trip Duration
                    </span>
                    <span className="font-bold text-primary text-xl">{value} {value > 1 ? 'days' : 'day'}</span>
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
            <FormField
              control={form.control}
              name="isSoloFemaleTraveler"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/30">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-primary"/>
                      Solo Female Traveler?
                    </FormLabel>
                    <FormDescription className="text-sm text-muted-foreground">
                      Select for safety-focused recommendations.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-xl py-7 font-bold" size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
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
