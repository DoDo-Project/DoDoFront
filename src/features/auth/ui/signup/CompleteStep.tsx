import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';

import { PrimaryButton, SignupStepLayout } from './SignupStepLayout';

interface CompleteStepProps {
  onHome: () => void;
}

export function CompleteStep({ onHome }: CompleteStepProps) {
  return (
    <SignupStepLayout footer={<PrimaryButton onClick={onHome}>HOME</PrimaryButton>}>
      <div className="flex flex-col items-center text-center">
        <DoDoLogo className="h-9 w-auto" />
        <h1 className="mt-5 text-2xl font-semibold text-neutral-900">회원가입 완료!</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          반려동물과의 행복한 하루,
          <br />
          DoDo가 함께할게요 :D
        </p>
        {/* TODO: 강아지 일러스트 에셋으로 교체 */}
        <div className="mt-10 flex h-40 w-40 items-center justify-center rounded-3xl bg-neutral-100 text-5xl">🐶</div>
      </div>
    </SignupStepLayout>
  );
}
