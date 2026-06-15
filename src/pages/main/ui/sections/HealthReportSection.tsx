import { Link } from 'react-router-dom';

import { PetImage } from '@/features/family-management/ui/FamilyVisuals';
import DoctorIcon from '@/pages/main/assets/doctor.svg?react';
import FolderIcon from '@/pages/main/assets/report.svg?react';
import PetIcon from '@/pages/main/assets/register-pet.svg?react';
import type { MainHealthReport, MainPetProfile } from '@/pages/main/model/types';
import petDefaultCatIllustration from '@/shared/assets/images/pet-default-cat.svg';
import petDefaultIllustration from '@/shared/assets/images/pet-default.svg';
import { Skeleton } from '@/shared/ui';

import {
  extractHealthReportRecommendations,
  formatDateLabel,
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
  if (isLoading) {
    return (
      <section className="w-full" aria-labelledby="home-health-report-heading">
        <h2 id="home-health-report-heading" className="sr-only">
          AI 건강 레포트
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5">
          <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-7 w-7 shrink-0" />
              <span className="text-[16px] font-semibold text-neutral-900">AI 건강 레포트</span>
            </div>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <Skeleton className="h-28 w-28 rounded-[24px] sm:h-32 sm:w-32" />
              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-7 w-4/5 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
          </article>

          <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-4">
              <Skeleton className="h-24 w-24 rounded-[20px]" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-7 w-24 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
              </div>
            </div>
            <div className="mt-4 flex gap-2.5 border-t border-neutral-200 pt-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-12 rounded-[12px]" />
              ))}
            </div>
          </article>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="w-full" aria-labelledby="home-health-report-heading">
        <h2 id="home-health-report-heading" className="sr-only">
          AI 건강 레포트
        </h2>

        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-5 shadow-sm sm:p-6">
          <p className="text-sm leading-6 text-red-500">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            다시 불러오기
          </button>
        </div>
      </section>
    );
  }

  if (!selectedPet) {
    return (
      <section className="w-full" aria-labelledby="home-health-report-heading">
        <h2 id="home-health-report-heading" className="sr-only">
          AI 건강 레포트
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5">
          <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 md:p-7">
            <div className="flex items-center gap-2">
              <FolderIcon className="h-7 w-7 shrink-0" />
              <span className="text-[16px] font-semibold text-neutral-900">AI 건강 레포트</span>
            </div>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
              <DoctorIcon className="mx-auto h-32 w-32 shrink-0 sm:mx-0 sm:h-40 sm:w-40" />
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
                  반려동물을 등록하고
                  <br className="hidden sm:block" /> 건강 레포트를 받아보세요!
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-neutral-600">
                  산책·식사·활동 기록을 기반으로 한 AI 건강 리포트를 제공합니다.
                  <br />
                  지금 반려동물을 등록하고 관리 기록을 시작해보세요!
                </p>
              </div>
            </div>
          </article>

          <article className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:gap-6 sm:p-6 md:p-7">
            <PetIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <p className="text-center text-sm font-medium leading-relaxed text-neutral-700">
              반려동물을 등록하고
              <br />
              다양한 서비스를 경험해 보세요!
            </p>
            <Link
              to="/my"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-brand-foreground transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              반려동물 등록하기
            </Link>
          </article>
        </div>
      </section>
    );
  }

  const selectedSpecies = getMainPetSpecies(selectedPet);
  const reportRecommendations = selectedReport
    ? extractHealthReportRecommendations(selectedReport.healthReportContent)
    : [];
  const reportPrimaryContent =
    reportRecommendations[0] || (selectedReport ? summarizeContent(selectedReport.healthReportContent, 96) : '');

  return (
    <section className="w-full" aria-labelledby="home-health-report-heading">
      <h2 id="home-health-report-heading" className="sr-only">
        AI 건강 레포트
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5">
        <article className="overflow-hidden rounded-[24px] border border-neutral-300 bg-white px-5 py-5 shadow-sm sm:px-6 sm:py-6">
          <div className="flex items-center gap-2">
            <FolderIcon className="h-7 w-7 shrink-0" />
            <span className="text-[16px] font-semibold text-neutral-900">AI 건강 레포트</span>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            <DoctorIcon className="mx-auto h-28 w-28 shrink-0 sm:mx-0 sm:h-36 sm:w-36" />

            <div className="min-w-0 flex-1">
              <h3 className="text-[22px] font-bold leading-snug text-neutral-950 sm:text-[24px]">
                {selectedReport?.healthReportTitle ?? `${selectedPet.name}의 건강 데이터를 분석 중이에요.`}
              </h3>

              <div className="mt-3 space-y-1 text-[14px] leading-7 text-neutral-800 sm:text-[15px]">
                {selectedReport ? (
                  <>
                    <p>{selectedReport.healthReportSummary}</p>
                    <p>{reportPrimaryContent}</p>
                    {reportRecommendations.length > 1 ? <p>{reportRecommendations[1]}</p> : null}
                  </>
                ) : (
                  <p>{selectedPet.name}의 첫 건강 레포트를 만들 수 있도록 산책과 건강 기록을 조금 더 쌓아보세요.</p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <span className="shrink-0 text-[14px] text-neutral-400">
                  {selectedReport ? formatDateLabel(selectedReport.checkupDate) : '레포트 준비 중'}
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[24px] border border-neutral-300 bg-white shadow-sm">
          <div className="px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex items-start gap-3.5">
              <div className="h-[96px] w-[96px] overflow-hidden rounded-[18px]">
                <PetImage src={selectedPet.imageFileUrl} alt={selectedPet.name} species={selectedSpecies} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate pt-0.5 text-[24px] font-bold leading-none text-neutral-950">
                    {selectedPet.name}
                  </h3>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                    만 {selectedPet.age}세
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-neutral-50 px-3 py-2.5">
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-neutral-400">품종</p>
                    <p className="mt-1 truncate text-sm font-semibold text-neutral-900">{selectedPet.breed || '-'}</p>
                  </div>
                  <div className="rounded-xl bg-neutral-50 px-3 py-2.5">
                    <p className="text-[11px] font-semibold tracking-[0.08em] text-neutral-400">체중</p>
                    <p className="mt-1 truncate text-sm font-semibold text-neutral-900">
                      {formatWeightLabel(selectedPet.weight)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200 px-4 py-3 sm:px-5">
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {pets.map((pet) => {
                const species = getMainPetSpecies(pet);
                const fallbackImage = species === 'FELINE' ? petDefaultCatIllustration : petDefaultIllustration;
                const isActive = pet.petId === selectedPetId;

                return (
                  <button
                    key={pet.petId}
                    type="button"
                    onClick={() => onSelectPet(pet.petId)}
                    className={[
                      'shrink-0 overflow-hidden rounded-[12px] border-2 transition-all',
                      isActive ? 'border-[#f0c247] shadow-sm' : 'border-transparent opacity-80 hover:opacity-100',
                    ].join(' ')}
                    aria-pressed={isActive}
                    aria-label={`${pet.name} 선택`}
                  >
                    <div className="flex h-[56px] w-[56px] items-center justify-center overflow-hidden rounded-[10px] bg-neutral-100 p-1">
                      <img
                        src={pet.imageFileUrl || fallbackImage}
                        alt={pet.name}
                        className="h-full w-full rounded-[8px] object-cover"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackImage;
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
