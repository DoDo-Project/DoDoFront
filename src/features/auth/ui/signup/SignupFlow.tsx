import { useState } from 'react';

import { setTokens } from '@/shared/lib/auth/token';

import { registerProfile } from '../../api/auth';
import { CompleteStep } from './CompleteStep';
import { EncourageStep } from './EncourageStep';
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
  Encourage: 2,
  Family: 3,
  Notification: 4,
  Complete: 5,
} as const;
type Step = (typeof Step)[keyof typeof Step];

interface SignupFlowProps {
  registrationToken: string;
  email: string;
  name: string;
  // 가입 완료 후 홈 이동 등 후처리를 위임받는다.
  onComplete: () => void;
}

export function SignupFlow({ registrationToken, email, name, onComplete }: SignupFlowProps) {
  const [step, setStep] = useState<Step>(Step.Terms);

  const [agreed, setAgreed] = useState(false);

  const [nickname, setNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState<NicknameStatus>('idle');
  const [region, setRegion] = useState('');

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
  };

  // TODO: 닉네임 중복확인 API 연동. 현재는 형식 검증만 수행한다.
  const handleCheckNickname = () => {
    setNicknameStatus(NICKNAME_REGEX.test(nickname) ? 'valid' : 'invalid');
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
          nicknameStatus={nicknameStatus}
          onChangeNickname={handleChangeNickname}
          onChangeRegion={setRegion}
          onCheckNickname={handleCheckNickname}
          onSearchRegion={() => {}}
          onNext={() => setStep(Step.Encourage)}
        />
      );

    case Step.Encourage:
      return <EncourageStep onNext={() => setStep(Step.Family)} />;

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
