import { Skeleton } from '@/shared/ui';

export function PetDetailSkeleton() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="mt-4 h-8 w-40 rounded-lg" />
        </div>
        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-3">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-11/12 rounded-md" />
            <Skeleton className="h-5 w-10/12 rounded-md" />
            <Skeleton className="h-5 w-8/12 rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[24px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="mt-4 h-4 w-full rounded-md" />
            <Skeleton className="mt-2 h-4 w-9/12 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
