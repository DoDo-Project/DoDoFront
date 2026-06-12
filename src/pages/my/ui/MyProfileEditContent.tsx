import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { PROFILE_UPDATE_STATUS_MESSAGES, getApiErrorMessage, updateMyProfile, type UserProfile } from '@/features/auth';
import { RegionSelectModal } from '@/features/auth/ui/signup/RegionSelectModal';
import { FormFeedback, PrimaryButton, SubButton } from '@/features/auth/ui/signup/SignupStepLayout';
import { syncUserProfile } from '@/shared/lib/auth/token';
import { Skeleton } from '@/shared/ui';

interface MyProfileEditContentProps {
  user: UserProfile | null;
  isLoading?: boolean;
  onProfileUpdated: (profile: UserProfile) => void;
}

const inputClass =
  'h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15';
const readonlyFieldClass =
  'flex h-12 w-full items-center rounded-xl border border-neutral-300 bg-neutral-100 px-4 text-sm text-neutral-500';

function validateNickname(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return '닉네임을 입력해주세요.';
  if (trimmed.length < 2 || trimmed.length > 10) return '닉네임은 2자 이상 10자 이하로 입력해주세요.';

  return '';
}

function validateRegion(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return '지역을 선택해주세요.';
  if (trimmed.length > 50) return '지역은 50자 이하로 입력해주세요.';

  return '';
}

