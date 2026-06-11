import { useEffect, useState } from 'react';

import { formatRemainingTime } from '../lib/formatters';
import type { InvitationCodeState } from '../model/types';
import { useRemainingSeconds } from '../model/useRemainingSeconds';
import { InlineFeedback } from './FamilyVisuals';

function CopyIcon({ checked = false }: { checked?: boolean }) {
  if (checked) {
    return (
      <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
        <path
          d="M4.167 10.417 7.5 13.75l8.333-8.333"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="h-4 w-4">
      <path
        d="M7.5 6.667V5a1.667 1.667 0 0 1 1.667-1.667h5A1.667 1.667 0 0 1 15.833 5v5a1.667 1.667 0 0 1-1.666 1.667H12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.833 7.5h5A1.667 1.667 0 0 1 12.5 9.167v5a1.667 1.667 0 0 1-1.667 1.666h-5a1.667 1.667 0 0 1-1.666-1.666v-5A1.667 1.667 0 0 1 5.833 7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsCopied(false);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isCopied]);

  const handleCopyCode = async () => {
    if (!activeCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(activeCode.code);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
        <p className="text-sm leading-7 text-neutral-600">
          선택한 반려동물 기준으로 초대 코드를 발급할 수 있어요. 생성된 코드는 15분 동안 유효하고, 같은 코드로 가족
          신청을 받을 수 있어요.
        </p>
      </div>

      {activeCode ? (
        <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-neutral-400">ACTIVE CODE</p>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[24px] font-semibold tracking-[0.24em] text-neutral-950">{activeCode.code}</p>
                <button
                  type="button"
                  onClick={() => void handleCopyCode()}
                  className={[
                    'inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white transition-colors',
                    isCopied
                      ? 'border-emerald-200 text-emerald-600'
                      : 'border-neutral-200 text-neutral-700 hover:border-brand/50 hover:text-brand',
                  ].join(' ')}
                  aria-label={isCopied ? '초대 코드 복사 완료' : '초대 코드 복사'}
                >
                  <CopyIcon checked={isCopied} />
                </button>
              </div>
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
              className="inline-flex h-10 min-w-28 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating ? '재생성 중' : '다시 생성'}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={onCreate}
            disabled={isCreating}
            className="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? '생성 중' : '초대 코드 만들기'}
          </button>
        </div>
      )}

      {createSuccessMessage ? <InlineFeedback tone="success" message={createSuccessMessage} /> : null}
      {createErrorMessage ? <InlineFeedback tone="error" message={createErrorMessage} /> : null}
    </div>
  );
}
