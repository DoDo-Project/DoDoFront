import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCurrentUser, usePetDetail, usePetWeightHistory } from '@/features/auth';
import { PetDetailError, PetDetailSkeleton } from '@/features/pet-detail';
import { PetWeightHistorySection, PetWeightTrendChart } from '@/features/pet-weight';
import { formatMeasuredDate, formatWeight } from '@/features/pet-weight/lib/formatters';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

export function PetWeightPage() {
  const { petId } = useParams();
  const numericPetId = useMemo(() => {
    if (!petId) return null;

    const parsed = Number(petId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [petId]);

  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const { data, isLoading: isDetailLoading, isError, error } = usePetDetail(numericPetId);
  const {
    data: weightHistory,
    isLoading: isWeightLoading,
    isFetching: isWeightFetching,
    isError: isWeightError,
    error: weightError,
    refetch: refetchWeightHistory,
  } = usePetWeightHistory(numericPetId, {
    page: 0,
    size: 15,
    sort: 'petWeightsMeasuredAt,desc',
  });

  let content;
  if (isDetailLoading) {
    content = <PetDetailSkeleton />;
  } else if (isError || numericPetId === null || !data) {
    content = <PetDetailError message={getApiErrorMessage(error, '체중 정보를 불러오지 못했습니다.')} />;
  } else {
    const latestWeight = weightHistory?.weights[0] ?? null;
    const totalElements = weightHistory?.totalElements ?? 0;
    const graphWeights = weightHistory?.weights ?? [];

    content = (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET WEIGHT</p>
            <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">체중 관리</h1>
          </div>
          <Link
            to={`/my/pets/${data.petId}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
          >
            상세정보 보기
          </Link>
        </div>

        <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[18px] font-medium text-neutral-950 sm:text-[20px]">{data.petName}</h2>
              <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                총 {totalElements}개
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              최근 체중은 {latestWeight ? `${formatWeight(latestWeight.weight)}kg` : '미등록'}이며,
              {latestWeight
                ? ` 최근 측정일은 ${formatMeasuredDate(latestWeight.petWeightsMeasuredAt)}입니다.`
                : ' 아직 측정 기록이 없습니다.'}
            </p>
          </div>
        </section>

        <PetWeightTrendChart
          weights={graphWeights}
          isLoading={isWeightLoading}
          isRefreshing={isWeightFetching && !isWeightLoading}
          isError={isWeightError}
          error={weightError}
          onRetry={() => void refetchWeightHistory()}
        />

        <PetWeightHistorySection petId={data.petId} birth={data.birth} />
      </div>
    );
  }

  return (
    <MyDodoLayout
      sidebar={
        <MyDodoSidebarPanel
          user={user}
          profileUrl={profileUrl}
          displayName={displayName}
          isLoading={isLoading}
          activeKey="pet-list"
        />
      }
      content={content}
    />
  );
}
