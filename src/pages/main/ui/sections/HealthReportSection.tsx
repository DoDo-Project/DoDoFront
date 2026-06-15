import { Link } from 'react-router-dom';

import DoctorIcon from '@/pages/main/assets/doctor.svg?react';
import FolderIcon from '@/pages/main/assets/report.svg?react';
import RegisterPetIcon from '@/pages/main/assets/register-pet.svg?react';
import type { MainHealthReport, MainPetProfile } from '@/pages/main/model/types';
import { PetImage } from '@/features/family-management/ui/FamilyVisuals';
import { Skeleton } from '@/shared/ui';

import {
  formatDateLabel,
  formatSexLabel,
  formatSpeciesLabel,
  formatWeightLabel,
  getMainPetSpecies,
  summarizeContent,
} from '../../model/formatters';

interface HealthReportSectionProps {
  isLoading: boolean;
  errorMessage: string | null;
  pets: MainPetProfile[];
  selectedPetId: number | null;
  selectedPet: MainPetProfile | null;
  selectedReport?: MainHealthReport;
  onSelectPet: (petId: number) => void;
  onRetry: () => void;
}

export function HealthReportSection({
  isLoading,
  errorMessage,
  pets,
  selectedPetId,
  selectedPet,
  selectedReport,
  onSelectPet,
  onRetry,
}: HealthReportSectionProps) {
  return (
    <section className="w-full" aria-labelledby="home-health-report-heading">
      <h2 id="home-health-report-heading" className="sr-only">
        AI 건강 레포트
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,1fr)] lg:gap-5">
        <article className="overflow-hidden rounded-[28px] border border-[#eadfd7] bg-[linear-gradient(135deg,#fff9f2_0%,#ffffff_48%,#fff4ea_100%)] p-5 shadow-[0_18px_50px_rgba(203,138,82,0.08)] sm:p-6 md:p-7">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-7 w-7 shrink-0" />
            <span className="text-[18px] font-semibold text-neutral-950">AI 건강 레포트</span>
          </div>

          {isLoading ? (
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <Skeleton className="h-32 w-32 rounded-[28px] sm:h-40 sm:w-40" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-40 rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
            </div>
          ) : errorMessage ? (
            <div className="mt-6 rounded-[24px] border border-red-100 bg-white/90 p-5">
              <p className="text-sm leading-6 text-red-500">{errorMessage}</p>
              <button
                type="button"
                onClick={onRetry}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
              >
                다시 불러오기
              </button>
            </div>
          ) : !selectedPet ? (
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <RegisterPetIcon className="mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-36 sm:w-36" />
              <div className="min-w-0 flex-1">
                <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-[#c46f3e]">
                  WELCOME TO DODO
                </span>
                <h3 className="mt-4 text-xl font-bold leading-snug text-neutral-950 sm:text-[30px]">
                  반려동물을 등록하고
                  <br className="hidden sm:block" />
                  맞춤 건강 레포트를 받아보세요
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  반려동물 프로필과 기록이 쌓이면 메인에서 바로 확인할 수 있는 AI 건강 레포트를 제공해 드려요.
                </p>
                <Link
                  to="/my/pets/new"
                  className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90"
                >
                  반려동물 등록하러 가기
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="mx-auto flex h-32 w-32 shrink-0 items-center justify-center rounded-[28px] bg-white/80 ring-1 ring-[#f2dcc9] sm:mx-0 sm:h-40 sm:w-40">
                <DoctorIcon className="h-24 w-24 sm:h-32 sm:w-32" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#c46f3e] ring-1 ring-[#f2dcc9]">
                    {selectedPet.name} 맞춤 분석
                  </span>
                  {selectedReport ? (
                    <span className="text-sm text-neutral-500">{formatDateLabel(selectedReport.checkupDate)} 기준</span>
                  ) : null}
                </div>

                {selectedReport ? (
                  <>
                    <h3 className="mt-4 text-xl font-bold leading-snug text-neutral-950 sm:text-[30px]">
                      "{selectedReport.healthReportTitle}"
                    </h3>
                    <p className="mt-3 text-[15px] font-medium leading-7 text-neutral-700">
                      {selectedReport.healthReportSummary}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-neutral-500">
                      {summarizeContent(selectedReport.healthReportContent)}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="mt-4 text-xl font-bold leading-snug text-neutral-950 sm:text-[30px]">
                      {selectedPet.name}의 첫 건강 레포트를 준비해 볼까요?
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-600">
                      아직 등록된 AI 건강 레포트가 없어요. 산책, 체중, 특이사항 기록이 쌓이면 더 정교한 분석을 확인할 수
                      있어요.
                    </p>
                  </>
                )}

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/my/pets/${selectedPet.petId}`}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                  >
                    {selectedReport ? '반려동물 상세 보기' : '기록 관리하러 가기'}
                  </Link>
                  <Link
                    to="/walk"
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold text-neutral-800 transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    산책 기록 보러가기
                  </Link>
                </div>
              </div>
            </div>
          )}
        </article>

        <article className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-5 py-5 sm:px-6 sm:py-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">SELECT PET</p>
                <h3 className="mt-2 text-[22px] font-semibold text-neutral-950">반려동물 프로필</h3>
              </div>
              {pets.length > 0 ? (
                <span className="rounded-full bg-[#fff4ea] px-3 py-1 text-xs font-semibold text-[#c46f3e]">
                  총 {pets.length}마리
                </span>
              ) : null}
            </div>

            {isLoading ? (
              <div className="mt-5 flex items-center gap-4">
                <Skeleton className="h-24 w-24 rounded-[20px]" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              </div>
            ) : selectedPet ? (
              <div className="mt-5 flex items-center gap-4">
                <PetImage
                  src={selectedPet.imageFileUrl}
                  alt={selectedPet.name}
                  species={getMainPetSpecies(selectedPet)}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-[28px] font-bold text-neutral-950">{selectedPet.name}</h4>
                  <div className="mt-3 space-y-1.5 text-sm text-neutral-600">
                    <p>
                      만 {selectedPet.age}세 · {formatSpeciesLabel(getMainPetSpecies(selectedPet))}
                    </p>
                    <p>
                      {selectedPet.breed} · {formatSexLabel(selectedPet.sex)}
                    </p>
                    <p>{formatWeightLabel(selectedPet.weight)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm leading-7 text-neutral-500">아직 등록된 반려동물이 없어요.</p>
            )}
          </div>

          <div className="px-5 py-4 sm:px-6 sm:py-5">
            {isLoading ? (
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-16 rounded-[18px]" />
                ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {pets.map((pet) => {
                  const species = getMainPetSpecies(pet);
                  const isActive = pet.petId === selectedPetId;

                  return (
                    <button
                      key={pet.petId}
                      type="button"
                      onClick={() => onSelectPet(pet.petId)}
                      className={[
                        'group flex shrink-0 flex-col items-center gap-2 rounded-[20px] border px-2 py-2 transition-all',
                        isActive
                          ? 'border-[#f0b37e] bg-[#fff4ea] shadow-[0_10px_25px_rgba(222,136,70,0.18)]'
                          : 'border-neutral-200 bg-white hover:border-brand/40 hover:bg-[#fffaf5]',
                      ].join(' ')}
                    >
                      <PetImage src={pet.imageFileUrl} alt={pet.name} species={species} />
                      <span className="max-w-20 truncate text-sm font-semibold text-neutral-800">{pet.name}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <Link
                to="/my/pets/new"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand/40 hover:text-brand"
              >
                첫 반려동물 등록하기
              </Link>
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
