import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import {
  useFamilyApplications,
  useFamilyPendingUsers,
  usePetDetail,
  usePetList,
  type FamilyApplicationItem,
  type FamilyPendingUser,
  type PetFamilyMember,
  type PetListItem,
} from '@/features/auth';
import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import petDefaultCatIllustration from '@/shared/assets/images/pet-default-cat.svg';
import petDefaultIllustration from '@/shared/assets/images/pet-default.svg';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { Skeleton } from '@/shared/ui';

function formatSpeciesLabel(species: string) {
  if (species === 'CANINE') return '강아지';
  if (species === 'FELINE') return '고양이';
  return species;
}

function formatBirthLabel(birth: string) {
  const [year = '', month = '', day = ''] = birth.slice(0, 10).split('-');
  return [year, month, day].filter(Boolean).join('. ');
}

function getSexLabel(sex: string) {
  if (sex === 'MALE') return '남아';
  if (sex === 'FEMALE') return '여아';
  return '중성화';
}

function formatRequestedAt(value: string) {
  if (!value) return '-';
  return value.slice(0, 16).replace('T', ' ');
}

function formatApplicationStatus(status: string) {
  if (status === 'PENDING') return '승인 대기';
  if (status === 'APPROVED') return '승인 완료';
  if (status === 'REJECTED') return '거절됨';
  return status;
}

function getApplicationStatusClass(status: string) {
  if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-600';
  if (status === 'REJECTED') return 'bg-rose-50 text-rose-500';
  return 'bg-amber-50 text-amber-600';
}

function PetImage({ src, alt, species }: { src: string | null; alt: string; species: string }) {
  const fallbackImage = species === 'FELINE' ? petDefaultCatIllustration : petDefaultIllustration;

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[18px] bg-neutral-100 sm:h-28 sm:w-28">
      <img
        src={src || fallbackImage}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = fallbackImage;
        }}
      />
    </div>
  );
}

function ProfileImage({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-100">
      <img
        src={src || profileDefaultIllustration}
        alt={alt}
        className="h-full w-full object-cover"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = profileDefaultIllustration;
        }}
      />
    </div>
  );
}

function SectionCard({ badge, title, children }: { badge: string; title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 bg-linear-to-r from-brand/[0.05] via-white to-white px-5 py-5 sm:px-6">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-brand">{badge}</p>
        <h2 className="mt-2 text-[17px] font-medium text-neutral-950">{title}</h2>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

function SectionContentSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
          <Skeleton className="h-4 w-32 rounded-md" />
          <Skeleton className="mt-3 h-4 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

function EmptySectionMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-neutral-200 bg-neutral-50/60 px-4 py-8 text-center">
      <p className="text-sm leading-7 text-neutral-500">{message}</p>
    </div>
  );
}

function ErrorSectionMessage({ message }: { message: string }) {
  return (
    <div className="rounded-[16px] border border-red-100 bg-red-50/70 px-4 py-4">
      <p className="text-sm leading-7 text-red-500">{message}</p>
    </div>
  );
}

