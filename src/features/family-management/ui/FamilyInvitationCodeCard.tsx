import type { InvitationCodeState } from '../model/types';
import { useRemainingSeconds } from '../model/useRemainingSeconds';
import { formatRemainingTime } from '../lib/formatters';
import { InlineFeedback } from './FamilyVisuals';

export function FamilyInvitationCodeCard({
  activeCode,
  isCreating,
  createErrorMessage,
  createSuccessMessage,
  onCreate,
}: {
  activeCode: InvitationCodeState | null;
  isCreating: boolean;
  createErrorMessage: string;
  createSuccessMessage: string;
  onCreate: () => void;
}) {
  const remainingSeconds = useRemainingSeconds(activeCode);

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-neutral-200 bg-neutral-50/80 px-4 py-4">
        <p className="text-sm leading-7 text-neutral-600">
          선택한 반려동물 기준으로 초대 코드를 발급할 수 있어요. 생성된 코드는 15분 동안 유효하고, 같은 코드로 가족
          신청을 받을 수 있어요.
        </p>
      </div>

      {activeCode ? (
        <div className="rounded-[16px] border border-brand/20 bg-brand/[0.06] px-4 py-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-brand">ACTIVE CODE</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[24px] font-semibold tracking-[0.24em] text-neutral-950">{activeCode.code}</p>
              <p className="mt-2 text-sm text-neutral-600">
                {remainingSeconds > 0
                  ? `남은 시간 ${formatRemainingTime(remainingSeconds)}`
                  : '유효 시간이 만료되었어요.'}
              </p>
            </div>
            <button
              type="button"
              onClick={onCreate}
              disabled={isCreating}
              className="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? '재생성 중' : '다시 생성'}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onCreate}
          disabled={isCreating}
          className="inline-flex h-10 min-w-28 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCreating ? '생성 중' : '초대 코드 만들기'}
        </button>
      )}

      {createSuccessMessage ? <InlineFeedback tone="success" message={createSuccessMessage} /> : null}
      {createErrorMessage ? <InlineFeedback tone="error" message={createErrorMessage} /> : null}
    </div>
  );
}
