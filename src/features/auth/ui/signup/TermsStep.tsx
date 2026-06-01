import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';

import { PrimaryButton, SignupStepLayout } from './SignupStepLayout';

interface TermsStepProps {
  agreed: boolean;
  onChangeAgreed: (value: boolean) => void;
  onNext: () => void;
}

export function TermsStep({ agreed, onChangeAgreed, onNext }: TermsStepProps) {
  return (
    <SignupStepLayout
      footer={
        <PrimaryButton onClick={onNext} disabled={!agreed}>
          다음
        </PrimaryButton>
      }
    >
      <div>
        <DoDoLogo className="h-9 w-auto" />
        <h1 className="mt-5 text-2xl font-semibold text-neutral-900">약관에 동의해주세요</h1>
        <p className="mt-4 text-sm leading-relaxed text-neutral-500">
          서비스 이용에 필요한 필수 항목입니다.
          <br />
          데이터는 약관에 따라 안전하게 보호되며,
          <br />
          오직 서비스 개선과 기능 제공에만 사용됩니다.
        </p>
      </div>

      <div className="mt-auto flex w-full flex-col items-start gap-2 pt-12">
        <button
          type="button"
          onClick={() => onChangeAgreed(!agreed)}
          className="flex cursor-pointer items-center gap-2 text-left text-sm text-neutral-700"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white transition-colors ${
              agreed ? 'bg-secondary' : 'bg-neutral-300'
            }`}
            aria-hidden
          >
            ✓
          </span>
          서비스 이용 약관에 동의합니다.
        </button>
        {/* TODO: 약관 상세 링크 페이지 연결 */}
        <div className="flex gap-3 pl-7 text-[11px] text-neutral-400 underline">
          <button type="button" className="cursor-pointer hover:text-neutral-600">
            DoDo 이용 약관
          </button>
          <button type="button" className="cursor-pointer hover:text-neutral-600">
            개인정보 제3자 이용 동의
          </button>
        </div>
      </div>
    </SignupStepLayout>
  );
}
