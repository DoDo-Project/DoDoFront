import { useRef, useState } from 'react';
import { isAxiosError } from 'axios';

import { uploadImage } from '@/shared/api/files';
import { setTokens } from '@/shared/lib/auth/token';

import { checkNicknameAvailability, registerProfile } from '../../api/auth';
import { CompleteStep } from './CompleteStep';
import { FamilyCodeStep } from './FamilyCodeStep';
import { NotificationStep } from './NotificationStep';
import { ProfileStep } from './ProfileStep';
import { TermsStep } from './TermsStep';

// 닉네임 규칙: 2~10자, 한글·영문·숫자·공백만 (백엔드 명세 기준)
const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9 ]{2,10}$/;

type NicknameStatus = 'idle' | 'valid' | 'invalid';

const Step = {
  Terms: 0,
  Profile: 1,
  Family: 2,
  Notification: 3,
  Complete: 4,
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

  const [familyCode, setFamilyCode] = useState('');
  const [familyConnected, setFamilyConnected] = useState(false);
  const [skipFamily, setSkipFamily] = useState(false);

  const [allowNotification, setAllowNotification] = useState<boolean | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 닉네임이 바뀌면 중복확인 결과를 초기화한다.
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
      setNicknameErrorMessage('닉네임은 2~10자, 한글·영문·숫자만 사용할 수 있어요.');
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
      if (isAxiosError(checkError) && checkError.response?.status === 400) {
        const message =
          typeof checkError.response.data === 'object' &&
          checkError.response.data !== null &&
          'message' in checkError.response.data &&
          typeof checkError.response.data.message === 'string'
            ? checkError.response.data.message
            : '닉네임 형식이 올바르지 않아요.';
        setNicknameStatus('invalid');
        setNicknameErrorMessage(message);
        return;
      }

      console.error('[nickname-check] 실패', checkError);
      setNicknameStatus('invalid');
      setNicknameErrorMessage('중복 확인에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setCheckingNickname(false);
    }
  };

  // TODO: 가족 코드 확인/연결 API 연동. 현재는 입력값이 있으면 연결로 처리한다.
  const handleConfirmFamilyCode = () => {
    if (familyCode.trim().length > 0) {
      setFamilyConnected(true);
    }
  };

  const handleToggleSkipFamily = (value: boolean) => {
    setSkipFamily(value);
    if (value) {
      setFamilyConnected(false);
      setFamilyCode('');
    }
  };

  const handleSelectProfileImage = async (file: File) => {
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

  // 모든 입력을 모아 가입을 완료(registerProfile)한 뒤 완료 화면으로 이동한다.
  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const response = await registerProfile(
        {
          nickname: nickname.trim(),
          region: region.trim(),
          hasFamily: familyConnected,
        },
        registrationToken,
      );

      // 가입 완료 → ACTIVE 전환 + 새 토큰 저장 → 로그인 상태로 전환
      setTokens(response);
      setStep(Step.Complete);
    } catch (submitError) {
      // TODO(STEP 7): 상태 코드(400~500)별 에러 메시지 세분화
      console.error('[register-profile] 실패', submitError);
      setError('회원가입에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

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
          onNext={() => setStep(Step.Family)}
        />
      );

    case Step.Family:
      return (
        <FamilyCodeStep
          code={familyCode}
          connected={familyConnected}
          skip={skipFamily}
          onChangeCode={setFamilyCode}
          onConfirmCode={handleConfirmFamilyCode}
          onToggleSkip={handleToggleSkipFamily}
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
