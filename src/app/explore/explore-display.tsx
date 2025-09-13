
'use client';

import type { GenerateDestinationHighlightsOutput } from '@/ai/flows/generate-destination-highlights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Camera, Map, ShieldCheck, Utensils, Shirt, Sparkles, Building2 } from 'lucide-react';

interface ExploreDisplayProps {
  highlights: GenerateDestinationHighlightsOutput;
}

const SafetyIndicator = ({ score, justification }: { score: number, justification: string }) => {
    const getScoreColor = (value: number) => {
        if (value > 75) return 'text-green-500';
        if (value > 50) return 'text-yellow-500';
        return 'text-red-500';
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 cursor-pointer group">
                       <ShieldCheck className={`h-5 w-5 transition-colors ${getScoreColor(score)}`} />
                       <span className={`font-bold text-sm ${getScoreColor(score)}`}>{score}% Safe</span>
                       <span className="text-xs text-muted-foreground group-hover:text-foreground">for female travelers</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" className="max-w-xs bg-card p-4">
                    <p className="font-bold text-foreground">Female Traveler Safety Score</p>
                    <p className="text-muted-foreground">{justification}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

const HighlightList = ({ title, items, icon }: { title: string, items: string[], icon: React.ReactNode }) => (
    <div>
        <h4 className="font-headline font-semibold text-xl flex items-center gap-3 mb-3 text-foreground">
            {icon} {title}
        </h4>
        <ul className="space-y-2 pl-2">
            {items.map((item, i) => 
            <li key={i} className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
              <span className="text-muted-foreground">{item}</span>
            </li>)}
        </ul>
    </div>
)

export default function ExploreDisplay({ highlights }: ExploreDisplayProps) {
  return (
    <div className="animate-in fade-in-50 duration-500">
      <section id="tourist-spots" className="mb-16">
        <h2 className="text-4xl font-headline font-bold mb-8 flex items-center gap-4 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-8 w-8 text-primary"/>
            </div>
            Top Tourist Spots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.touristSpots.map((spot, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col group overflow-hidden border-border/80">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-foreground">{spot.name}</CardTitle>
                <SafetyIndicator score={spot.safetyScore} justification={spot.safetyJustification} />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col pt-0">
                <p className="text-muted-foreground mb-6 flex-grow">{spot.description}</p>
                <Button asChild className="w-full">
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
         <h2 className="text-4xl font-headline font-bold mb-8 flex items-center gap-4 text-foreground">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Map className="h-8 w-8 text-primary"/> 
            </div>
            Regional Highlights
        </h2>
        <Tabs defaultValue={highlights.regionalHighlights[0]?.regionName} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto mb-6 bg-muted/80">
                {highlights.regionalHighlights.map((region) => (
                    <TabsTrigger key={region.regionName} value={region.regionName} className="py-3 text-base">
                        {region.regionName}
                    </TabsTrigger>
                ))}
            </TabsList>
            {highlights.regionalHighlights.map((region) => (
                <TabsContent key={region.regionName} value={region.regionName}>
                    <Card className="shadow-lg p-8 border-border/80">
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
