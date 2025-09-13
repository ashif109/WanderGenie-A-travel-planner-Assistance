
'use client';

import type { GenerateDestinationHighlightsOutput } from '@/ai/flows/generate-destination-highlights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Camera, Map, Shield, Utensils, Shirt, Sparkles } from 'lucide-react';

interface ExploreDisplayProps {
  highlights: GenerateDestinationHighlightsOutput;
}

const SafetyIndicator = ({ score, justification }: { score: number, justification: string }) => {
    const getColor = (value: number) => {
        if (value > 75) return 'bg-green-500';
        if (value > 50) return 'bg-yellow-500';
        return 'bg-red-500';
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="w-full flex items-center gap-3 cursor-pointer">
                        <div className="relative h-6 w-6 flex-shrink-0">
                            <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36">
                                <circle className="text-muted/50" strokeWidth="4" fill="transparent" r="14" cx="18" cy="18" />
                                <circle
                                    className={`text-primary transition-all duration-500`}
                                    strokeWidth="4"
                                    strokeDasharray={`${score * 0.88}, 88`}
                                    strokeLinecap="round"
                                    fill="transparent"
                                    r="14"
                                    cx="18"
                                    cy="18"
                                    transform="rotate(-90 18 18)"
                                />
                            </svg>
                             <div className="absolute inset-0 flex items-center justify-center">
                                <Shield className="h-3 w-3 text-primary" />
                            </div>
                        </div>
                        <span className="font-bold text-sm text-foreground">{score}% Safe</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="max-w-xs">
                    <p className="font-bold">Female Traveler Safety Score</p>
                    <p>{justification}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const HighlightList = ({ title, items, icon }: { title: string, items: string[], icon: React.ReactNode }) => (
    <div>
        <h4 className="font-headline font-semibold text-lg flex items-center gap-3 mb-2">
            {icon} {title}
        </h4>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-2">
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
)

export default function ExploreDisplay({ highlights }: ExploreDisplayProps) {
  return (
    <div className="animate-in fade-in-50 duration-500">
      <section id="tourist-spots" className="mb-16">
        <h2 className="text-4xl font-headline font-bold mb-8 flex items-center gap-4">
            <Map className="h-10 w-10 text-primary"/> Top Tourist Spots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.touristSpots.map((spot, index) => (
            <Card key={index} className="shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">{spot.name}</CardTitle>
                <SafetyIndicator score={spot.safetyScore} justification={spot.safetyJustification} />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <p className="text-muted-foreground mb-6 flex-grow">{spot.description}</p>
                <Button asChild>
                  <a href={spot.googleMaps360Url} target="_blank" rel="noopener noreferrer">
                    <Camera className="mr-2 h-4 w-4"/> View 360° Tour
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="regional-highlights">
         <h2 className="text-4xl font-headline font-bold mb-8 flex items-center gap-4">
            <Sparkles className="h-10 w-10 text-primary"/> Regional Highlights
        </h2>
        <Tabs defaultValue={highlights.regionalHighlights[0]?.regionName} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto mb-6">
                {highlights.regionalHighlights.map((region) => (
                    <TabsTrigger key={region.regionName} value={region.regionName} className="py-3 text-base">
                        {region.regionName}
                    </TabsTrigger>
                ))}
            </TabsList>
            {highlights.regionalHighlights.map((region) => (
                <TabsContent key={region.regionName} value={region.regionName}>
                    <Card className="shadow-lg p-8">
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <HighlightList title="Famous Foods" items={region.famousFoods} icon={<Utensils className="h-6 w-6 text-primary"/>} />
                           <HighlightList title="Famous Apparel" items={region.famousApparel} icon={<Shirt className="h-6 w-6 text-primary"/>} />
                           <HighlightList title="Other Highlights" items={region.otherHighlights} icon={<Sparkles className="h-6 w-6 text-primary"/>} />
                       </div>
                    </Card>
                </TabsContent>
            ))}
        </Tabs>
      </section>
    </div>
  );
}
