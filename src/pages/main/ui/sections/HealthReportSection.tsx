import { Link } from 'react-router-dom';

import { ImagePlaceholder } from '@/pages/main/ui/ImagePlaceholder';

function FolderIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M4 8a2 2 0 0 1 2-2h5.5l2 2H22a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8z" fill="#F6B93B" />
      <path d="M4 10h20v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" fill="#E5A82E" />
    </svg>
  );
}

export function HealthReportSection() {
  return (
    <section className="w-full" aria-labelledby="home-health-report-heading">
      <h2 id="home-health-report-heading" className="sr-only">
        AI 건강 레포트
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-5">
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 md:p-7">
          <div className="flex items-center gap-2">
            <FolderIcon />
            <span className="text-sm font-semibold text-neutral-900">AI 건강 레포트</span>
          </div>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <ImagePlaceholder className="mx-auto h-[140px] w-[120px] shrink-0 rounded-lg sm:mx-0 sm:h-[150px] sm:w-[130px]" />
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold leading-snug text-neutral-900 sm:text-xl">
                &ldquo;반려동물을 등록하고
                <br className="hidden sm:block" /> 건강 레포트를 받아보세요!&rdquo;
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                산책·식사·활동 기록을 기반으로 한 AI 건강 리포트를 제공합니다. 지금 반려동물을 등록하고 관리 기록을
                시작해보세요.
              </p>
            </div>
          </div>
        </article>

        <article className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:gap-6 sm:p-6 md:p-7">
          <ImagePlaceholder className="h-[100px] w-[100px] rounded-lg sm:h-[110px] sm:w-[110px]" />
          <p className="text-center text-sm font-medium leading-relaxed text-neutral-700">
            반려동물을 등록하고
            <br />
            AI 건강 레포트를 받아 보세요!
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
