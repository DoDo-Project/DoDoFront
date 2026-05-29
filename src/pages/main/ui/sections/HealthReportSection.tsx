import { Link } from 'react-router-dom';

import DoctorIcon from '@/pages/main/assets/doctor.svg?react';
import FolderIcon from '@/pages/main/assets/report.svg?react';
import PetIcon from '@/pages/main/assets/register-pet.svg?react';

export function HealthReportSection() {
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
