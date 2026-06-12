import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { PROFILE_UPDATE_STATUS_MESSAGES, getApiErrorMessage, updateMyProfile, type UserProfile } from '@/features/auth';
import { RegionSelectModal } from '@/features/auth/ui/signup/RegionSelectModal';
import { FormFeedback } from '@/features/auth/ui/signup/SignupStepLayout';
import { syncUserProfile } from '@/shared/lib/auth/token';
import { Skeleton } from '@/shared/ui';

interface MyProfileEditContentProps {
  user: UserProfile | null;
  isLoading?: boolean;
  onProfileUpdated: (profile: UserProfile) => void;
}

function validateNickname(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return '닉네임을 입력해주세요.';
  if (trimmed.length < 2 || trimmed.length > 10) return '닉네임은 2자 이상 10자 이하로 입력해주세요.';

  return '';
}

function validateRegion(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) return '활동 지역을 선택해주세요.';
  if (trimmed.length > 50) return '활동 지역은 50자 이하로 입력해주세요.';

  return '';
}

export function MyProfileEditContent({ user, isLoading = false, onProfileUpdated }: MyProfileEditContentProps) {
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
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

    return trimmedNickname !== user.nickname.trim() || trimmedRegion !== user.region.trim();
  }, [trimmedNickname, trimmedRegion, user]);

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

  const handleResetNickname = () => {
    setNickname(user?.nickname ?? '');
    setNicknameTouched(false);
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
        hasFamily: user.hasFamily,
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
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">
          닉네임과 활동 지역을 수정해 내 프로필 정보를 최신 상태로 유지할 수 있어요.
        </p>
      </div>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch">
            <div className="flex flex-col items-center rounded-[20px] border border-neutral-200 bg-white px-5 py-5">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                {user?.profileUrl ? (
                  <img src={user.profileUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-neutral-100" />
                )}
              </div>
              <div className="mt-4 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-center text-sm text-neutral-500">
                프로필 이미지는 현재 수정 대상이 아니에요.
              </div>
            </div>

            <div className="flex h-full flex-col justify-center rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[17px] font-medium text-neutral-950">프로필 정보</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200">
                  닉네임
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200">
                  활동 지역
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                현재 계정의 기본 프로필 정보를 차분하게 정리하고 바로 저장할 수 있어요.
              </p>
              <p className="mt-1 text-sm leading-7 text-neutral-500">
                저장한 정보는 마이도도 화면과 프로필 카드에 즉시 반영됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FormCard title="기본 정보" description="이메일, 이름, 닉네임, 활동 지역을 확인하고 필요한 값만 수정해 주세요.">
        <div className="grid gap-5 lg:grid-cols-2">
          <ReadonlyField label="이메일" value={user?.email ?? '-'} />
          <ReadonlyField label="이름" value={user?.name ?? '-'} />

          <FieldBlock label="닉네임" required>
            <input
              type="text"
              value={nickname}
              maxLength={10}
              onChange={(event) => handleNicknameChange(event.target.value)}
              placeholder="닉네임을 입력해주세요"
              className={[
                'mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400',
                nicknameTouched && nicknameError
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-neutral-200 focus:border-brand',
              ].join(' ')}
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <FormFeedback
                className="min-h-0 flex-1"
                message={nicknameTouched ? nicknameError : '2자 이상 10자 이하로 입력해주세요.'}
                tone={nicknameTouched && nicknameError ? 'error' : 'neutral'}
              />
              <button
                type="button"
                onClick={handleResetNickname}
                disabled={!user || saving}
                className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                원래대로
              </button>
            </div>
          </FieldBlock>

          <FieldBlock label="활동 지역" required>
            <button
              type="button"
              onClick={() => setRegionModalOpen(true)}
              className={[
                'mt-2 flex h-12 w-full items-center rounded-xl border bg-white px-4 text-left text-sm outline-none transition-colors',
                regionTouched && regionError
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-neutral-200 hover:border-brand/60',
                region ? 'text-neutral-900' : 'text-neutral-400',
              ].join(' ')}
            >
              <span className="truncate">{region || '활동 지역을 선택해주세요'}</span>
            </button>
            <FormFeedback
              message={regionTouched ? regionError : '클릭해서 활동 지역을 선택해주세요.'}
              tone={regionTouched && regionError ? 'error' : 'neutral'}
            />
          </FieldBlock>
        </div>
      </FormCard>

      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-brand">*</span> 표시된 항목은 필수 입력값입니다.
        </p>
        {saveError ? <p className="max-w-md text-right text-sm text-red-500">{saveError}</p> : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {saveSuccess ? <p className="self-center text-sm text-green-600">{saveSuccess}</p> : null}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="inline-flex min-w-32 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? '수정 중...' : '변경사항 저장'}
        </button>
      </div>

      <RegionSelectModal
        open={regionModalOpen}
        initialRegion={region}
        onClose={() => setRegionModalOpen(false)}
        onConfirm={handleRegionChange}
      />
    </div>
  );
}

function FormCard({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
        <h2 className="text-[18px] font-medium text-neutral-950">{title}</h2>
        {description ? <p className="mt-1 text-sm text-neutral-500">{description}</p> : null}
      </div>

      <div className="px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}

function FieldBlock({ label, required = false, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-neutral-800">
        {label}
        {required ? <span className="ml-1 text-brand">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="block">
      <span className="text-sm font-medium text-neutral-800">{label}</span>
      <div className="mt-2 flex h-12 w-full items-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm text-neutral-700">
        {value}
      </div>
    </div>
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

      <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
            <Skeleton className="h-56 rounded-[20px]" />
            <Skeleton className="h-56 rounded-[20px]" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <Skeleton className="h-6 w-24 rounded-lg" />
          <Skeleton className="mt-3 h-4 w-72 rounded-md" />
        </div>
        <div className="grid gap-5 px-6 py-6 sm:px-8 lg:grid-cols-2">
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
          <FieldSkeleton />
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
      <Skeleton className="h-4 w-48 rounded-md" />
    </div>
  );
}
