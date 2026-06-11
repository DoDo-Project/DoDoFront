import type { FamilyPendingUser } from '@/features/auth';

import { formatRequestedAt } from '../lib/formatters';
import { EmptySectionMessage, ErrorSectionMessage, ProfileImage, SectionContentSkeleton } from './FamilyVisuals';

export function FamilyPendingRequestsCard({
  requests,
  isLoading,
  errorMessage,
}: {
  requests: FamilyPendingUser[];
  isLoading: boolean;
  errorMessage: string | null;
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
      {requests.map((request) => (
        <div
          key={`${request.targetPetId}-${request.userId}`}
          className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4"
        >
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
