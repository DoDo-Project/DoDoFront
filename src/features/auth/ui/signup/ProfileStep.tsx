import { PrimaryButton, SignupStepLayout, SubButton } from './SignupStepLayout';

type NicknameStatus = 'idle' | 'valid' | 'invalid';

interface ProfileStepProps {
  email: string;
  name: string;
  nickname: string;
  region: string;
  nicknameStatus: NicknameStatus;
  onChangeNickname: (value: string) => void;
  onChangeRegion: (value: string) => void;
  onCheckNickname: () => void;
  onSearchRegion: () => void;
  onNext: () => void;
}

const labelClass = 'text-sm font-medium text-neutral-800';
const inputClass =
  'h-12 w-full rounded-[10px] border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none focus:border-brand';
const readonlyInputClass = 'h-12 w-full rounded-[10px] bg-neutral-100 px-4 text-sm text-neutral-500';

export function ProfileStep({
  email,
  name,
  nickname,
  region,
  nicknameStatus,
  onChangeNickname,
  onChangeRegion,
  onCheckNickname,
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
      <h1 className="text-center font-display text-2xl font-bold text-neutral-900">회원가입</h1>

      {/* 프로필 이미지. TODO: 이미지 업로드 API 연동 */}
      <div className="mt-6 flex justify-center">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-200 text-3xl text-neutral-400">
            👤
          </div>
          <span className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs text-white">
            ✎
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className={labelClass}>이메일</label>
          <input className={readonlyInputClass} value={email} readOnly />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>이름</label>
          <input className={readonlyInputClass} value={name} readOnly />
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
          {nicknameStatus === 'valid' ? (
            <p className="text-xs text-green-600">사용 가능한 닉네임입니다.</p>
          ) : (
            <p className={`text-xs ${nicknameStatus === 'invalid' ? 'text-red-500' : 'text-blue-500'}`}>
              닉네임은 2~10자, 한글·영문·숫자만 사용할 수 있어요.
            </p>
          )}
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
