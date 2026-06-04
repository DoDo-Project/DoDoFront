import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { PetDetailResponse } from '@/features/auth';
import { PetSpecialNotesSection } from '@/features/pet-special-notes';
import petDefaultCatIllustration from '@/shared/assets/images/pet-default-cat.svg';
import petDefaultIllustration from '@/shared/assets/images/pet-default.svg';

import {
  formatPetDateLabel,
  formatPetSexAccentClass,
  formatPetSexLabel,
  formatPetSpeciesLabel,
} from '../lib/formatters';

function InfoCard({ title, children, fullWidth = false }: { title: string; children: ReactNode; fullWidth?: boolean }) {
  return (
    <section
      className={[
        'rounded-[24px] border border-neutral-200 bg-white px-6 py-5 shadow-sm',
        fullWidth ? 'lg:col-span-2' : '',
      ].join(' ')}
    >
      <h2 className="text-[17px] font-medium text-neutral-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PetImage({ src, alt, species }: { src: string | null; alt: string; species: string }) {
  const fallbackImage = species === 'FELINE' ? petDefaultCatIllustration : petDefaultIllustration;

  return (
    <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[22px] bg-neutral-100 sm:h-28 sm:w-28">
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
  );
}

function formatWeightContent(pet: PetDetailResponse) {
  if (!pet.weightInfo || pet.weightInfo.currentWeight == null) {
    return '현재 등록된 체중 정보가 없습니다.';
  }

  return `현재 ${pet.weightInfo.currentWeight} · ${pet.weightInfo.weightTrend}`;
}

export function PetDetailContent({ pet }: { pet: PetDetailResponse }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET DETAIL</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">반려동물 상세정보</h1>
      </div>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
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
        <InfoCard title="기본 정보">
          <DetailRows
            rows={[
              { label: '등록번호', value: String(pet.registrationNumber ?? '미등록') },
              { label: '디바이스 ID', value: pet.deviceId || '미등록' },
              { label: '기준 심박수', value: String(pet.referenceHeartRate) },
            ]}
          />
        </InfoCard>

        <InfoCard title="체중 정보">
          <p className="text-sm leading-7 text-neutral-600">{formatWeightContent(pet)}</p>
        </InfoCard>

        <InfoCard title="가족 구성원">
          <p className="text-sm leading-7 text-neutral-600">
            {pet.familyMembers.length > 0
              ? pet.familyMembers.map((member) => member.userName).join(', ')
              : '등록된 가족 구성원이 없습니다.'}
          </p>
        </InfoCard>

        <InfoCard title="최근 활동">
          <p className="text-sm leading-7 text-neutral-600">
            {pet.lastActivity
              ? `${pet.lastActivity.activityType} · ${pet.lastActivity.distance}km`
              : '최근 활동 정보가 없습니다.'}
          </p>
        </InfoCard>

        <InfoCard title={`특이사항 (${pet.specialNotesCount})`} fullWidth>
          <PetSpecialNotesSection petId={pet.petId} fallbackCount={pet.specialNotesCount} />
        </InfoCard>
      </div>
    </div>
  );
}
