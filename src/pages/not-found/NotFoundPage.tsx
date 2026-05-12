import { Link } from 'react-router-dom';

import NotFound404 from '@/pages/not-found/assets/NotFound404.svg?react';

export function NotFoundPage() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center sm:max-w-lg sm:gap-10">
        <div className="w-full max-w-30 shrink-0 sm:max-w-40">
          <NotFound404 className="h-auto w-full object-contain" role="404 image" aria-label="페이지를 찾을 수 없음" />
        </div>

        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="font-display text-xl font-bold text-neutral-800 sm:text-2xl">페이지를 찾을 수 없어요</h1>
          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
            주소가 바뀌었거나 잘못된 경로일 수 있어요.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex min-h-11 min-w-[8.5rem] items-center justify-center rounded-md bg-brand px-5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          메인으로
        </Link>
      </div>
    </div>
  );
}
