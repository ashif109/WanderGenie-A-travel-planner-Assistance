
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Rocket, Bed, StickyNote, Palette, Sunrise, Sun, Sunset } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Badge } from './ui/badge';

interface ItineraryDay {
  day: string;
  date: string;
  morning: string;
  afternoon: string;
  evening: string;
  accommodation: string;
  notes: string;
  visual_style_notes: string;
}

interface ItineraryDisplayProps {
  itineraryData: ItineraryDay[];
}

const parseContent = (content: string) => {
  const parts = content.split(/(\*\*.*?\*\*)/g).filter(part => part);
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="text-primary font-bold">{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
};

const ItineraryDisplay = ({ itineraryData }: ItineraryDisplayProps) => {
  if (!itineraryData || itineraryData.length === 0) {
    return null;
  }

  // A simple function to extract colors from visual_style_notes
  const getColors = (note: string): string[] => {
    const colorMatch = note.match(/#[0-9a-fA-F]{6}/g);
    return colorMatch || [];
  };

  const colors = getColors(itineraryData[0].visual_style_notes);
  const primaryColor = colors[0] || 'hsl(var(--primary))';
  
  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="mb-8 shadow-lg border-2 border-primary/10 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl font-headline">
            <Rocket className="h-8 w-8 text-primary" />
            Your Trip Plan
          </CardTitle>
        </CardHeader>
      </Card>
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
        {itineraryData.map((dayData, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
             <Card className="shadow-md border-2 border-primary/10 overflow-hidden">
              <AccordionTrigger className="p-6 text-xl font-headline hover:no-underline [&[data-state=open]]:bg-accent">
                <div className="flex items-center gap-4">
                  <Badge style={{ backgroundColor: primaryColor }} className="text-primary-foreground h-12 w-12 flex items-center justify-center rounded-full text-lg font-bold">
                    {dayData.day.split(' ')[1]}
                  </Badge>
                  <div>
                     <div className="font-bold">{dayData.day}</div>
                     <div className="text-sm font-normal text-muted-foreground">{format(parseISO(dayData.date), 'EEEE, MMMM d')}</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-6 pt-0 space-y-6">
                  <div className="space-y-4">
                      <div className="flex items-start gap-4">
                          <Sunrise className="h-6 w-6 text-primary mt-1" />
                          <div>
                              <h4 className="font-headline font-semibold text-lg">Morning</h4>
                              <p className="text-muted-foreground">{parseContent(dayData.morning)}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <Sun className="h-6 w-6 text-primary mt-1" />
                          <div>
                              <h4 className="font-headline font-semibold text-lg">Afternoon</h4>
                              <p className="text-muted-foreground">{parseContent(dayData.afternoon)}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <Sunset className="h-6 w-6 text-primary mt-1" />
                          <div>
                              <h4 className="font-headline font-semibold text-lg">Evening</h4>
                              <p className="text-muted-foreground">{parseContent(dayData.evening)}</p>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="bg-muted/50 p-4">
                        <CardHeader className="p-0 pb-2">
                           <CardTitle className="text-base font-headline flex items-center gap-2"><Bed className="h-5 w-5"/> Accommodation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-sm text-muted-foreground">
                          {parseContent(dayData.accommodation)}
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/50 p-4">
                        <CardHeader className="p-0 pb-2">
                          <CardTitle className="text-base font-headline flex items-center gap-2"><StickyNote className="h-5 w-5"/> Notes & Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-sm text-muted-foreground">
                          {dayData.notes}
                        </CardContent>
                    </Card>
                  </div>
                  
                   <Card className="bg-muted/50 p-4">
                        <CardHeader className="p-0 pb-2">
                          <CardTitle className="text-base font-headline flex items-center gap-2"><Palette className="h-5 w-5"/> Style Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-sm text-muted-foreground">
                          {dayData.visual_style_notes}
                        </CardContent>
                    </Card>
                </div>
              </AccordionContent>
            </Card>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ItineraryDisplay;
