import { useState } from 'react';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import type { UserProfile } from '@/features/auth/model/types';

interface MyDodoProfileCardProps {
  user: UserProfile | null;
  profileUrl: string | null;
  displayName: string;
  isLoading?: boolean;
}

function ProfileAvatar({ profileUrl }: { profileUrl: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const resolvedUrl = profileUrl?.trim() || null;
  const showUploadedImage = Boolean(resolvedUrl) && failedUrl !== resolvedUrl;

  return (
    <div className="flex h-30 w-30 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100">
      {showUploadedImage ? (
        <img
          src={resolvedUrl!}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailedUrl(resolvedUrl)}
        />
      ) : (
        <img src={profileDefaultIllustration} alt="" className="h-full w-full object-cover" draggable={false} />
      )}
    </div>
  );
}

export function MyDodoProfileCard({ user, profileUrl, displayName, isLoading = false }: MyDodoProfileCardProps) {
  const nickname = user?.nickname?.trim() || null;
  const email = user?.email?.trim() || null;

  return (
    <section className="rounded-[28px] border border-neutral-200 bg-white px-8 py-10 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <ProfileAvatar profileUrl={profileUrl} />

        <div className="mt-6 min-h-24">
          <h2 className="text-[32px] font-semibold leading-tight text-neutral-900">
            {isLoading ? '불러오는 중...' : displayName}
          </h2>
          <p className="mt-3 text-xl font-medium text-neutral-400">{nickname || '-'}</p>
          <p className="mt-4 text-xl text-neutral-400">{email || '-'}</p>
        </div>
      </div>
    </section>
  );
}
