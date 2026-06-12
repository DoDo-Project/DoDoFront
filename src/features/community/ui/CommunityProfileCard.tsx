import { Link } from 'react-router-dom';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';

interface CommunityProfileCardProps {
  profileUrl: string | null;
  nickname: string | null;
}

export function CommunityProfileCard({ profileUrl, nickname }: CommunityProfileCardProps) {
  const resolvedName = nickname?.trim() || '\uB3C4\uB3C4 \uCE5C\uAD6C';
  const description =
    '\uC624\uB298\uC758 \uBC18\uB824\uC0DD\uD65C\uC744 \uAE30\uB85D\uD558\uACE0 \uC11C\uB85C\uC758 \uC77C\uC0C1\uC744 \uB098\uB220\uBCF4\uC138\uC694.';

  return (
    <section className="overflow-hidden rounded-[22px] bg-white/90">
      <div className="rounded-[20px] bg-linear-to-br from-brand/[0.16] via-[#fde7d1] to-white px-5 py-6">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-neutral-100 shadow-[0_10px_30px_rgba(15,23,42,0.14)]">
          <img
            src={profileUrl?.trim() || profileDefaultIllustration}
            alt=""
            className="h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src = profileDefaultIllustration;
            }}
          />
        </div>

        <div className="mt-4 text-center">
          <p className="text-[21px] font-semibold tracking-[-0.03em] text-neutral-950">{resolvedName}</p>
          <p className="mt-1 text-sm leading-6 text-neutral-500">{description}</p>
        </div>
      </div>

      <div className="grid gap-2.5 px-2 pb-2 pt-4">
        <Link
          to="/community/new"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          {'\uAE00\uC4F0\uAE30'}
        </Link>
        <Link
          to="/community/my"
          className="inline-flex w-full items-center justify-center rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-brand/30 hover:bg-brand/[0.04]"
        >
          {'\uB0B4 \uD65C\uB3D9'}
        </Link>
      </div>
    </section>
  );
}
