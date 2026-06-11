import type { FamilyBlockedUser } from '@/features/auth';

import { formatRequestedAt } from '../lib/formatters';
import {
  EmptySectionMessage,
  ErrorSectionMessage,
  InlineFeedback,
  ProfileImage,
  SectionContentSkeleton,
} from './FamilyVisuals';

export function FamilyBlockedUsersCard({
  users,
  isLoading,
  errorMessage,
  activeBlockedUserKey,
  feedbackMessage,
  feedbackTone,
  onRelease,
}: {
  users: FamilyBlockedUser[];
  isLoading: boolean;
  errorMessage: string | null;
  activeBlockedUserKey: string | null;
  feedbackMessage: string;
  feedbackTone: 'success' | 'error' | null;
  onRelease: (user: FamilyBlockedUser) => void;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (users.length === 0) {
    return <EmptySectionMessage message="선택한 반려동물의 차단 목록이 비어 있어요." />;
  }

  return (
    <div className="space-y-3">
      {feedbackMessage && feedbackTone ? <InlineFeedback tone={feedbackTone} message={feedbackMessage} /> : null}

      {users.map((user) => {
        const blockedUserKey = `${user.targetPetId}-${user.userId}`;
        const isReleasing = activeBlockedUserKey === blockedUserKey;

        return (
          <div key={blockedUserKey} className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
            <div className="flex items-start gap-3">
              <ProfileImage src={user.profileUrl || null} alt={user.nickname} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-neutral-900">{user.nickname}</p>
                  <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold text-neutral-700">
                    차단됨
                  </span>
                </div>
                <p className="mt-2 text-sm leading-7 text-neutral-600">{user.targetPetName} 신청 차단 목록에 있어요.</p>
                <p className="mt-1 text-xs font-medium text-neutral-400">차단일 {formatRequestedAt(user.blockedAt)}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onRelease(user)}
                    disabled={isReleasing}
                    className="inline-flex h-10 min-w-24 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isReleasing ? '해제 중' : '차단 해제'}
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
