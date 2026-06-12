import { InlineFeedback } from './FamilyVisuals';

export function FamilyJoinCard({
  mode = 'form',
  code,
  isSubmitting,
  successMessage,
  errorMessage,
  onChange,
  onSubmit,
}: {
  mode?: 'summary' | 'form';
  code?: string;
  isSubmitting?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}) {
  if (mode === 'summary') {
    return (
      <div className="space-y-4">
        <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
          <p className="text-sm leading-7 text-neutral-600">
            새로운 가족을 만나보세요!
            <br />
            전체 보기에서 확인할 수 있어요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
        <p className="text-sm leading-7 text-neutral-600">
          가족 코드를 입력하면 신청할 수 있어요.
          <br />
          신청 상태는 내 신청 내역에서 확인해요.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={code ?? ''}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="가족 코드 입력"
          maxLength={6}
          autoComplete="off"
          spellCheck={false}
          className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm uppercase tracking-[0.24em] text-neutral-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/15"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={Boolean(isSubmitting) || (code ?? '').trim().length === 0}
          className="inline-flex h-12 min-w-28 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? '신청 중' : '가족 신청'}
        </button>
      </div>

      {successMessage ? <InlineFeedback tone="success" message={successMessage} /> : null}
      {errorMessage ? <InlineFeedback tone="error" message={errorMessage} /> : null}
    </div>
  );
}
