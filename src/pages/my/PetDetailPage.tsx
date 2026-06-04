import { useParams } from 'react-router-dom';

import { useCurrentUser, usePetDetail } from '@/features/auth';
import { PetDetailContent, PetDetailError, PetDetailSkeleton } from '@/features/pet-detail';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

export function PetDetailPage() {
  const { petId } = useParams();
  const parsedPetId = petId ? Number(petId) : null;
  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const {
    data,
    isLoading: isDetailLoading,
    isError,
    error,
  } = usePetDetail(parsedPetId !== null && !Number.isNaN(parsedPetId) ? parsedPetId : null);

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
      content={
        isDetailLoading ? (
          <PetDetailSkeleton />
        ) : isError || !data ? (
          <PetDetailError message={getApiErrorMessage(error, '반려동물 상세 정보를 불러오지 못했습니다.')} />
        ) : (
          <PetDetailContent pet={data} />
        )
      }
    />
  );
}
