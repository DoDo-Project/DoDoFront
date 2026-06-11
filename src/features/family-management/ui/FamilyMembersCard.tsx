import type { PetFamilyMember } from '@/features/auth';

import { EmptySectionMessage, ErrorSectionMessage, ProfileImage, SectionContentSkeleton } from './FamilyVisuals';

export function FamilyMembersCard({
  members,
  isLoading,
  errorMessage,
}: {
  members: PetFamilyMember[];
  isLoading: boolean;
  errorMessage: string | null;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (members.length === 0) {
    return <EmptySectionMessage message="아직 등록된 가족 구성원이 없어요." />;
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div
          key={member.userId}
          className="flex items-center gap-3 rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4"
        >
          <ProfileImage src={member.profileImageUrl || null} alt={member.userName} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900">{member.userName}</p>
            <p className="mt-1 text-xs font-medium text-neutral-500">현재 함께 관리 중인 가족 구성원</p>
          </div>
        </div>
      ))}
    </div>
  );
}
