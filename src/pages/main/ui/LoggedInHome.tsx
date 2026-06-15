import { useState } from 'react';

import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import { getLatestReportByPet } from '../model/formatters';
import { useHomeDashboard } from '../model/useHomeDashboard';
import { HealthReportSection } from './sections/HealthReportSection';
import { HotTopicSection } from './sections/HotTopicSection';
import { NoticeAndQuickLinksSection } from './sections/NoticeAndQuickLinksSection';

export function LoggedInHome() {
  const { data, isLoading, isError, error, refetch, isFetching } = useHomeDashboard();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  const petProfiles = data?.petProfiles ?? [];
  const healthReports = data?.healthReports ?? [];

  const resolvedSelectedPetId =
    selectedPetId !== null && petProfiles.some((pet) => pet.petId === selectedPetId)
      ? selectedPetId
      : (petProfiles[0]?.petId ?? null);
  const selectedPet = petProfiles.find((pet) => pet.petId === resolvedSelectedPetId) ?? null;
  const selectedReport = selectedPet ? getLatestReportByPet(selectedPet.petId, healthReports) : undefined;
  const errorMessage = isError
    ? getApiErrorMessage(error, '메인 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;

  return (
    <div className="flex w-full flex-col gap-4 pb-6 sm:gap-6">
      <HealthReportSection
        isLoading={isLoading || isFetching}
        errorMessage={errorMessage}
        pets={petProfiles}
        selectedPet={selectedPet}
        selectedPetId={resolvedSelectedPetId}
        selectedReport={selectedReport}
        onSelectPet={setSelectedPetId}
        onRetry={() => {
          void refetch();
        }}
      />
      <NoticeAndQuickLinksSection />
      <HotTopicSection />
    </div>
  );
}
