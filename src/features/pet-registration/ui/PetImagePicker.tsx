import { useId, useRef, useState, type ChangeEvent } from 'react';

import petDefaultIllustration from '@/shared/assets/images/pet-default.svg';
import { IMAGE_UPLOAD_ACCEPT } from '@/shared/lib/files/imageUploadPolicy';

interface PetImagePickerProps {
  imageUrl: string | null;
  uploading?: boolean;
  error?: string;
  onSelectFile: (file: File) => void;
  compact?: boolean;
  actionLabel?: string;
}

export function PetImagePicker({
  imageUrl,
  uploading = false,
  error,
  onSelectFile,
  compact = false,
  actionLabel = '이미지 변경',
}: PetImagePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedImageUrl !== imageUrl;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onSelectFile(file);
    event.target.value = '';
  };

  const imageClassName = compact ? 'h-32 w-32 rounded-[24px]' : 'h-28 w-28 rounded-[28px]';
  const triggerFileSelect = () => {
    if (uploading) return;
    inputRef.current?.click();
  };

  return (
    <div className={`flex flex-col ${compact ? 'h-full items-start' : 'items-center'}`}>
      <div className="relative">
        {showImage ? (
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={uploading}
            className="block rounded-[24px] disabled:cursor-not-allowed"
            aria-label="반려동물 이미지 선택"
          >
            <img
              src={imageUrl!}
              alt="반려동물 이미지 미리보기"
              className={`${imageClassName} cursor-pointer object-cover transition-opacity hover:opacity-95 ${uploading ? 'opacity-60' : ''}`}
              onError={() => imageUrl && setFailedImageUrl(imageUrl)}
            />
          </button>
        ) : (
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={uploading}
            className="block rounded-[24px] disabled:cursor-not-allowed"
            aria-label="반려동물 이미지 선택"
          >
            <img
              src={petDefaultIllustration}
              alt=""
              className={`${imageClassName} cursor-pointer transition-opacity hover:opacity-95`}
              draggable={false}
            />
          </button>
        )}

        {!compact ? (
          <button
            type="button"
            onClick={triggerFileSelect}
            disabled={uploading}
            className="absolute bottom-0 right-0 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="반려동물 이미지 업로드"
          >
            +
          </button>
        ) : null}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={IMAGE_UPLOAD_ACCEPT}
          className="sr-only"
          disabled={uploading}
          onChange={handleChange}
        />
      </div>

      {!compact ? <p className="mt-3 text-sm leading-6 text-neutral-500">PNG, JPG 형식 / 최대 10MB</p> : null}
      {compact ? (
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={uploading}
          className="mt-4 inline-flex h-10 w-32 cursor-pointer items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
        >
          {actionLabel}
        </button>
      ) : null}
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
