import { usePetList } from '@/features/auth';
import { Skeleton } from '@/shared/ui';

import { PetListEmptyState } from './PetListEmptyState';
import { PetListErrorState } from './PetListErrorState';
import { PetListPanel } from './PetListPanel';

function PetListLoadingState() {
  return (
    <div className="flex min-h-[320px] items-center">
      <div className="w-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <Skeleton className="h-3 w-14 rounded-md" />
          <Skeleton className="mt-4 h-8 w-64 rounded-lg" />
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-2xl space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
            <Skeleton className="h-4 w-7/12 rounded-md" />
          </div>

          <Skeleton className="mt-4 h-12 w-40 rounded-xl" />
        </div>
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
