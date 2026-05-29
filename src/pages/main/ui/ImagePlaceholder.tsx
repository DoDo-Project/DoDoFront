type ImagePlaceholderProps = {
  className?: string;
};

/** 디자인 에셋 전까지 사용하는 흰색 이미지 placeholder */
export function ImagePlaceholder({ className = '' }: ImagePlaceholderProps) {
  return <div className={`border border-neutral-200 bg-white ${className}`.trim()} aria-hidden />;
}
