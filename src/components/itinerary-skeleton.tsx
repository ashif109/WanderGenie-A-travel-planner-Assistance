import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const ItinerarySkeleton = () => {
  return (
    <Card className="shadow-lg border-2 border-primary/10">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <Separator className="mb-6" />
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
        </div>
         <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ItinerarySkeleton;
