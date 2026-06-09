import type { ReactNode } from 'react';

import { LoadingSpinner } from '@/shared/ui/LoadingSpinner';

interface SignupStepLayoutProps {
  children: ReactNode;
  // 하단 고정 버튼 영역(주로 '다음'). 생략 가능.
  footer?: ReactNode;
  /** 폼 필드가 많은 스텝은 상단 정렬로 불필요한 스크롤을 줄인다 */
  align?: 'center' | 'top';
}

// 모든 회원가입 스텝이 공유하는 중앙 정렬 레이아웃.
export function SignupStepLayout({ children, footer, align = 'center' }: SignupStepLayoutProps) {
  return (
    <div
      className={`mx-auto flex w-full max-w-sm flex-1 flex-col px-6 pb-6 ${align === 'top' ? 'pt-8' : 'pt-16 pb-10'}`}
    >
      <div className={`flex flex-1 flex-col ${align === 'top' ? 'justify-start' : 'justify-center'}`}>{children}</div>
      {footer ? <div className={`shrink-0 ${align === 'top' ? 'mt-6' : 'mt-8'}`}>{footer}</div> : null}
    </div>
  );
}

interface PrimaryButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// 하단 '다음/HOME' 메인 버튼. 활성 시 brand, 비활성 시 회색.
export function PrimaryButton({ children, onClick, disabled, loading }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`h-12 w-full cursor-pointer rounded-xl text-sm font-medium transition-colors ${
        isDisabled
          ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
          : 'cursor-pointer bg-brand text-brand-foreground hover:opacity-90'
      }`}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" className="text-brand-foreground" label="처리 중" />
          <span>처리 중</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

interface SubButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// 입력 옆 보조 버튼(중복확인/검색/확인). secondary(옐로우) 색상.
export function SubButton({ children, onClick, disabled, loading }: SubButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      className={`h-12 shrink-0 rounded-xl px-4 text-sm font-medium transition-colors ${
        isDisabled
          ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
          : 'cursor-pointer bg-secondary text-brand-foreground hover:opacity-90'
      }`}
    >
      {loading ? (
        <span className="inline-flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" className="text-secondary-foreground" label="확인 중" />
          <span>확인 중</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

type FormFeedbackTone = 'success' | 'error' | 'neutral';

interface FormFeedbackProps {
  message?: string;
  tone?: FormFeedbackTone;
  className?: string;
}

const feedbackToneClass: Record<FormFeedbackTone, string> = {
  success: 'text-green-600',
  error: 'text-red-500',
  neutral: 'text-neutral-500',
};

/** 안내/에러 문구 영역. min-height를 유지해 메시지 표시 시 레이아웃이 밀리지 않는다. */
export function FormFeedback({ message, tone = 'error', className = '' }: FormFeedbackProps) {
  return (
    <p
      className={`min-h-5 text-xs leading-5 ${feedbackToneClass[tone]} ${message ? '' : 'invisible'} ${className}`}
      aria-live="polite"
    >
      {message || '\u00a0'}
    </p>
  );
}
