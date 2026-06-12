import type { FamilyPendingUser } from '@/features/auth';

import { formatRequestedAt } from '../lib/formatters';
import {
  EmptySectionMessage,
  ErrorSectionMessage,
  InlineFeedback,
  ProfileImage,
  SectionContentSkeleton,
} from './FamilyVisuals';

function getStatusLabel(status: FamilyPendingUser['status']) {
  if (status === 'PENDING') return '승인 대기';
  if (status === 'REJECTED') return '거절됨';
  if (status === 'APPROVED') return '승인됨';
  return status;
}

function getStatusClassName(status: FamilyPendingUser['status']) {
  if (status === 'PENDING') return 'bg-amber-50 text-amber-600';
  if (status === 'REJECTED') return 'bg-rose-50 text-rose-500';
  if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-600';
  return 'bg-neutral-100 text-neutral-500';
}

function ActionIcon({ kind, className }: { kind: 'approve' | 'reject' | 'block'; className?: string }) {
  if (kind === 'approve') {
    return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
        <path d="M4.5 10.5 8 14l7.5-8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === 'reject') {
    return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
        <path d="m5.5 5.5 9 9m0-9-9 9" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M6 14 14 6" strokeLinecap="round" />
    </svg>
  );
}

function ActionButton({
  label,
  kind,
  disabled,
  onClick,
}: {
  label: string;
  kind: 'approve' | 'reject' | 'block';
  disabled: boolean;
  onClick: () => void;
}) {
  const toneClassName =
    kind === 'approve'
      ? 'hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600'
      : kind === 'reject'
        ? 'hover:border-rose-200 hover:bg-rose-50 hover:text-rose-500'
        : 'hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-950';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${toneClassName}`}
    >
      <ActionIcon kind={kind} className="h-4 w-4" />
    </button>
  );
}

export function FamilyPendingRequestsCard({
  mode = 'manage',
  requests,
  isLoading,
  errorMessage,
  totalCount,
  activeRequestKey,
  feedbackMessage,
  feedbackTone,
  onApprove,
  onReject,
  onBlock,
}: {
  mode?: 'summary' | 'manage';
  requests: FamilyPendingUser[];
  isLoading: boolean;
  errorMessage: string | null;
  totalCount?: number;
  activeRequestKey?: string | null;
  feedbackMessage?: string;
  feedbackTone?: 'success' | 'error' | null;
  onApprove?: (request: FamilyPendingUser) => void;
  onReject?: (request: FamilyPendingUser) => void;
  onBlock?: (request: FamilyPendingUser) => void;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (requests.length === 0) {
    return <EmptySectionMessage message="아직 받은 신청이 없어요." />;
  }

  return (
    <div className="space-y-3">
      {mode === 'summary' && typeof totalCount === 'number' ? (
        <p className="text-xs font-medium text-neutral-400">총 {totalCount}건의 신청이 있어요.</p>
      ) : null}

      {mode === 'manage' && feedbackMessage && feedbackTone ? (
        <InlineFeedback tone={feedbackTone} message={feedbackMessage} />
      ) : null}

      {requests.map((request) => {
        const requestKey = `${request.targetPetId}-${request.userId}`;
        const isProcessing = activeRequestKey === requestKey;
        const canManage = mode === 'manage' && request.status === 'PENDING';
        const timestamp =
          request.status === 'REJECTED' && request.rejectedAt ? request.rejectedAt : request.requestedAt;

        return (
          <div key={requestKey} className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
            <div className="flex items-start gap-3">
              <ProfileImage src={request.profileUrl || null} alt={request.nickname} />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-neutral-900">{request.nickname}</p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusClassName(request.status)}`}
                      >
                        {getStatusLabel(request.status)}
                      </span>
                    </div>

                    <p className="mt-1 text-xs font-medium text-neutral-400">{formatRequestedAt(timestamp)}</p>
                  </div>

                  {canManage ? (
                    <div className="flex shrink-0 items-center gap-2">
                      <ActionButton
                        label={isProcessing ? '처리 중' : '승인'}
                        kind="approve"
                        disabled={isProcessing}
                        onClick={() => onApprove?.(request)}
                      />
                      <ActionButton
                        label="거절"
                        kind="reject"
                        disabled={isProcessing}
                        onClick={() => onReject?.(request)}
                      />
                      <ActionButton
                        label="차단"
                        kind="block"
                        disabled={isProcessing}
                        onClick={() => onBlock?.(request)}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
