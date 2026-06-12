import { type ChangeEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import { PROFILE_UPDATE_STATUS_MESSAGES, getApiErrorMessage, updateMyProfile, type UserProfile } from '@/features/auth';
import { RegionSelectModal } from '@/features/auth/ui/signup/RegionSelectModal';
import { FormFeedback } from '@/features/auth/ui/signup/SignupStepLayout';
import { uploadImage } from '@/shared/api/files';
import { syncUserProfile } from '@/shared/lib/auth/token';
import { IMAGE_UPLOAD_ACCEPT, MAX_IMAGE_FILE_SIZE_MB, validateImageFile } from '@/shared/lib/files/imageUploadPolicy';
import { Skeleton } from '@/shared/ui';

interface MyProfileEditContentProps {
  user: UserProfile | null;
  isLoading?: boolean;
}

function validateNickname(value: string, fallback: string): string {
  const trimmed = value.trim() || fallback.trim();

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

function resolveProfileUrl(url: string | null | undefined): string | null {
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

export function MyProfileEditContent({ user, isLoading = false }: MyProfileEditContentProps) {
  const [nickname, setNickname] = useState('');
  const [region, setRegion] = useState('');
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [nicknameTouched, setNicknameTouched] = useState(false);
  const [regionTouched, setRegionTouched] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const previousImageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const nextProfileUrl = resolveProfileUrl(user.profileUrl);

    setNickname('');
    setRegion(user.region ?? '');
    setProfileImageUrl(nextProfileUrl);
    previousImageUrlRef.current = nextProfileUrl;
    setNicknameTouched(false);
    setRegionTouched(false);
  }, [user]);

  const effectiveNickname = nickname.trim() || user?.nickname.trim() || '';
  const trimmedRegion = region.trim();
  const submittedProfileUrl = resolveProfileUrl(profileImageUrl);
  const nicknameError = validateNickname(nickname, user?.nickname ?? '');
  const regionError = validateRegion(region);

  const isDirty = useMemo(() => {
    if (!user) return false;

    return (
      effectiveNickname !== user.nickname.trim() ||
      trimmedRegion !== user.region.trim() ||
      submittedProfileUrl !== resolveProfileUrl(user.profileUrl)
    );
  }, [effectiveNickname, submittedProfileUrl, trimmedRegion, user]);

  const canSubmit = Boolean(user) && !saving && !uploadingImage && !nicknameError && !regionError && isDirty;

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

  const handleSelectProfileImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || uploadingImage) return;

    try {
      validateImageFile(file);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : '이미지 파일을 다시 확인해주세요.');
      return;
    }

    setUploadingImage(true);
    setImageError('');
    setSaveError('');
    setSaveSuccess('');

    const previewUrl = URL.createObjectURL(file);
    setProfileImageUrl(previewUrl);

    try {
      const uploadedUrl = await uploadImage(file);
      URL.revokeObjectURL(previewUrl);
      const resolvedUrl = resolveProfileUrl(uploadedUrl);
      setProfileImageUrl(resolvedUrl);
      previousImageUrlRef.current = resolvedUrl;
    } catch (error) {
      URL.revokeObjectURL(previewUrl);
      setProfileImageUrl(previousImageUrlRef.current);
      setImageError('프로필 이미지 업로드에 실패했어요. 다시 시도해주세요.');
      console.error('[my-profile] image upload failed', error);
    } finally {
      setUploadingImage(false);
    }
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
        nickname: effectiveNickname,
        region: trimmedRegion,
        hasFamily: user.hasFamily,
        profileUrl: submittedProfileUrl,
      });

      const nextProfile: UserProfile = {
        ...updatedProfile,
        nickname: effectiveNickname,
        region: trimmedRegion,
        hasFamily: user.hasFamily,
        profileUrl: submittedProfileUrl ?? updatedProfile.profileUrl,
      };

      syncUserProfile({
        profileUrl: nextProfile.profileUrl,
        nickname: nextProfile.nickname,
        region: nextProfile.region,
        notificationEnabled: nextProfile.notificationEnabled,
      });

      previousImageUrlRef.current = resolveProfileUrl(nextProfile.profileUrl);
      setNickname('');
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
      </div>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-stretch">
            <div className="flex flex-col items-center rounded-[20px] border border-neutral-200 bg-white px-5 py-5">
              <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <img
                    src={profileDefaultIllustration}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                )}
              </div>

              <input
                ref={inputRef}
                type="file"
                accept={IMAGE_UPLOAD_ACCEPT}
                className="sr-only"
                disabled={uploadingImage || saving}
                onChange={handleSelectProfileImage}
              />

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploadingImage || saving}
                className="mt-4 inline-flex min-w-32 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingImage ? '이미지 업로드 중' : '이미지 변경'}
              </button>

              {imageError ? <FormFeedback className="mt-3 text-center" message={imageError} tone="error" /> : null}
            </div>

            <div className="flex h-full flex-col justify-center rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[17px] font-medium text-neutral-950">프로필 이미지</span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-500 ring-1 ring-neutral-200">
                  최대 {MAX_IMAGE_FILE_SIZE_MB}MB
                </span>
              </div>
              <p className="mt-3 text-sm leading-7 text-neutral-600">사진을 선택해 프로필 이미지를 변경할 수 있어요.</p>
              <p className="mt-1 text-sm leading-7 text-neutral-500">변경한 이미지는 저장 후 바로 반영돼요.</p>
            </div>
          </div>
        </div>
      </section>

      <FormCard
        title="기본 정보"
        description="이메일과 이름은 조회만 가능하고, 닉네임과 활동 지역은 이 화면에서 수정할 수 있어요."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <ReadonlyField label="이메일" value={user?.email ?? '-'} />
          <ReadonlyField label="이름" value={user?.name ?? '-'} />

          <FieldBlock label="닉네임" required>
            <input
              type="text"
              value={nickname}
              maxLength={10}
              onChange={(event) => handleNicknameChange(event.target.value)}
              placeholder={user?.nickname ?? '닉네임을 입력해주세요'}
              className={[
                'mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400',
                nicknameTouched && nicknameError
                  ? 'border-red-300 focus:border-red-400'
                  : 'border-neutral-200 focus:border-brand',
              ].join(' ')}
            />
            <FormFeedback
              message={nicknameTouched ? nicknameError : '비워두면 현재 닉네임을 그대로 유지해요.'}
              tone={nicknameTouched && nicknameError ? 'error' : 'neutral'}
            />
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
