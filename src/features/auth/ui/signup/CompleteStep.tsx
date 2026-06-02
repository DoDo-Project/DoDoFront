import { useNavigate } from 'react-router-dom';

import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';

import signupCompleteIllustration from '../../assets/sign-up-complete.svg';
import { PrimaryButton, SignupStepLayout } from './SignupStepLayout';

interface CompleteStepProps {
  onHome: () => void;
}

export function CompleteStep({ onHome }: CompleteStepProps) {
  const navigate = useNavigate();

  return (
    <SignupStepLayout
      footer={
        <div className="flex flex-col gap-4">
          <PrimaryButton onClick={onHome}>HOME</PrimaryButton>
          <button
            type="button"
            onClick={() => navigate('/auth/family/join')}
            className="cursor-pointer text-sm font-medium text-neutral-500 transition-opacity hover:opacity-80"
          >
            가족 등록하러 가기
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center">
        <DoDoLogo className="h-16 w-auto" />
        <h1 className="mt-5 text-2xl font-semibold text-neutral-900">회원가입 완료</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          반려동물과의 행복한 하루,
          <br />
          DoDo가 함께할게요!
        </p>
        <img
          src={signupCompleteIllustration}
          alt=""
          className="mt-10 h-40 w-auto max-w-full object-contain"
          draggable={false}
        />
      </div>
    </SignupStepLayout>
  );
}
