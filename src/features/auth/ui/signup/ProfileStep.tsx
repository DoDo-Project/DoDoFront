import { useState } from 'react';

import { ProfileImagePicker } from './ProfileImagePicker';
import { RegionSelectModal } from './RegionSelectModal';
import { PrimaryButton, SignupStepLayout, SubButton, FormFeedback } from './SignupStepLayout';

type NicknameStatus = 'idle' | 'valid' | 'invalid';

interface ProfileStepProps {
  email: string;
  name: string;
  nickname: string;
  region: string;
  profileImageUrl: string | null;
  uploadingProfileImage?: boolean;
  profileImageError?: string;
  nicknameStatus: NicknameStatus;
  /** invalid일 때만 표시할 안내 문구 */
  nicknameErrorMessage: string;
  checkingNickname?: boolean;
  onChangeNickname: (value: string) => void;
  onChangeRegion: (value: string) => void;
  onCheckNickname: () => void;
  onSelectProfileImage: (file: File) => void;
  onNext: () => void;
}

const labelClass = 'text-sm font-medium text-neutral-800';
const inputClass =
  'h-12 w-full cursor-text rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15';
// 읽기 전용: 선택·포커스 불가, 1px 진한 회색 테두리
const readonlyFieldClass =
  'flex h-12 w-full select-none items-center rounded-xl border border-neutral-300 bg-neutral-100 px-4 text-sm text-neutral-500';

export function ProfileStep({
  email,
  name,
  nickname,
  region,
  profileImageUrl,
  uploadingProfileImage,
  profileImageError,
  nicknameStatus,
  nicknameErrorMessage,
  checkingNickname,
  onChangeNickname,
  onChangeRegion,
  onCheckNickname,
  onSelectProfileImage,
  onNext,
}: ProfileStepProps) {
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const canProceed = nicknameStatus === 'valid' && region.trim().length > 0;

  return (
    <SignupStepLayout
      footer={
        <PrimaryButton onClick={onNext} disabled={!canProceed}>
          다음
        </PrimaryButton>
      }
    >
      <ProfileImagePicker
        imageUrl={profileImageUrl}
        uploading={uploadingProfileImage}
        error={profileImageError}
        onSelectFile={onSelectProfileImage}
      />

      <div className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>이메일</label>
          <div className={readonlyFieldClass} aria-readonly>
            {email}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>이름</label>
          <div className={readonlyFieldClass} aria-readonly>
            {name}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            닉네임<span className="text-brand">*</span>
          </label>
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={nickname}
              onChange={(event) => onChangeNickname(event.target.value)}
              placeholder="ex) 도롱이"
            />
            <SubButton onClick={onCheckNickname} loading={checkingNickname} disabled={!nickname.trim()}>
              중복 확인
            </SubButton>
          </div>
          <FormFeedback
            message={
              nicknameStatus === 'valid'
                ? '사용 가능한 닉네임입니다.'
                : nicknameStatus === 'invalid'
                  ? nicknameErrorMessage
                  : undefined
            }
            tone={nicknameStatus === 'valid' ? 'success' : 'error'}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            지역<span className="text-brand">*</span>
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setRegionModalOpen(true)}
              className={`${readonlyFieldClass} min-w-0 flex-1 cursor-pointer text-left ${
                region ? 'text-neutral-800' : 'text-neutral-400'
              }`}
            >
              {region || '지역을 선택해주세요'}
            </button>
            <SubButton onClick={() => setRegionModalOpen(true)}>검색</SubButton>
          </div>
        </div>
      </div>

      <RegionSelectModal
        open={regionModalOpen}
        initialRegion={region}
        onClose={() => setRegionModalOpen(false)}
        onConfirm={onChangeRegion}
      />
    </SignupStepLayout>
  );
}
