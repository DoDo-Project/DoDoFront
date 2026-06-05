import { usePetWeightHistory } from '@/features/auth';

interface PetWeightPreviewProps {
  petId: number;
}

function formatMeasuredDate(date: string) {
  const [year, month, day] = date.split('-');

  return [year, month, day].filter(Boolean).join('. ');
}

export function PetWeightPreview({ petId }: PetWeightPreviewProps) {
  const { data, isLoading } = usePetWeightHistory(petId, {
    page: 0,
    size: 1,
    sort: 'petWeightsMeasuredAt,desc',
  });

  const latestWeight = data?.weights[0] ?? null;

  if (isLoading) {
    return <p className="text-sm text-neutral-500">체중 기록을 불러오는 중이에요...</p>;
  }

  if (!latestWeight) {
    return (
      <div className="rounded-[18px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
        <p className="text-sm leading-6 text-neutral-600">현재 등록된 체중 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-[18px] border border-neutral-200 bg-neutral-50/70 px-4 py-4 sm:px-5">
      <div className="flex min-h-[68px] items-stretch justify-between gap-4">
        <div className="flex items-center gap-1">
          <p className="text-[48px] font-semibold leading-none tracking-[0.02em] text-neutral-950">
            {latestWeight.weight}
          </p>
          <span className="text-[18px] font-medium text-neutral-400">kg</span>
        </div>

        <div className="flex h-full flex-col justify-end items-end border-l border-neutral-200/80 pl-4 text-right">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-neutral-400">최근 측정일</p>
          <p className="mt-1.5 text-[14px] font-semibold leading-none text-neutral-700">
            {formatMeasuredDate(latestWeight.petWeightsMeasuredAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
