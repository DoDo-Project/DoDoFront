import notificationIllustration from '../../assets/notification.svg';

import { FormFeedback, PrimaryButton, SignupStepLayout } from './SignupStepLayout';

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
      <div className="flex w-full flex-col items-center">
        <img
          src={notificationIllustration}
          alt=""
          className="h-40 w-auto max-w-full object-contain"
          draggable={false}
        />

        <div className="mt-4 w-full text-left">
          <h1 className="text-xl font-semibold leading-snug text-neutral-900">
            중요한 소식이 있을 때
            <br />
            알려드릴까요?
          </h1>
          <p className="mt-2 text-sm text-neutral-500">언제든지 설정에서 바꿀 수 있어요.</p>

          <div className="mt-8 flex flex-col gap-3">
            <ChoiceRow selected={allow === true} label="알림 받기" onClick={() => onChangeAllow(true)} />
            <ChoiceRow selected={allow === false} label="지금은 안 받을래요" onClick={() => onChangeAllow(false)} />
          </div>

          <FormFeedback className="mt-4" message={error} tone="error" />
        </div>
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
    <button type="button" onClick={onClick} className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] text-white transition-colors ${
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
