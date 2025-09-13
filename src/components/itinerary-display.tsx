
"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Rocket, Bed, StickyNote, Sunrise, Sun, Sunset, CalendarDays } from 'lucide-react';
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
}

interface ItineraryDisplayProps {
  itineraryData: ItineraryDay[];
}

const parseContent = (content: string) => {
  const parts = content.split(/(\*\*.*?\*\*)/g).filter(part => part);
  return parts.map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={index} className="text-primary font-semibold">{part.slice(2, -2)}</strong>
    ) : (
      part
    )
  );
};

const ItineraryDisplay = ({ itineraryData }: ItineraryDisplayProps) => {
  if (!itineraryData || itineraryData.length === 0) {
    return null;
  }
  
  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="mb-8 shadow-lg border-border/80 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-4 text-4xl font-headline font-bold text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Rocket className="h-8 w-8 text-primary" />
            </div>
            Your Magical Trip Plan
          </CardTitle>
        </CardHeader>
      </Card>
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-6">
        {itineraryData.map((dayData, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b-0">
             <Card className="shadow-lg border-border/80 overflow-hidden transition-all hover:shadow-xl hover:border-border">
              <AccordionTrigger className="p-6 text-2xl font-headline font-bold hover:no-underline group [&[data-state=open]]:bg-muted/50">
                <div className="flex items-center gap-5">
                  <Badge className="bg-primary text-primary-foreground h-14 w-14 flex items-center justify-center rounded-full text-2xl font-bold shadow-md transition-transform group-hover:scale-105">
                    {dayData.day.split(' ')[1]}
                  </Badge>
                  <div>
                     <div className="font-bold text-foreground">{dayData.day}</div>
                     <div className="text-base font-normal text-muted-foreground flex items-center gap-2 pt-1">
                        <CalendarDays className="h-4 w-4" />
                        {format(parseISO(dayData.date), 'EEEE, MMMM d')}
                     </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-6 pt-2 space-y-8">
                  <div className="space-y-6">
                      <div className="flex items-start gap-4">
                          <Sunrise className="h-7 w-7 text-yellow-500 mt-1 flex-shrink-0" />
                          <div>
                              <h4 className="font-headline font-semibold text-xl mb-1 text-foreground">Morning</h4>
                              <p className="text-muted-foreground text-base">{parseContent(dayData.morning)}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <Sun className="h-7 w-7 text-orange-500 mt-1 flex-shrink-0" />
                          <div>
                              <h4 className="font-headline font-semibold text-xl mb-1 text-foreground">Afternoon</h4>
                              <p className="text-muted-foreground text-base">{parseContent(dayData.afternoon)}</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <Sunset className="h-7 w-7 text-indigo-500 mt-1 flex-shrink-0" />
                          <div>
                              <h4 className="font-headline font-semibold text-xl mb-1 text-foreground">Evening</h4>
                              <p className="text-muted-foreground text-base">{parseContent(dayData.evening)}</p>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-muted/50 p-5 rounded-lg border-none">
                        <CardHeader className="p-0 pb-3">
                           <CardTitle className="text-lg font-headline flex items-center gap-3 text-foreground"><Bed className="h-6 w-6 text-primary"/> Accommodation</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-base text-muted-foreground">
                          {parseContent(dayData.accommodation)}
                        </CardContent>
                    </Card>
                    <Card className="bg-muted/50 p-5 rounded-lg border-none">
                        <CardHeader className="p-0 pb-3">
                          <CardTitle className="text-lg font-headline flex items-center gap-3 text-foreground"><StickyNote className="h-6 w-6 text-primary"/> Notes & Tips</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-base text-muted-foreground">
                          {dayData.notes}
                        </CardContent>
                    </Card>
                  </div>
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
