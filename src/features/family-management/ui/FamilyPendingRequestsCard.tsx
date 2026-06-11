import type { FamilyPendingUser } from '@/features/auth';

import { formatRequestedAt } from '../lib/formatters';
import {
  EmptySectionMessage,
  ErrorSectionMessage,
  InlineFeedback,
  ProfileImage,
  SectionContentSkeleton,
} from './FamilyVisuals';

export function FamilyPendingRequestsCard({
  requests,
  isLoading,
  errorMessage,
  activeRequestKey,
  feedbackMessage,
  feedbackTone,
  onApprove,
  onReject,
  onBlock,
}: {
  requests: FamilyPendingUser[];
  isLoading: boolean;
  errorMessage: string | null;
  activeRequestKey: string | null;
  feedbackMessage: string;
  feedbackTone: 'success' | 'error' | null;
  onApprove: (request: FamilyPendingUser) => void;
  onReject: (request: FamilyPendingUser) => void;
  onBlock: (request: FamilyPendingUser) => void;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (requests.length === 0) {
    return <EmptySectionMessage message="선택한 반려동물로 들어온 가족 신청이 아직 없어요." />;
  }

  return (
    <div className="space-y-3">
      {feedbackMessage && feedbackTone ? <InlineFeedback tone={feedbackTone} message={feedbackMessage} /> : null}

      {requests.map((request) => {
        const requestKey = `${request.targetPetId}-${request.userId}`;
        const isProcessing = activeRequestKey === requestKey;

        return (
          <div key={requestKey} className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
            <div className="flex items-start gap-3">
              <ProfileImage src={request.profileUrl || null} alt={request.nickname} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900">{request.nickname}</p>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                    승인 대기
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{request.targetPetName} 가족으로 신청했어요.</p>
                <p className="mt-1 text-xs font-medium text-neutral-400">{formatRequestedAt(request.requestedAt)}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onApprove(request)}
                    disabled={isProcessing}
                    className="inline-flex h-10 min-w-24 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isProcessing ? '처리 중' : '승인'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject(request)}
                    disabled={isProcessing}
                    className="inline-flex h-10 min-w-24 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-rose-200 hover:text-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    거절
                  </button>
                  <button
                    type="button"
                    onClick={() => onBlock(request)}
                    disabled={isProcessing}
                    className="inline-flex h-10 min-w-24 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:text-neutral-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    차단
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
