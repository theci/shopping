import { Skeleton } from '@/shared/components/ui';

interface ProductListSkeletonProps {
  count?: number;
}

export function ProductListSkeleton({ count = 8 }: ProductListSkeletonProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="aspect-square rounded-lg" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-24" />
        </div>
      ))}
    </div>
  );
}
