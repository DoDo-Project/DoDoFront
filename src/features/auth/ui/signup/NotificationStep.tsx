import { PrimaryButton, SignupStepLayout } from './SignupStepLayout';

interface NotificationStepProps {
  allow: boolean | null;
  submitting: boolean;
  error: string;
  onChangeAllow: (value: boolean) => void;
  onNext: () => void;
}

export function NotificationStep({ allow, submitting, error, onChangeAllow, onNext }: NotificationStepProps) {
  return (
    <SignupStepLayout
      footer={
        <PrimaryButton onClick={onNext} disabled={allow === null} loading={submitting}>
          다음
        </PrimaryButton>
      }
    >
      <div className="flex flex-col items-center text-center">
        {/* TODO: 알림 벨 일러스트 에셋으로 교체 */}
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-neutral-100 text-5xl">🔔</div>

        <h1 className="mt-8 text-xl font-semibold leading-snug text-neutral-900">
          중요한 소식이 있을 때
          <br />
          앱에서 알려드릴까요?
        </h1>
        <p className="mt-2 text-sm text-neutral-500">언제든지 설정에서 바꿀 수 있어요.</p>

        <div className="mt-8 flex w-full flex-col items-start gap-3">
          <ChoiceRow selected={allow === true} label="알림 받기" onClick={() => onChangeAllow(true)} />
          <ChoiceRow selected={allow === false} label="지금 안 받을래요" onClick={() => onChangeAllow(false)} />
        </div>

        {error ? <p className="mt-4 text-xs text-red-500">{error}</p> : null}
      </div>
    </SignupStepLayout>
  );
}

interface ChoiceRowProps {
  selected: boolean;
  label: string;
  onClick: () => void;
}

function ChoiceRow({ selected, label, onClick }: ChoiceRowProps) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 text-sm text-neutral-700">
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white transition-colors ${
          selected ? 'bg-secondary' : 'bg-neutral-300'
        }`}
        aria-hidden
      >
        ✓
      </span>
      {label}
    </button>
  );
}
