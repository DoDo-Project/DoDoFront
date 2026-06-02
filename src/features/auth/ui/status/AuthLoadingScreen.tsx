import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';
import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface AuthLoadingScreenProps {
  title?: string;
  message?: string;
  /** 소셜 콜백 등 단계 설명 */
  stepLabel?: string;
}

export function AuthLoadingScreen({
  title = '잠시만 기다려주세요',
  message = '사용자 정보를 확인 중이에요',
  stepLabel,
}: AuthLoadingScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 font-sans">
      <div className="flex w-full max-w-xs flex-col items-center gap-10 text-center">
        <DoDoLogo className="h-9 w-auto text-brand" aria-hidden />

        <div className="flex flex-col items-center gap-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-neutral-100">
            <LoadingSpinner size="lg" className="text-brand" />
          </div>

          <div className="flex flex-col items-center gap-2.5">
            <h1 className="text-[17px] font-semibold tracking-tight text-neutral-900">{title}</h1>
            <p className="text-[14px] font-normal leading-relaxed text-neutral-500">{message}</p>
            {stepLabel ? (
              <span className="mt-1 inline-flex rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-600">
                {stepLabel}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
