import { usePetWeightHistory } from '@/features/auth';

import { formatWeight } from '../lib/formatters';

interface PetWeightPreviewProps {
  petId: number;
}

function formatPreviewDate(date: string) {
  const [year = '', month = '', day = ''] = date.slice(0, 10).split('-');

  return [year, month, day].filter(Boolean).join('.');
}

export function PetWeightPreview({ petId }: PetWeightPreviewProps) {
  const { data, isLoading, isError } = usePetWeightHistory(petId, {
    page: 0,
    size: 1,
    sort: 'petWeightsMeasuredAt,desc',
  });

  const latestWeight = data?.weights[0] ?? null;

  if (isLoading) {
    return <p className="text-sm text-neutral-500">체중 기록을 불러오는 중이에요...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-[16px] border border-red-100 bg-red-50/50 px-4 py-4">
        <p className="text-sm leading-6 text-red-600">체중 정보를 불러오지 못했습니다.</p>
      </div>
    );
  }

  if (!latestWeight) {
    return (
      <div className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
        <p className="text-sm leading-6 text-neutral-600">현재 등록된 체중 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4 sm:px-5">
      <div className="flex min-h-[108px] items-center justify-between gap-4 sm:gap-5">
        <div className="flex min-w-0 items-end gap-1.5 whitespace-nowrap">
          <p className="text-[36px] font-semibold leading-none tracking-[-0.03em] text-neutral-950 sm:text-[48px]">
            {formatWeight(latestWeight.weight)}
          </p>
          <span className="pb-1 text-[16px] font-medium text-neutral-400">kg</span>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-center border-l border-neutral-200/80 pl-4 text-right sm:pl-5">
          <p className="whitespace-nowrap text-[12px] font-Regular tracking-[0.08em] text-neutral-400">최근 측정일</p>
          <p className="mt-1 whitespace-nowrap text-[14px] font-semibold leading-none text-neutral-700">
            {formatPreviewDate(latestWeight.petWeightsMeasuredAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
