"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Rocket } from 'lucide-react';

interface ItineraryDisplayProps {
  itinerary: string;
}

const ItineraryDisplay = ({ itinerary }: ItineraryDisplayProps) => {
  // Simple parser to format the itinerary text.
  const contentLines = itinerary.split('\n').filter(line => line.trim() !== '');

  return (
    <Card className="shadow-lg border-2 border-primary/10 animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-3xl font-headline">
          <Rocket className="h-8 w-8 text-primary" />
          Your Trip Plan
        </CardTitle>
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4 text-base leading-relaxed">
            {contentLines.map((line, index) => {
              line = line.trim();
              if (line.startsWith('**') && line.endsWith('**')) {
                return <h3 key={index} className="text-xl font-bold font-headline mt-6 -mb-2">{line.replaceAll('**', '')}</h3>;
              }
              if (line.match(/^Day \d+:/i) || line.match(/^## .*$/)) {
                return <h4 key={index} className="text-lg font-semibold mt-4 mb-1 font-headline">{line.replace('## ', '')}</h4>;
              }
              if (line.startsWith('* ') || line.startsWith('- ')) {
                return <p key={index} className="flex items-start"><span className="mr-3 mt-1.5 text-primary">&bull;</span><span>{line.substring(2)}</span></p>;
              }
              return <p key={index}>{line}</p>;
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ItineraryDisplay;
