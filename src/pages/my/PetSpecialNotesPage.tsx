import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useCurrentUser, usePetDetail } from '@/features/auth';
import { PetDetailError, PetDetailSkeleton } from '@/features/pet-detail';
import { PetSpecialNotesManager } from '@/features/pet-special-notes';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

export function PetSpecialNotesPage() {
  const { petId } = useParams();
  const numericPetId = useMemo(() => {
    if (!petId) return null;

    const parsed = Number(petId);
    return Number.isNaN(parsed) ? null : parsed;
  }, [petId]);

  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const { data, isLoading: isDetailLoading, isError, error } = usePetDetail(numericPetId);

  let content;
  if (isDetailLoading) {
    content = <PetDetailSkeleton />;
  } else if (isError || numericPetId === null || !data) {
    content = <PetDetailError message={getApiErrorMessage(error, '특이사항 정보를 불러오지 못했습니다.')} />;
  } else {
    content = (
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET NOTES</p>
            <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">특이사항 관리</h1>
          </div>
          <Link
            to={`/my/pets/${data.petId}`}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
          >
            상세정보 보기
          </Link>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-medium text-neutral-950 sm:text-[20px]">{data.petName}</h2>
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                  총 {data.specialNotesCount}개
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-500">
                {data.petName}의 특이사항을 정리하고 필요한 메모를 추가하거나 수정할 수 있어요.
              </p>
            </div>
          </div>
        </section>

        <PetSpecialNotesManager petId={data.petId} />
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
