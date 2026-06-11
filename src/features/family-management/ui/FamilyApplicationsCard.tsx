import type { FamilyApplicationItem } from '@/features/auth';

import { formatApplicationStatus, formatRequestedAt, getApplicationStatusClass } from '../lib/formatters';
import { EmptySectionMessage, ErrorSectionMessage, PetImage, SectionContentSkeleton } from './FamilyVisuals';

export function FamilyApplicationsCard({
  applications,
  isLoading,
  errorMessage,
}: {
  applications: FamilyApplicationItem[];
  isLoading: boolean;
  errorMessage: string | null;
}) {
  if (isLoading) {
    return <SectionContentSkeleton rows={2} />;
  }

  if (errorMessage) {
    return <ErrorSectionMessage message={errorMessage} />;
  }

  if (applications.length === 0) {
    return <EmptySectionMessage message="아직 가족 신청을 보낸 내역이 없어요." />;
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => (
        <div
          key={`${application.petId}-${application.requestedAt}`}
          className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-4"
        >
          <div className="flex items-start gap-3">
            <PetImage src={application.petImageUrl} alt={application.petName} species="CANINE" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium text-neutral-900">{application.petName}</p>
                <span
                  className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getApplicationStatusClass(application.status)}`}
                >
                  {formatApplicationStatus(application.status)}
                </span>
              </div>
              <p className="mt-2 text-sm leading-7 text-neutral-600">가족 신청을 보낸 반려동물이에요.</p>
              <p className="mt-1 text-xs font-medium text-neutral-400">{formatRequestedAt(application.requestedAt)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
