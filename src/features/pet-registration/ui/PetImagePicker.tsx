import { useId, useRef, useState, type ChangeEvent } from 'react';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';

interface PetImagePickerProps {
  imageUrl: string | null;
  uploading?: boolean;
  error?: string;
  onSelectFile: (file: File) => void;
}

export function PetImagePicker({ imageUrl, uploading = false, error, onSelectFile }: PetImagePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const showImage = Boolean(imageUrl) && failedImageUrl !== imageUrl;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onSelectFile(file);
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {showImage ? (
          <img
            src={imageUrl!}
            alt="반려동물 이미지 미리보기"
            className={`h-28 w-28 rounded-[28px] object-cover ${uploading ? 'opacity-60' : ''}`}
            onError={() => imageUrl && setFailedImageUrl(imageUrl)}
          />
        ) : (
          <img src={profileDefaultIllustration} alt="" className="h-28 w-28 rounded-[28px]" draggable={false} />
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="반려동물 이미지 업로드"
        >
          +
        </button>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={handleChange}
        />
      </div>

      <p className="mt-3 text-sm text-neutral-500">PNG, JPG 형식 / 최대 5MB</p>
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
      {!error && uploading ? <p className="mt-2 text-sm text-neutral-500">이미지를 업로드하는 중이에요...</p> : null}
    </div>
  );
}
