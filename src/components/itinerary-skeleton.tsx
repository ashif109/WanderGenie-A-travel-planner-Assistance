import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ItinerarySkeleton = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-border/80">
        <CardHeader>
            <Skeleton className="h-10 w-3/4" />
        </CardHeader>
      </Card>
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="shadow-lg border-border/80">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
                 <Skeleton className="h-14 w-14 rounded-full" />
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-40" />
                 </div>
            </CardHeader>
             <CardContent className="space-y-8 p-6 pt-0">
                <div className="space-y-4">
                  <div className="flex gap-4">
                     <Skeleton className="h-7 w-7 rounded" />
                     <Skeleton className="h-6 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-3">
                     <Skeleton className="h-6 w-1/2" />
                     <Skeleton className="h-4 w-5/6" />
                   </div>
                    <div className="space-y-3">
                     <Skeleton className="h-6 w-1/2" />
                     <Skeleton className="h-4 w-5/6" />
                   </div>
                </div>
              </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItinerarySkeleton;
