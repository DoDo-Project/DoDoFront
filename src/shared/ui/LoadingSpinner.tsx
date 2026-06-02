type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

const sizeClass: Record<LoadingSpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
};

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  className?: string;
  /** 스크린 리더용 */
  label?: string;
}

/**
 * Pretendard UI용 미니멀 arc 스피너 (currentColor)
 */
export function LoadingSpinner({ size = 'md', className = 'text-brand', label = '로딩 중' }: LoadingSpinnerProps) {
  return (
    <span role="status" aria-label={label} className={`inline-flex shrink-0 ${className}`}>
      <svg
        className={`${sizeClass[size]} animate-spin`}
        style={{ animationDuration: '0.85s' }}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.18" strokeWidth="2.5" />
        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}
