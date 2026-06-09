import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { uploadImage } from '@/shared/api/files';
import { getApiErrorMessage, getApiErrorStatus } from '@/shared/lib/api/errorMessage';
import { setNotificationEnabled, setTokens } from '@/shared/lib/auth/token';

import { checkNicknameAvailability, registerProfile, updateNotificationSetting } from '../../api/auth';
import {
  NICKNAME_CHECK_STATUS_MESSAGES,
  NOTIFICATION_SETTING_STATUS_MESSAGES,
  REGISTER_PROFILE_STATUS_MESSAGES,
} from '../../lib/apiErrorMessages';
import { resolveApiAuthError, type AuthErrorPresentation } from '../../lib/authErrorPresentation';
import { AuthErrorScreen } from '../status/AuthErrorScreen';
import { CompleteStep } from './CompleteStep';
import { NotificationStep } from './NotificationStep';
import { ProfileStep } from './ProfileStep';
import { TermsStep } from './TermsStep';

// 닉네임 규칙: 2~10자, 한글·영문·숫자·공백만 (백엔드 명세 기준)
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9 ]{2,10}$/;

type NicknameStatus = 'idle' | 'valid' | 'invalid';

const Step = {
  Terms: 0,
  Profile: 1,
  Notification: 2,
  Complete: 3,
} as const;
type Step = (typeof Step)[keyof typeof Step];

const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

function resolveProfileUrl(url?: string): string | null {
  const trimmed = url?.trim();
  return trimmed ? trimmed : null;
}

interface SignupFlowProps {
  registrationToken: string;
  email: string;
  name: string;
  /** 소셜 로그인(202)에서 받은 프로필 이미지 URL */
  initialProfileUrl?: string;
  // 가입 완료 후 홈 이동 등 후처리를 위임받는다.
  onComplete: () => void;
}

