import { Link } from 'react-router-dom';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';

interface CommunityProfileCardProps {
  profileUrl: string | null;
  nickname: string | null;
}

export function CommunityProfileCard({ profileUrl, nickname }: CommunityProfileCardProps) {
  const resolvedName = nickname?.trim() || '도도 친구';

  return (
    <section className="overflow-hidden rounded-[26px] border border-neutral-200 bg-white shadow-sm">
      <div className="bg-linear-to-br from-brand/[0.14] via-[#f7e6d9] to-white px-5 py-6">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-neutral-100 shadow-sm">
          <img
            src={profileUrl?.trim() || profileDefaultIllustration}
            alt=""
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = profileDefaultIllustration;
            }}
          />
        </div>
        <p className="mt-4 text-center text-[20px] font-semibold tracking-[-0.02em] text-neutral-900">{resolvedName}</p>
        <p className="mt-1 text-center text-sm text-neutral-500">오늘의 반려생활을 기록해보세요.</p>
      </div>

      <div className="px-5 py-5">
        <Link
          to="/community/new"
          className="inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          글쓰기
        </Link>
      </div>
    </section>
  );
}
