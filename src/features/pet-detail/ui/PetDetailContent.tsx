import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { getApiErrorMessage, useLeavePetFamily, type PetDetailResponse } from '@/features/auth';
import { PetSpecialNotesPreview } from '@/features/pet-special-notes';
import { PetWeightPreview } from '@/features/pet-weight';
import petDefaultCatIllustration from '@/shared/assets/images/pet-default-cat.svg';
import petDefaultIllustration from '@/shared/assets/images/pet-default.svg';
import { Modal } from '@/shared/ui/Modal';

import {
  formatPetDateLabel,
  formatPetSexAccentClass,
  formatPetSexLabel,
  formatPetSpeciesLabel,
} from '../lib/formatters';

function InfoCard({
  title,
  children,
  fullWidth = false,
  action,
  contentClassName = 'mt-3',
  tone = 'default',
}: {
  title: string;
  children: ReactNode;
  fullWidth?: boolean;
  action?: ReactNode;
  contentClassName?: string;
  tone?: 'default' | 'accent' | 'muted';
}) {
  return (
    <section
      className={[
        'rounded-[20px] border px-6 py-5 shadow-sm',
        tone === 'accent'
          ? 'border-neutral-200 bg-linear-to-br from-white via-white to-brand/[0.035] shadow-[0_12px_28px_rgba(15,23,42,0.05)]'
          : tone === 'muted'
            ? 'border-neutral-200/90 bg-neutral-50/70 shadow-[0_8px_22px_rgba(15,23,42,0.03)]'
            : 'border-neutral-200 bg-white',
        fullWidth ? 'lg:col-span-2' : '',
      ].join(' ')}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">INFO</p>
          <h2 className="mt-1 text-[17px] font-medium text-neutral-950">{title}</h2>
        </div>
        {action}
      </div>
      <div className={contentClassName}>{children}</div>
    </section>
  );
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

function DetailRows({ rows }: { rows: Array<{ label: string; value: string }> }) {
  return (
    <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
      <div className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 border-b border-neutral-100 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-medium text-neutral-500">{row.label}</span>
            <span className="text-sm font-medium text-neutral-900">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FamilyLeaveCard({ pet }: { pet: PetDetailResponse }) {
  const navigate = useNavigate();
  const leavePetFamilyMutation = useLeavePetFamily();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const errorMessage = leavePetFamilyMutation.isError
    ? getApiErrorMessage(leavePetFamilyMutation.error, '가족 나가기에 실패했어요. 잠시 후 다시 시도해 주세요.')
    : null;

  const handleLeaveFamily = async () => {
    try {
      await leavePetFamilyMutation.mutateAsync({ petId: pet.petId });
      setIsModalOpen(false);
      void navigate('/my?menu=pet-list');
    } catch {
      // Error messaging is handled by the mutation state shown in the card/modal.
    }
  };

  return (
    <>
      <InfoCard title="펫 가족 나가기" fullWidth tone="muted" contentClassName="mt-4">
        <div className="rounded-[16px] border border-rose-100 bg-white/90 px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-900">
                현재 <span className="text-brand">{pet.petName}</span>의 가족으로 연결되어 있어요.
              </p>
              <p className="text-sm leading-6 text-neutral-500">
                가족에서 나가면 이 반려동물의 가족 구성원 목록과 관련 관리 화면에서 제외돼요. 다시 참여하려면 초대
                코드를 통해 다시 신청해야 할 수 있어요.
              </p>
              {errorMessage ? <p className="text-sm font-medium text-rose-500">{errorMessage}</p> : null}
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={leavePetFamilyMutation.isPending}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-rose-200 bg-white px-4 text-sm font-medium text-rose-500 transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-36"
            >
              {leavePetFamilyMutation.isPending ? '처리 중...' : '가족 나가기'}
            </button>
          </div>
        </div>
      </InfoCard>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} ariaLabel="펫 가족 나가기 확인">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-neutral-400">FAMILY</p>
            <h2 className="mt-2 text-lg font-semibold text-neutral-950">정말 가족에서 나갈까요?</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              <span className="font-medium text-neutral-800">{pet.petName}</span>의 가족에서 나가면 관련 관리 권한이
              해제되고, 다시 들어오려면 초대 코드가 다시 필요할 수 있어요.
            </p>
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-500">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={leavePetFamilyMutation.isPending}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => void handleLeaveFamily()}
              disabled={leavePetFamilyMutation.isPending}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-rose-200 bg-rose-500 px-4 text-sm font-medium text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {leavePetFamilyMutation.isPending ? '처리 중...' : '가족 나가기'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export function PetDetailContent({ pet }: { pet: PetDetailResponse }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET DETAIL</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">반려동물 상세정보</h1>
      </div>

      <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <PetImage src={pet.imageFileUrl} alt={pet.petName} species={pet.species} />

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[18px] font-medium text-neutral-950 sm:text-[20px]">
                  {pet.petName}
                  <span className={`ml-1 ${formatPetSexAccentClass(pet.sex)}`}>
                    {pet.sex === 'MALE' ? '♂' : pet.sex === 'FEMALE' ? '♀' : ''}
                  </span>
                </h2>
              </div>

              <div className="mt-2.5 space-y-1 text-[15px] font-medium text-neutral-800">
                <p>
                  {formatPetDateLabel(pet.birth)} <span className="text-neutral-500">(만 {pet.age}세)</span>
                </p>
                <p>
                  {formatPetSpeciesLabel(pet.species)} <span className="text-neutral-500">{pet.breed}</span>
                </p>
                <p>
                  <span className="text-neutral-500">성별 </span>
                  {formatPetSexLabel(pet.sex)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Link
              to="/my?menu=pet-list"
              className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand sm:w-28"
            >
              목록으로
            </Link>
            <Link
              to={`/my/pets/${pet.petId}/edit`}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand sm:w-28"
            >
              정보 수정
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard title="기본 정보" tone="accent">
          <DetailRows
            rows={[
              { label: '등록번호', value: String(pet.registrationNumber ?? '미등록') },
              { label: '디바이스 ID', value: pet.deviceId || '미등록' },
              { label: '기준 심박수', value: String(pet.referenceHeartRate) },
            ]}
          />
        </InfoCard>

        <InfoCard
          title="체중 정보"
          tone="accent"
          action={
            <Link
              to={`/my/pets/${pet.petId}/weight`}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
            >
              전체 보기
            </Link>
          }
        >
          <PetWeightPreview petId={pet.petId} />
        </InfoCard>

        <InfoCard title="가족 구성원" tone="muted">
          <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
            <p className="text-sm leading-7 text-neutral-600">
              {pet.familyMembers.length > 0
                ? pet.familyMembers.map((member) => member.userName).join(', ')
                : '등록된 가족 구성원이 없습니다.'}
            </p>
          </div>
        </InfoCard>

        <InfoCard title="최근 활동" tone="muted">
          <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
            <p className="text-sm leading-7 text-neutral-600">
              {pet.lastActivity
                ? `${pet.lastActivity.activityType} · ${pet.lastActivity.distance}km`
                : '최근 활동 정보가 없습니다.'}
            </p>
          </div>
        </InfoCard>

        <InfoCard
          title="특이사항"
          fullWidth
          tone="muted"
          contentClassName="mt-2"
          action={
            <Link
              to={`/my/pets/${pet.petId}/notes`}
              className="inline-flex h-9 items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand"
            >
              전체 보기
            </Link>
          }
        >
          <PetSpecialNotesPreview petId={pet.petId} fallbackCount={pet.specialNotesCount} />
        </InfoCard>

        <FamilyLeaveCard pet={pet} />
      </div>
    </div>
  );
}
