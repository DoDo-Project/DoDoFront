import { Skeleton } from '@/shared/ui';

export function PetDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="mt-3 h-6 w-40 rounded-md" />
      </div>

      <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-28 w-28 rounded-[18px]" />

            <div className="min-w-0 flex-1">
              <Skeleton className="h-6 w-32 rounded-md" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-4 w-52 rounded-md" />
                <Skeleton className="h-4 w-44 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Skeleton className="h-10 w-28 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[20px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
          <Skeleton className="h-6 w-24 rounded-md" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
            <Skeleton className="h-4 w-10/12 rounded-md" />
          </div>
        </div>

        <div className="rounded-[20px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="mt-4 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-8/12 rounded-md" />
        </div>

        <div className="rounded-[20px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="mt-4 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-9/12 rounded-md" />
        </div>

        <div className="rounded-[20px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
          <Skeleton className="h-6 w-24 rounded-md" />
          <Skeleton className="mt-4 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-7/12 rounded-md" />
        </div>

        <div className="rounded-[20px] border border-neutral-200 bg-white px-6 py-5 shadow-sm lg:col-span-2">
          <Skeleton className="h-6 w-28 rounded-md" />
          <Skeleton className="mt-4 h-4 w-full rounded-md" />
          <Skeleton className="mt-2 h-4 w-10/12 rounded-md" />
        </div>
      </div>
    </div>
  );
}