export function MyProfileEditContent({ user, isLoading = false, onProfileUpdated }: MyProfileEditContentProps) {
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [hasFamily, setHasFamily] = useState(false);
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [regionTouched, setRegionTouched] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    setNickname(user.nickname ?? '');
    setRegion(user.region ?? '');
    setHasFamily(user.hasFamily);
    setNicknameTouched(false);
    setRegionTouched(false);
    setSaveError('');
    setSaveSuccess('');
  }, [user]);

  const trimmedNickname = nickname.trim();
  const trimmedRegion = region.trim();
  const nicknameError = validateNickname(nickname);
  const regionError = validateRegion(region);

  const isDirty = useMemo(() => {
    if (!user) return false;

    return (
      trimmedNickname !== user.nickname.trim() || trimmedRegion !== user.region.trim() || hasFamily !== user.hasFamily
    );
  }, [hasFamily, trimmedNickname, trimmedRegion, user]);

  const canSubmit = Boolean(user) && !saving && !nicknameError && !regionError && isDirty;

  const handleNicknameChange = (value: string) => {
    setNickname(value);
    setNicknameTouched(true);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setRegionTouched(true);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleFamilyChange = (next: boolean) => {
    setHasFamily(next);
    setSaveError('');
    setSaveSuccess('');
  };

  const handleSubmit = async () => {
    if (!user) return;

    setNicknameTouched(true);
    setRegionTouched(true);

    if (nicknameError || regionError || !isDirty) {
      return;
    }

    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      const updatedProfile = await updateMyProfile({
        nickname: trimmedNickname,
        region: trimmedRegion,
        hasFamily,
      });

      syncUserProfile({
        profileUrl: updatedProfile.profileUrl,
        nickname: updatedProfile.nickname,
        region: updatedProfile.region,
        notificationEnabled: updatedProfile.notificationEnabled,
      });

      onProfileUpdated(updatedProfile);
      setSaveSuccess('회원정보를 수정했어요.');
    } catch (error) {
      console.error('[my-profile] update failed', error);
      setSaveError(
        getApiErrorMessage(
          error,
          '회원정보 수정에 실패했어요. 잠시 후 다시 시도해주세요.',
          PROFILE_UPDATE_STATUS_MESSAGES,
        ),
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return <MyProfileEditSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">ACCOUNT</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">회원정보 수정</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          현재 로그인한 내 정보를 확인하고 닉네임, 활동 지역, 가족 여부를 수정할 수 있어요.
        </p>
      </div>

      <section className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
        <div className="border-b border-neutral-100 bg-linear-to-r from-brand/[0.04] via-white to-white px-6 py-5 sm:px-8">
          <h2 className="text-[18px] font-medium text-neutral-950">내 프로필 정보</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            수정한 정보는 저장 직후 마이도도 화면에 바로 반영돼요.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
          <div className="grid gap-5 md:grid-cols-2">
            <FieldBlock label="이메일">
              <div className={readonlyFieldClass} aria-readonly>
                {user?.email ?? '-'}
              </div>
            </FieldBlock>

            <FieldBlock label="이름">
              <div className={readonlyFieldClass} aria-readonly>
                {user?.name ?? '-'}
              </div>
            </FieldBlock>
          </div>

          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <FieldBlock label="닉네임" required>
              <input
                className={inputClass}
                value={nickname}
                maxLength={10}
                onChange={(event) => handleNicknameChange(event.target.value)}
                placeholder="닉네임을 입력해주세요"
              />
              <FormFeedback
                message={nicknameTouched ? nicknameError : '2자 이상 10자 이하로 입력해주세요.'}
                tone={nicknameTouched && nicknameError ? 'error' : 'neutral'}
              />
            </FieldBlock>

            <div className="hidden md:block">
              <label className="mb-1.5 block text-sm font-medium text-transparent">보조 액션</label>
              <SubButton onClick={() => setNickname((user?.nickname ?? '').trim())} disabled={!user || saving}>
                원래대로
              </SubButton>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <FieldBlock label="활동 지역" required>
              <button
                type="button"
                onClick={() => setRegionModalOpen(true)}
                className={`${readonlyFieldClass} cursor-pointer justify-between text-left ${
                  region ? 'text-neutral-800' : 'text-neutral-400'
                }`}
              >
                <span className="truncate">{region || '지역을 선택해주세요'}</span>
                <span className="ml-4 text-xs font-medium text-neutral-400">선택</span>
              </button>
              <FormFeedback
                message={regionTouched ? regionError : '현재 활동 중인 지역을 선택해주세요.'}
                tone={regionTouched && regionError ? 'error' : 'neutral'}
              />
            </FieldBlock>

            <div className="hidden md:block">
              <label className="mb-1.5 block text-sm font-medium text-transparent">지역 선택</label>
              <SubButton onClick={() => setRegionModalOpen(true)} disabled={saving}>
                지역 선택
              </SubButton>
            </div>
          </div>

          <FieldBlock label="가족 여부">
            <div className="grid gap-3 md:grid-cols-2">
              <FamilyChoiceCard
                title="가족이 있어요"
                description="가족 계정과 함께 반려동물 정보를 관리하고 있어요."
                selected={hasFamily}
                disabled={saving}
                onClick={() => handleFamilyChange(true)}
              />
              <FamilyChoiceCard
                title="혼자 사용 중이에요"
                description="현재는 가족 연동 없이 내 계정만 사용하고 있어요."
                selected={!hasFamily}
                disabled={saving}
                onClick={() => handleFamilyChange(false)}
              />
            </div>
          </FieldBlock>

          <div className="rounded-[16px] border border-neutral-200 bg-neutral-50 px-4 py-4">
            <p className="text-sm font-medium text-neutral-800">저장 전 확인</p>
            <ul className="mt-2 space-y-1 text-sm leading-6 text-neutral-600">
              <li>닉네임은 2자 이상 10자 이하로 입력해주세요.</li>
              <li>지역은 최대 50자까지 저장할 수 있어요.</li>
              <li>중복 닉네임 등 서버 오류가 발생하면 바로 안내해드려요.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <FormFeedback
              message={saveError || saveSuccess}
              tone={saveError ? 'error' : saveSuccess ? 'success' : 'neutral'}
            />
            <PrimaryButton onClick={handleSubmit} disabled={!canSubmit} loading={saving}>
              변경사항 저장
            </PrimaryButton>
          </div>
        </div>
      </section>

      <RegionSelectModal
        open={regionModalOpen}
        initialRegion={region}
        onClose={() => setRegionModalOpen(false)}
        onConfirm={handleRegionChange}
      />
    </div>
  );
}

function FieldBlock({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-neutral-800">
        {label}
        {required ? <span className="ml-1 text-brand">*</span> : null}
      </label>
      {children}
    </div>
  );
}

function FamilyChoiceCard({
  title,
  description,
  selected,
  disabled = false,
  onClick,
}: {
  title: string;
  description: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        'rounded-[18px] border bg-white px-5 py-5 text-left shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60',
        selected ? 'border-brand ring-1 ring-brand' : 'border-neutral-200 hover:border-brand/50',
      ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <span
          className={[
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white transition-colors',
            selected ? 'bg-brand' : 'bg-neutral-300',
          ].join(' ')}
          aria-hidden
        >
          {selected ? '✓' : ''}
        </span>

        <div>
          <p className="text-base font-semibold text-neutral-900">{title}</p>
          <p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p>
        </div>
      </div>
    </button>
  );
}

function MyProfileEditSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-3 w-16 rounded-md" />
        <Skeleton className="mt-4 h-8 w-40 rounded-lg" />
        <Skeleton className="mt-4 h-4 w-80 rounded-md" />
      </div>

      <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <Skeleton className="h-6 w-36 rounded-lg" />
          <Skeleton className="mt-3 h-4 w-72 rounded-md" />
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8 sm:py-7">
          <div className="grid gap-5 md:grid-cols-2">
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <FieldSkeleton />
          <FieldSkeleton />
          <div className="grid gap-3 md:grid-cols-2">
            <ChoiceSkeleton />
            <ChoiceSkeleton />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20 rounded-md" />
      <Skeleton className="h-12 w-full rounded-xl" />
      <Skeleton className="h-4 w-52 rounded-md" />
    </div>
  );
}

function ChoiceSkeleton() {
  return (
    <div className="rounded-[18px] border border-neutral-200 bg-white px-5 py-5 shadow-sm">
      <div className="flex items-start gap-4">
        <Skeleton className="mt-0.5 h-5 w-5 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-28 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-10/12 rounded-md" />
        </div>
      </div>
    </div>
  );
}
