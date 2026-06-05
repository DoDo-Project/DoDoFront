import { usePetWeightHistory } from '@/features/auth';

interface PetWeightHistorySectionProps {
  petId: number;
}

function formatMeasuredDate(date: string) {
  const [year, month, day] = date.split('-');

  return [year, month, day].filter(Boolean).join('. ');
}

export function PetWeightHistorySection({ petId }: PetWeightHistorySectionProps) {
  const { data, isLoading, isError, refetch } = usePetWeightHistory(petId, {
    page: 0,
    size: 10,
    sort: 'petWeightsMeasuredAt,desc',
  });

  const weights = data?.weights ?? [];
  const totalElements = data?.totalElements ?? 0;

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
        <p className="text-sm text-neutral-500">총 {totalElements}개의 체중 기록이 등록되어 있어요.</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-neutral-500">체중 기록을 불러오는 중이에요...</p>
      ) : isError ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-4">
          <p className="text-sm text-red-600">체중 기록을 불러오지 못했어요.</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      ) : weights.length === 0 ? (
        <article className="rounded-[18px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-neutral-600">등록된 체중 기록이 없습니다.</p>
        </article>
      ) : (
        <div className="space-y-2.5">
          {weights.map((weight) => (
            <article key={weight.weightId} className="rounded-[18px] border border-neutral-200 bg-white px-4 py-3.5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-neutral-900">{weight.weight}</p>
                <p className="text-sm text-neutral-500">{formatMeasuredDate(weight.petWeightsMeasuredAt)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