export function SignupFlow({ registrationToken, email, name, initialProfileUrl, onComplete }: SignupFlowProps) {
  const [step, setStep] = useState<Step>(Step.Terms);

  const [agreed, setAgreed] = useState(false);

  const [nickname, setNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>('idle');
  const [nicknameErrorMessage, setNicknameErrorMessage] = useState('');
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [region, setRegion] = useState('');

  const [profileImageUrl, setProfileImageUrl] = useState(() => resolveProfileUrl(initialProfileUrl));
  const lastProfileImageUrlRef = useRef(profileImageUrl);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [profileImageError, setProfileImageError] = useState('');

  const [allowNotification, setAllowNotification] = useState<boolean | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fatalError, setFatalError] = useState<AuthErrorPresentation | null>(null);
  const profileCompletedRef = useRef(false);

  // 닉네임이 바뀌면 중복확인 결과를 초기화
  const handleChangeNickname = (value: string) => {
    setNickname(value);
    setNicknameStatus('idle');
    setNicknameErrorMessage('');
  };

  const handleCheckNickname = async () => {
    const trimmed = nickname.trim();

    if (!trimmed) {
      setNicknameStatus('invalid');
      setNicknameErrorMessage('닉네임을 입력해주세요.');
      return;
    }

    if (!NICKNAME_REGEX.test(trimmed)) {
      setNicknameStatus('invalid');
      setNicknameErrorMessage('닉네임은 2~10자, 한글·영문·숫자, 띄어쓰기만 사용할 수 있어요.');
      return;
    }

    setCheckingNickname(true);
    setNicknameErrorMessage('');

    try {
      const result = await checkNicknameAvailability(trimmed, { authToken: registrationToken });

      if (result.duplicated) {
        setNicknameStatus('invalid');
        setNicknameErrorMessage('이미 사용 중인 닉네임이에요.');
        return;
      }

      setNicknameStatus('valid');
      setNicknameErrorMessage('');
    } catch (checkError) {
      console.error('[nickname-check] 실패', checkError);
      setNicknameStatus('invalid');
      setNicknameErrorMessage(
        getApiErrorMessage(checkError, '중복 확인에 실패했어요. 잠시 후 다시 시도해주세요.', {
          400: '닉네임 형식이 올바르지 않아요.',
          ...NICKNAME_CHECK_STATUS_MESSAGES,
        }),
      );
    } finally {
      setCheckingNickname(false);
    }
  };

  const handleSelectProfileImage = async (file: File) => {
    if (uploadingProfileImage) return;

    if (!file.type.startsWith('image/')) {
      setProfileImageError('이미지 파일만 업로드할 수 있어요.');
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE) {
      setProfileImageError('5MB 이하의 이미지를 선택해주세요.');
      return;
    }

    setUploadingProfileImage(true);
    setProfileImageError('');

    const previewUrl = URL.createObjectURL(file);
    setProfileImageUrl(previewUrl);

    try {
      const uploadedUrl = await uploadImage(file, { authToken: registrationToken });
      URL.revokeObjectURL(previewUrl);
      const resolved = resolveProfileUrl(uploadedUrl);
      setProfileImageUrl(resolved);
      lastProfileImageUrlRef.current = resolved;
    } catch (uploadError) {
      URL.revokeObjectURL(previewUrl);
      console.error('[profile-image] 업로드 실패', uploadError);
      setProfileImageUrl(lastProfileImageUrlRef.current);
      setProfileImageError('프로필 이미지 업로드에 실패했어요. 다시 시도해주세요.');
    } finally {
      setUploadingProfileImage(false);
    }
  };

  // registerProfile → 알림 설정 저장 순으로 가입을 완료
  const handleSubmit = async () => {
    if (allowNotification === null) return;

    setSubmitting(true);
    setError('');

    try {
      if (!profileCompletedRef.current) {
        const response = await registerProfile(
          {
            nickname: nickname.trim(),
            region: region.trim(),
            hasFamily: false,
            // 최종적으로 업로드된 이미지 URL을 사용. 업로드 실패 시 기존 URL 유지
            profileUrl: lastProfileImageUrlRef.current,
          },
          registrationToken,
        );

        setTokens({
          ...response,
          profileUrl: resolveProfileUrl(response.profileUrl) ?? lastProfileImageUrlRef.current ?? '',
          nickname: nickname.trim(),
        });
        profileCompletedRef.current = true;
      }

      await updateNotificationSetting(allowNotification);
      setNotificationEnabled(allowNotification);
      setStep(Step.Complete);
    } catch (submitError) {
      if (profileCompletedRef.current) {
        console.error('[notification-setting] 실패', submitError);
        setError(
          getApiErrorMessage(
            submitError,
            '알림 설정 저장에 실패했어요. 다시 시도해주세요.',
            NOTIFICATION_SETTING_STATUS_MESSAGES,
          ),
        );
        return;
      }

      console.error('[register-profile] 실패', submitError);
      const presentation = resolveApiAuthError(
        submitError,
        '회원가입에 실패했어요. 잠시 후 다시 시도해주세요.',
        REGISTER_PROFILE_STATUS_MESSAGES,
      );
      const status = getApiErrorStatus(submitError);
      if (status === 401 || status === 409) {
        setFatalError(presentation);
        return;
      }
      setError(presentation.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (fatalError) {
    return (
      <AuthErrorScreen
        presentation={fatalError}
        primaryAction={
          <Link
            to="/auth"
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            처음부터 로그인하기
          </Link>
        }
      />
    );
  }

  switch (step) {
    case Step.Terms:
      return <TermsStep agreed={agreed} onChangeAgreed={setAgreed} onNext={() => setStep(Step.Profile)} />;

    case Step.Profile:
      return (
        <ProfileStep
          email={email}
          name={name}
          nickname={nickname}
          region={region}
          profileImageUrl={profileImageUrl}
          uploadingProfileImage={uploadingProfileImage}
          profileImageError={profileImageError}
          nicknameStatus={nicknameStatus}
          nicknameErrorMessage={nicknameErrorMessage}
          checkingNickname={checkingNickname}
          onChangeNickname={handleChangeNickname}
          onChangeRegion={setRegion}
          onCheckNickname={handleCheckNickname}
          onSelectProfileImage={handleSelectProfileImage}
          onNext={() => setStep(Step.Notification)}
        />
      );

    case Step.Notification:
      return (
        <NotificationStep
          allow={allowNotification}
          submitting={submitting}
          error={error}
          onChangeAllow={setAllowNotification}
          onNext={handleSubmit}
        />
      );

    case Step.Complete:
      return <CompleteStep onHome={onComplete} />;

    default:
      return null;
  }
}
