import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ItinerarySkeleton = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
            <Skeleton className="h-8 w-48" />
        </CardHeader>
      </Card>
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
                 <Skeleton className="h-12 w-12 rounded-full" />
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                 </div>
            </CardHeader>
             <CardContent className="space-y-6 p-6 pt-0">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItinerarySkeleton;
