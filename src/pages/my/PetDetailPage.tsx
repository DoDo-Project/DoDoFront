import { Link, useParams } from 'react-router-dom';

import { useCurrentUser, usePetDetail } from '@/features/auth';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { Skeleton } from '@/shared/ui';

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
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
              <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
                <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET DETAIL</p>
                <h1 className="mt-3 text-2xl font-semibold text-neutral-950">{data.petName}</h1>
              </div>

              <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="space-y-3 text-sm leading-7 text-neutral-700 sm:text-base">
                  <p>
                    <strong className="mr-2 text-neutral-950">종</strong>
                    {data.species} / {data.breed}
                  </p>
                  <p>
                    <strong className="mr-2 text-neutral-950">성별</strong>
                    {data.sex}
                  </p>
                  <p>
                    <strong className="mr-2 text-neutral-950">생년월일</strong>
                    {data.birth.slice(0, 10)}
                  </p>
                  <p>
                    <strong className="mr-2 text-neutral-950">나이</strong>만 {data.age}세
                  </p>
                  <p>
                    <strong className="mr-2 text-neutral-950">등록번호</strong>
                    {data.registrationNumber ?? '미등록'}
                  </p>
                  <p>
                    <strong className="mr-2 text-neutral-950">디바이스 ID</strong>
                    {data.deviceId}
                  </p>
                  <p>
                    <strong className="mr-2 text-neutral-950">기준 심박수</strong>
                    {data.referenceHeartRate}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <Link
                    to="/my?menu=pet-list"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                  >
                    목록으로
                  </Link>
                  <button
                    type="button"
                    disabled
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    수정 준비 중
                  </button>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <InfoCard
                title="가족 구성원"
                content={
                  data.familyMembers.length > 0
                    ? data.familyMembers.map((member) => member.userName).join(', ')
                    : '등록된 가족 구성원이 없습니다.'
                }
              />
              <InfoCard
                title="체중 정보"
                content={
                  data.weightInfo
                    ? `현재 ${data.weightInfo.currentWeight}kg · ${data.weightInfo.weightTrend}`
                    : '체중 정보가 아직 없습니다.'
                }
              />
              <InfoCard
                title="최근 활동"
                content={
                  data.lastActivity
                    ? `${data.lastActivity.activityType} · ${data.lastActivity.distance}km`
                    : '최근 활동 정보가 없습니다.'
                }
              />
              <InfoCard
                title={`특이사항 (${data.specialNotesCount})`}
                content={
                  data.specialNotes.length > 0
                    ? data.specialNotes.map((note) => note.noteContent).join(' / ')
                    : '등록된 특이사항이 없습니다.'
                }
              />
            </div>
          </div>
        )
      }
    />
  );
}

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-[24px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">{content}</p>
    </section>
  );
}

function PetDetailError({ message }: { message: string }) {
  return (
    <div className="rounded-[24px] border border-red-100 bg-white shadow-sm">
      <div className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-8">
        <p className="text-xs font-semibold tracking-[0.24em] text-red-500">ERROR</p>
        <h1 className="mt-3 text-2xl font-semibold text-neutral-950">반려동물 상세 정보를 불러오지 못했습니다</h1>
      </div>
      <div className="px-6 py-6 sm:px-8">
        <p className="text-sm leading-7 text-neutral-600 sm:text-base">{message}</p>
      </div>
    </div>
  );
}

function PetDetailSkeleton() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="mt-4 h-8 w-40 rounded-lg" />
        </div>
        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-3">
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-11/12 rounded-md" />
            <Skeleton className="h-5 w-10/12 rounded-md" />
            <Skeleton className="h-5 w-8/12 rounded-md" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[24px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
            <Skeleton className="h-6 w-24 rounded-md" />
            <Skeleton className="mt-4 h-4 w-full rounded-md" />
            <Skeleton className="mt-2 h-4 w-9/12 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
