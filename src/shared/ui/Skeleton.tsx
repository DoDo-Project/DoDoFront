interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div aria-hidden className={`animate-skeleton rounded-xl bg-neutral-200/80 ${className}`.trim()} />;
}
