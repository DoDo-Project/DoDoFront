import { usePetList } from '@/features/auth';
import { Skeleton } from '@/shared/ui';

import { PetListEmptyState } from './PetListEmptyState';
import { PetListErrorState } from './PetListErrorState';
import { PetListPanel } from './PetListPanel';

function PetListCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Skeleton className="h-24 w-24 shrink-0 rounded-[18px] sm:h-28 sm:w-28" />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-32 rounded-lg" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>

            <div className="mt-3 space-y-2.5">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
          <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
        </div>
      </div>
    </article>
  );
}

function PetListLoadingState() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="mt-4 h-8 w-48 rounded-lg" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Skeleton className="h-9 w-20 rounded-full" />
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>
      </div>

      <div className="grid gap-3">
        <PetListCardSkeleton />
        <PetListCardSkeleton />
      </div>
    </div>
  );
}

export function PetListContent() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePetList({ page: 0, size: 10 });

  if (isLoading) {
    return <PetListLoadingState />;
  }

  if (isError) {
    return <PetListErrorState error={error} onRetry={() => void refetch()} />;
  }

  if (!data || data.pets.length === 0) {
    return <PetListEmptyState />;
  }

  return <PetListPanel pets={data.pets} totalElements={data.totalElements} isRefreshing={isFetching} />;
}
