import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { AuthErrorPresentation } from '../../lib/authErrorPresentation';
import type { SocialProvider } from '../../model/types';

interface AuthErrorScreenProps {
  presentation: AuthErrorPresentation;
  primaryAction?: ReactNode;
  onRetrySocial?: (provider: SocialProvider) => void;
  retryProvider?: SocialProvider | null;
  showHomeLink?: boolean;
  onHomeClick?: () => void;
}

function badgeTone(statusCode: number | null): string {
  if (statusCode === 403) return 'border-red-200 bg-red-50 text-red-700';
  if (statusCode === 429) return 'border-amber-200 bg-amber-50 text-amber-800';
  if (statusCode !== null && statusCode >= 500) return 'border-neutral-200 bg-neutral-100 text-neutral-700';
  return 'border-orange-200 bg-orange-50 text-brand';
}

export function AuthErrorScreen({
  presentation,
  primaryAction,
  onRetrySocial,
  retryProvider,
  showHomeLink = true,
  onHomeClick,
}: AuthErrorScreenProps) {
  const { badge, title, message, hint } = presentation;

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 font-sans">
      <div
        className="absolute left-1/2 top-16 h-48 w-48 -translate-x-[130%] rounded-full bg-brand/8 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-32 h-56 w-56 translate-x-[45%] rounded-full bg-secondary/12 blur-3xl"
        aria-hidden
      />

      <div className="relative w-full max-w-[38rem] overflow-hidden rounded-[36px] border border-white/70 bg-white/90 p-6 shadow-[0_32px_100px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
        <div
          className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-brand/25 to-transparent"
          aria-hidden
        />

        <div className="flex flex-col items-center text-center">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase ${badgeTone(
              presentation.statusCode,
            )}`}
          >
            <span className="h-2 w-2 rounded-full bg-current opacity-70" aria-hidden />
            {badge}
          </span>

          <div className="mt-8 space-y-4">
            <h1 className="text-[2rem] font-semibold tracking-[-0.04em] text-neutral-950 sm:text-[2.5rem]">{title}</h1>
            <p className="mx-auto max-w-[32rem] text-[1.05rem] leading-8 text-neutral-700 sm:text-[1.1rem]">
              {message}
            </p>
            {hint ? (
              <p className="mx-auto max-w-[30rem] text-sm leading-7 text-neutral-500 sm:text-[15px]">{hint}</p>
            ) : null}
          </div>

          <div className="mt-10 w-full max-w-md space-y-3">
            {primaryAction}

            {onRetrySocial && retryProvider ? (
              <button
                type="button"
                onClick={() => onRetrySocial(retryProvider)}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-brand/15 bg-brand/5 px-4 text-sm font-medium text-brand transition-colors hover:bg-brand/10"
              >
                {retryProvider === 'NAVER' ? '네이버' : '구글'}로 바로 다시 로그인
              </button>
            ) : null}

            {showHomeLink ? (
              onHomeClick ? (
                <button
                  type="button"
                  onClick={onHomeClick}
                  className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  홈으로 돌아가기
                </button>
              ) : (
                <Link
                  to="/"
                  className="inline-flex h-14 w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 text-base font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  홈으로 돌아가기
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
