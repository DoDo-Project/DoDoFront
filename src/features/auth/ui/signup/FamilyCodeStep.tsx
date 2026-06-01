import { PrimaryButton, SignupStepLayout, SubButton } from './SignupStepLayout';

interface FamilyCodeStepProps {
  code: string;
  connected: boolean;
  skip: boolean;
  onChangeCode: (value: string) => void;
  onConfirmCode: () => void;
  onToggleSkip: (value: boolean) => void;
  onNext: () => void;
}

export function FamilyCodeStep({
  code,
  connected,
  skip,
  onChangeCode,
  onConfirmCode,
  onToggleSkip,
  onNext,
}: FamilyCodeStepProps) {
  const canProceed = connected || skip;

  return (
    <SignupStepLayout
      footer={
        <PrimaryButton onClick={onNext} disabled={!canProceed}>
          다음
        </PrimaryButton>
      }
    >
      <div className="flex flex-col items-center text-center">
        {/* TODO: 가족 일러스트 에셋으로 교체 */}
        <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-neutral-100 text-5xl">👨‍👩‍👧‍👦</div>

        <h1 className="mt-8 text-xl font-semibold leading-snug text-neutral-900">
          가족 코드를 입력하면
          <br />
          서로의 반려동물 정보를
          <br />
          공유할 수 있어요.
        </h1>
        <p className="mt-2 text-sm text-neutral-500">지금 연결하지 않으셔도 괜찮아요 :D</p>

        <div className="mt-6 flex w-full gap-2">
          <input
            className="h-12 w-full cursor-text rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400"
            value={code}
            onChange={(event) => onChangeCode(event.target.value)}
            placeholder="가족 코드 입력"
            disabled={skip}
          />
          {/* TODO: 가족 코드 확인/연결 API 연동 (현재는 입력값 있으면 연결 처리) */}
          <SubButton onClick={onConfirmCode} disabled={skip || code.trim().length === 0}>
            확인
          </SubButton>
        </div>
        {connected ? <p className="mt-2 self-start text-xs text-green-600">가족과 연결되었어요!</p> : null}

        <button
          type="button"
          onClick={() => onToggleSkip(!skip)}
          className="mt-4 flex cursor-pointer items-center gap-2 self-start text-sm text-neutral-700"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white transition-colors ${
              skip ? 'bg-secondary' : 'bg-neutral-300'
            }`}
            aria-hidden
          >
            ✓
          </span>
          다음에 할래요!
        </button>
      </div>
    </SignupStepLayout>
  );
}
