import { useState } from 'react';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import type { UserProfile } from '@/features/auth/model/types';
import { Skeleton } from '@/shared/ui';

interface MyDodoProfileCardProps {
  user: UserProfile | null;
  profileUrl: string | null;
  displayName: string;
  isLoading?: boolean;
}

function ProfileAvatar({ profileUrl }: { profileUrl: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const resolvedUrl = profileUrl?.trim() || null;
  const activeImageUrl = resolvedUrl && failedUrl !== resolvedUrl ? resolvedUrl : null;

  return (
    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 shadow-sm">
      {activeImageUrl ? (
        <img
          src={activeImageUrl}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailedUrl(activeImageUrl)}
        />
      ) : (
        <img src={profileDefaultIllustration} alt="" className="h-full w-full object-cover" draggable={false} />
      )}
    </div>
  );
}

export function MyDodoProfileCard({ user, profileUrl, displayName, isLoading = false }: MyDodoProfileCardProps) {
  const region = user?.region?.trim() || null;
  const email = user?.email?.trim() || null;

  if (isLoading) {
    return (
      <section className="px-1">
        <div className="flex flex-col items-center text-center">
          <Skeleton className="h-24 w-24 rounded-full" />

          <div className="mt-5 flex w-full max-w-[180px] flex-col items-center gap-3">
            <Skeleton className="h-6 w-28 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-lg" />
            <Skeleton className="h-4 w-36 rounded-lg" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[18px] border border-white/80 bg-white/80 px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
      <div className="flex flex-col items-center text-center">
        <ProfileAvatar profileUrl={profileUrl} />

        <div className="mt-5 min-h-20">
          <h2 className="text-[22px] font-semibold leading-tight text-neutral-900">{displayName}</h2>
          <p className="mt-3 text-sm font-medium text-neutral-400">{region || '-'}</p>
          <p className="mt-2 text-sm text-neutral-400">{email || '-'}</p>
        </div>
      </div>
    </section>
  );
}
