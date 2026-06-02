import type { ComponentProps } from 'react';

type CloseButtonProps = ComponentProps<'button'>;

export function CloseButton({ className = '', ...props }: CloseButtonProps) {
  return (
    <button
      type="button"
      aria-label="닫기"
      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 ${className}`}
      {...props}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
