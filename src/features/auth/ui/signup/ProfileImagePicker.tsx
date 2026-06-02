import { useId, useRef, useState, type ChangeEvent } from 'react';

import { FormFeedback } from './SignupStepLayout';

interface ProfileImagePickerProps {
  imageUrl: string | null;
  uploading?: boolean;
  error?: string;
  onSelectFile: (file: File) => void;
}

export function ProfileImagePicker({ imageUrl, uploading, error, onSelectFile }: ProfileImagePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  // 로드에 실패한 URL만 기록. imageUrl이 바뀌면 effect 없이 자동으로 다시 표시 시도.
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const showImage = Boolean(imageUrl) && failedImageUrl !== imageUrl;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onSelectFile(file);
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {showImage ? (
          <img
            src={imageUrl!}
            alt="프로필"
            className={`h-24 w-24 rounded-full object-cover ${uploading ? 'opacity-60' : ''}`}
            onError={() => imageUrl && setFailedImageUrl(imageUrl)}
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-200 text-3xl text-neutral-400">
            👤
          </div>
        )}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-secondary text-xs text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="프로필 이미지 변경"
        >
          ✎
        </button>

        <input ref={inputRef} id={inputId} type="file" accept="image/*" className="sr-only" onChange={handleChange} />
      </div>

      <FormFeedback
        message={error || (uploading ? '이미지 업로드 중...' : undefined)}
        tone={error ? 'error' : 'neutral'}
      />
    </div>
  );
}
