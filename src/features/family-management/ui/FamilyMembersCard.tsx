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
    return <SectionContentSkeleton rows={1} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (members.length === 0) {
    return <EmptySectionMessage message="아직 등록된 가족 구성원이 없어요." />;
  }

  return (
    <div className="rounded-[16px] border border-neutral-200/80 bg-white/90 px-4 py-4">
      <div className="flex flex-wrap gap-3">
        {members.map((member) => (
          <div
            key={member.userId}
            className="inline-flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-3 py-2"
          >
            <ProfileImage src={member.profileImageUrl || null} alt={member.userName} />
            <span className="text-sm font-medium text-neutral-900">{member.userName}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
