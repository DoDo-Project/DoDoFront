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
  if (statusCode === 403) return 'bg-red-50 text-red-700 ring-red-100';
  if (statusCode === 429) return 'bg-amber-50 text-amber-800 ring-amber-100';
  if (statusCode !== null && statusCode >= 500) return 'bg-neutral-100 text-neutral-700 ring-neutral-200';
  return 'bg-orange-50 text-brand ring-orange-100';
}

export function AuthErrorScreen({
  presentation,
  primaryAction,
  onRetrySocial,
  retryProvider,
  showHomeLink = true,
  onHomeClick,
}: AuthErrorScreenProps) {
  const { badge, title, message, hint, statusCode } = presentation;

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 font-sans">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <div
          className={`inline-flex min-h-14 min-w-14 items-center justify-center rounded-2xl px-3 text-lg font-semibold tracking-tight ring-1 ${badgeTone(statusCode)}`}
          aria-hidden
        >
          {badge}
        </div>

        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="text-[20px] font-semibold tracking-tight text-neutral-900 sm:text-[22px]">{title}</h1>
          <p className="text-[14px] font-normal leading-relaxed text-neutral-600 sm:text-[15px]">{message}</p>
          {hint ? <p className="text-[12px] leading-relaxed text-neutral-500 sm:text-[13px]">{hint}</p> : null}
        </div>

        <div className="flex w-full max-w-xs flex-col gap-3">
          {primaryAction}

          {onRetrySocial && retryProvider ? (
            <button
              type="button"
              onClick={() => onRetrySocial(retryProvider)}
              className="h-12 w-full cursor-pointer rounded-xl bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              {retryProvider === 'NAVER' ? '네이버' : '구글'}로 다시 로그인
            </button>
          ) : null}

          {showHomeLink ? (
            onHomeClick ? (
              <button
                type="button"
                onClick={onHomeClick}
                className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                홈으로 돌아가기
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                홈으로 돌아가기
              </Link>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}
