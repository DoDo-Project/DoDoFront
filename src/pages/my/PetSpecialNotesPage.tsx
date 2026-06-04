import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useCurrentUser, usePetDetail } from '@/features/auth';
import { PetDetailError, PetDetailSkeleton } from '@/features/pet-detail';
import { PetSpecialNotesManager } from '@/features/pet-special-notes';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';

export function PetSpecialNotesPage() {
  const { petId } = useParams();
  const numericPetId = useMemo(() => {
    if (!petId) return null;

    const parsed = Number(petId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [petId]);

  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const { data: pet, isLoading: isPetLoading, isError, refetch } = usePetDetail(numericPetId);

  let content;
  if (isPetLoading) {
    content = <PetDetailSkeleton />;
  } else if (numericPetId === null || isError || !pet) {
    content = (
      <PetDetailError
        title="특이사항 관리 정보를 불러오지 못했습니다"
        description="잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 상태와 로그인 정보를 함께 확인해 주세요."
        onRetry={() => {
          void refetch();
        }}
      />
    );
  } else {
    content = (
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET NOTES</p>
          <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">특이사항 관리</h1>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-medium text-neutral-950 sm:text-[20px]">{pet.petName}</h2>
                <span className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-600">
                  총 {pet.specialNotesCount}개
                </span>
              </div>
              <p className="mt-2.5 text-[15px] leading-7 text-neutral-600">
                병원, 약물, 알레르기, 행동 메모를 한곳에서 정리하고 관리할 수 있어요.
              </p>
            </div>
          </div>
        </section>

        <PetSpecialNotesManager petId={pet.petId} />
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
