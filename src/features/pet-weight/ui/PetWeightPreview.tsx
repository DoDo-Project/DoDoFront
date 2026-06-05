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
    return <p className="text-sm leading-7 text-neutral-600">현재 등록된 체중 정보가 없습니다.</p>;
  }

  return (
    <div className="space-y-2">
      <p className="text-[17px] font-medium text-neutral-900">{latestWeight.weight}</p>
      <p className="text-sm text-neutral-500">최근 측정일 {formatMeasuredDate(latestWeight.petWeightsMeasuredAt)}</p>
    </div>
  );
}
