import { PrimaryButton, SignupStepLayout } from './SignupStepLayout';

interface EncourageStepProps {
  onNext: () => void;
}

export function EncourageStep({ onNext }: EncourageStepProps) {
  return (
    <SignupStepLayout footer={<PrimaryButton onClick={onNext}>다음</PrimaryButton>}>
      <div className="flex flex-col items-center text-center">
        <h1 className="font-display text-2xl font-bold leading-snug text-neutral-900">
          거의 다왔어요!
          <br />
          조금만 힘내주세요 :D
        </h1>
        {/* TODO: 고양이 가족 일러스트 에셋으로 교체 */}
        <div className="mt-12 flex h-40 w-40 items-center justify-center rounded-3xl bg-neutral-100 text-5xl">🐱</div>
      </div>
    </SignupStepLayout>
  );
}
