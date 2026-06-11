import { Link } from 'react-router-dom';

import { Skeleton } from '@/shared/ui';

export function FamilyManagementLoadingState() {
  return (
    <div className="space-y-5">
      <div>
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="mt-4 h-8 w-48 rounded-lg" />
      </div>

      <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-24 w-24 rounded-[18px] sm:h-28 sm:w-28" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-28 rounded-lg" />
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
            <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
            <div className="px-5 py-5 sm:px-6">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="mt-3 h-6 w-40 rounded-lg" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FamilyManagementErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[320px] items-center">
      <div className="w-full overflow-hidden rounded-[16px] border border-red-100 bg-white">
        <div className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-red-500">ERROR</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900 sm:text-[28px]">
            가족 관리 정보를 불러오지 못했어요
          </h1>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            반려동물 목록을 다시 확인한 뒤 가족 관리 화면을 준비할게요. 잠시 후 다시 시도해 주세요.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-w-32 items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}

export function FamilyManagementEmptyState() {
  return (
    <section className="flex h-full items-start">
      <div className="w-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top,rgba(229,108,49,0.1),transparent_40%)] px-6 py-12 text-center sm:px-8 sm:py-14">
          <p className="text-[16px] font-medium leading-8 text-neutral-950 sm:text-[18px]">
            가족을 관리하려면 먼저 반려동물을 등록해 주세요.
          </p>

          <Link
            to="/my/pets/new"
            className="mt-4 inline-flex min-w-56 items-center justify-center rounded-2xl bg-brand px-8 py-4 text-[16px] font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            반려동물 등록하기
          </Link>
        </div>
      </div>
    </section>
  );
}