function FamilyManagementLoadingState() {
  return (
    <div className="space-y-5">
      <div>
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="mt-4 h-8 w-48 rounded-lg" />
      </div>

      <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-24 w-24 rounded-[18px] sm:h-28 sm:w-28" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-28 rounded-lg" />
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-32 rounded-md" />
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
            <Skeleton className="h-10 w-full rounded-xl sm:w-28" />
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
            <div className="px-5 py-5 sm:px-6">
              <Skeleton className="h-3 w-20 rounded-md" />
              <Skeleton className="mt-3 h-6 w-40 rounded-lg" />
              <div className="mt-4 space-y-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FamilyManagementErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[320px] items-center">
      <div className="w-full overflow-hidden rounded-[16px] border border-red-100 bg-white">
        <div className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-red-500">ERROR</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900 sm:text-[28px]">
            가족 관리 정보를 불러오지 못했어요
          </h1>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <p className="max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
            반려동물 목록을 다시 확인한 뒤 가족 관리 화면을 준비할게요. 잠시 후 다시 시도해 주세요.
          </p>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-w-32 items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}

function FamilyManagementEmptyState() {
  return (
    <section className="flex h-full items-start">
      <div className="w-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top,rgba(229,108,49,0.1),transparent_40%)] px-6 py-12 text-center sm:px-8 sm:py-14">
          <p className="text-[16px] font-medium leading-8 text-neutral-950 sm:text-[18px]">
            가족을 관리하려면 먼저 반려동물을 등록해 주세요.
          </p>

          <Link
            to="/my/pets/new"
            className="mt-4 inline-flex min-w-56 items-center justify-center rounded-2xl bg-brand px-8 py-4 text-[16px] font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            반려동물 등록하기
          </Link>
        </div>
      </div>
    </section>
  );
}

function PetSelector({
  pets,
  selectedPetId,
  onSelect,
}: {
  pets: PetListItem[];
  selectedPetId: number;
  onSelect: (petId: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">SELECT PET</p>
        <h2 className="mt-2 text-[18px] font-medium text-neutral-950">가족을 관리할 반려동물을 선택해 주세요</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          {pets.map((pet) => {
            const active = pet.petId === selectedPetId;

            return (
              <button
                key={pet.petId}
                type="button"
                onClick={() => onSelect(pet.petId)}
                className={[
                  'inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition-all',
                  active
                    ? 'border-brand bg-brand text-brand-foreground shadow-[0_8px_18px_rgba(217,123,58,0.18)]'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-brand/40 hover:text-brand',
                ].join(' ')}
              >
                {pet.petName}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SelectedPetOverview({
  pet,
  familyCount,
  familyCountLoading,
}: {
  pet: PetListItem;
  familyCount: number;
  familyCountLoading: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <PetImage src={pet.imageFileUrl} alt={pet.petName} species={pet.species} />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-medium text-neutral-950">{pet.petName}</h2>
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                {familyCountLoading ? '가족 불러오는 중' : `가족 ${familyCount}명`}
              </span>
            </div>

            <div className="mt-2.5 space-y-1 text-[15px] font-medium text-neutral-800">
              <p>
                {formatBirthLabel(pet.birth)} <span className="text-neutral-500">(만 {pet.age}살)</span>
              </p>
              <p>
                {formatSpeciesLabel(pet.species)} <span className="text-neutral-500">{pet.breed}</span>
              </p>
              <p>
                <span className="text-neutral-500">성별 </span>
                {getSexLabel(pet.sex)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            to={`/my/pets/${pet.petId}`}
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand sm:w-28"
          >
            상세 정보
          </Link>
          <button
            type="button"
            disabled
            className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-medium text-neutral-500 disabled:cursor-not-allowed sm:w-28"
          >
            코드 준비
          </button>
        </div>
      </div>
    </article>
  );
}

function FamilyMembersSection({
  members,
  isLoading,
  errorMessage,
}: {
  members: PetFamilyMember[];
  isLoading: boolean;
  errorMessage: string | null;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (members.length === 0) {
    return <EmptySectionMessage message="아직 등록된 가족 구성원이 없어요." />;
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.userId}
          className="flex items-center gap-3 rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4"
        >
          <ProfileImage src={member.profileImageUrl || null} alt={member.userName} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900">{member.userName}</p>
            <p className="mt-1 text-xs font-medium text-neutral-500">현재 함께 관리 중인 가족 구성원</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingRequestsSection({
  requests,
  isLoading,
  errorMessage,
}: {
  requests: FamilyPendingUser[];
  isLoading: boolean;
  errorMessage: string | null;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (requests.length === 0) {
    return <EmptySectionMessage message="선택한 반려동물로 들어온 가족 신청이 아직 없어요." />;
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <div
          key={`${request.targetPetId}-${request.userId}`}
          className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4"
        >
          <div className="flex items-start gap-3">
            <ProfileImage src={request.profileUrl || null} alt={request.nickname} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-neutral-900">{request.nickname}</p>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                  승인 대기
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-neutral-600">{request.targetPetName} 가족으로 신청했어요.</p>
              <p className="mt-1 text-xs font-medium text-neutral-400">{formatRequestedAt(request.requestedAt)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ApplicationsSection({
  applications,
  isLoading,
  errorMessage,
}: {
  applications: FamilyApplicationItem[];
  isLoading: boolean;
  errorMessage: string | null;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (applications.length === 0) {
    return <EmptySectionMessage message="아직 가족 신청을 보낸 내역이 없어요." />;
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => (
        <div
          key={`${application.petId}-${application.requestedAt}`}
          className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4"
        >
          <div className="flex items-start gap-3">
            <PetImage src={application.petImageUrl} alt={application.petName} species="CANINE" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-neutral-900">{application.petName}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getApplicationStatusClass(application.status)}`}
                >
                  {formatApplicationStatus(application.status)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-neutral-600">가족 신청을 보낸 반려동물이에요.</p>
              <p className="mt-1 text-xs font-medium text-neutral-400">{formatRequestedAt(application.requestedAt)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function FamilyManagementContent() {
  const { data, isLoading, isError, refetch } = usePetList({ page: 0, size: 10 });
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const pets = data?.pets ?? [];
  const selectedPet = (selectedPetId ? pets.find((pet) => pet.petId === selectedPetId) : null) ?? pets[0] ?? null;

  const petDetailQuery = usePetDetail(selectedPet?.petId ?? null);
  const pendingUsersQuery = useFamilyPendingUsers({ page: 0, size: 20 });
  const applicationsQuery = useFamilyApplications({ page: 0, size: 20 });

  if (isLoading) {
    return <FamilyManagementLoadingState />;
  }

  if (isError) {
    return <FamilyManagementErrorState onRetry={() => void refetch()} />;
  }

  if (!data || pets.length === 0 || !selectedPet) {
    return <FamilyManagementEmptyState />;
  }

  const filteredPendingUsers =
    pendingUsersQuery.data?.users.filter((user) => user.targetPetId === selectedPet.petId) ?? [];
  const familyMembers = petDetailQuery.data?.familyMembers ?? [];
  const familyMembersErrorMessage = petDetailQuery.isError
    ? getApiErrorMessage(petDetailQuery.error, '가족 구성원 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;
  const pendingErrorMessage = pendingUsersQuery.isError
    ? getApiErrorMessage(pendingUsersQuery.error, '받은 신청 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;
  const applicationsErrorMessage = applicationsQuery.isError
    ? getApiErrorMessage(applicationsQuery.error, '내 신청 내역을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.')
    : null;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">FAMILY</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">반려동물 가족 관리</h1>
      </div>

      <PetSelector pets={pets} selectedPetId={selectedPet.petId} onSelect={setSelectedPetId} />
      <SelectedPetOverview
        pet={selectedPet}
        familyCount={familyMembers.length}
        familyCountLoading={petDetailQuery.isLoading || petDetailQuery.isFetching}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <SectionCard badge="INVITE CODE" title="가족 초대 코드">
          <div className="rounded-[16px] border border-neutral-200 bg-neutral-50/80 px-4 py-4">
            <p className="text-sm leading-7 text-neutral-600">
              선택한 반려동물 기준으로 초대 코드를 발급하고, 만료 시간과 재발급 상태를 이 영역에서 관리할 예정이에요.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="mt-4 inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            코드 준비 중
          </button>
        </SectionCard>

        <SectionCard badge="FAMILY MEMBERS" title="현재 가족 구성원">
          <FamilyMembersSection
            members={familyMembers}
            isLoading={petDetailQuery.isLoading || petDetailQuery.isFetching}
            errorMessage={familyMembersErrorMessage}
          />
        </SectionCard>

        <SectionCard badge="PENDING REQUESTS" title="받은 신청 목록">
          <PendingRequestsSection
            requests={filteredPendingUsers}
            isLoading={pendingUsersQuery.isLoading || pendingUsersQuery.isFetching}
            errorMessage={pendingErrorMessage}
          />
        </SectionCard>

        <SectionCard badge="MY APPLICATIONS" title="내 신청 내역">
          <ApplicationsSection
            applications={applicationsQuery.data?.applications ?? []}
            isLoading={applicationsQuery.isLoading || applicationsQuery.isFetching}
            errorMessage={applicationsErrorMessage}
          />
        </SectionCard>
      </div>
    </div>
  );
}
