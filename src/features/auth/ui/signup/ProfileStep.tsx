import { ProfileImagePicker } from './ProfileImagePicker';
import { PrimaryButton, SignupStepLayout, SubButton } from './SignupStepLayout';

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
  onChangeNickname: (value: string) => void;
  onChangeRegion: (value: string) => void;
  onCheckNickname: () => void;
  onSelectProfileImage: (file: File) => void;
  onSearchRegion: () => void;
  onNext: () => void;
}

const labelClass = 'text-sm font-medium text-neutral-800';
const inputClass =
  'h-12 w-full rounded-[10px] border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none focus:border-brand';
// 읽기 전용: 선택·포커스 불가, 1px 진한 회색 테두리
const readonlyFieldClass =
  'flex h-12 w-full select-none items-center rounded-[10px] border border-neutral-300 bg-neutral-100 px-4 text-sm text-neutral-500';

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
  onChangeNickname,
  onChangeRegion,
  onCheckNickname,
  onSelectProfileImage,
  onSearchRegion,
  onNext,
}: ProfileStepProps) {
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
            <SubButton onClick={onCheckNickname}>중복 확인</SubButton>
          </div>
          {nicknameStatus === 'valid' ? <p className="text-xs text-green-600">사용 가능한 닉네임입니다.</p> : null}
          {nicknameStatus === 'invalid' && nicknameErrorMessage ? (
            <p className="text-xs text-red-500">{nicknameErrorMessage}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>
            지역<span className="text-brand">*</span>
          </label>
          <div className="flex gap-2">
            <input
              className={inputClass}
              value={region}
              onChange={(event) => onChangeRegion(event.target.value)}
              placeholder="지역을 입력해주세요"
            />
            {/* TODO: 지역 검색 모달/API 연동 (현재는 직접 입력) */}
            <SubButton onClick={onSearchRegion}>검색</SubButton>
          </div>
        </div>
      </div>
    </SignupStepLayout>
  );
}
