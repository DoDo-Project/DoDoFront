import { Link } from 'react-router-dom';

import type { PetDetailResponse } from '@/features/auth';

import { formatPetDateLabel, formatPetSexLabel, formatPetSpeciesLabel } from '../lib/formatters';

function InfoCard({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-[24px] border border-neutral-200 bg-white px-6 py-5 shadow-sm">
      <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base">{content}</p>
    </section>
  );
}

export function PetDetailContent({ pet }: { pet: PetDetailResponse }) {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">PET DETAIL</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-950">{pet.petName}</h1>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-3 text-sm leading-7 text-neutral-700 sm:text-base">
            <p>
              <strong className="mr-2 text-neutral-950">종</strong>
              {formatPetSpeciesLabel(pet.species)} / {pet.breed}
            </p>
            <p>
              <strong className="mr-2 text-neutral-950">성별</strong>
              {formatPetSexLabel(pet.sex)}
            </p>
            <p>
              <strong className="mr-2 text-neutral-950">생년월일</strong>
              {formatPetDateLabel(pet.birth)}
            </p>
            <p>
              <strong className="mr-2 text-neutral-950">나이</strong>만 {pet.age}세
            </p>
            <p>
              <strong className="mr-2 text-neutral-950">등록번호</strong>
              {pet.registrationNumber ?? '미등록'}
            </p>
            <p>
              <strong className="mr-2 text-neutral-950">디바이스 ID</strong>
              {pet.deviceId}
            </p>
            <p>
              <strong className="mr-2 text-neutral-950">기준 심박수</strong>
              {pet.referenceHeartRate}
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
              title="몸무게 기록 추가/조회 API 연결은 다음 이슈에서 진행 예정"
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
            pet.familyMembers.length > 0
              ? pet.familyMembers.map((member) => member.userName).join(', ')
              : '등록된 가족 구성원이 없습니다.'
          }
        />
        <InfoCard
          title="체중 정보"
          content={
            pet.weightInfo
              ? `현재 ${pet.weightInfo.currentWeight}kg · ${pet.weightInfo.weightTrend}`
              : '체중 정보가 아직 없습니다. TODO: 반려동물 몸무게 기록 추가 API와 연결 예정'
          }
        />
        <InfoCard
          title="최근 활동"
          content={
            pet.lastActivity
              ? `${pet.lastActivity.activityType} · ${pet.lastActivity.distance}km`
              : '최근 활동 정보가 없습니다.'
          }
        />
        <InfoCard
          title={`특이사항 (${pet.specialNotesCount})`}
          content={
            pet.specialNotes.length > 0
              ? pet.specialNotes.map((note) => note.noteContent).join(' / ')
              : '등록된 특이사항이 없습니다.'
          }
        />
      </div>
    </div>
  );
}
