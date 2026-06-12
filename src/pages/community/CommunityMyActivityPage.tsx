import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { CommunityLayout, CommunitySidebarPanel } from '@/features/community';

type ActivityTab = 'posts' | 'comments';

const ACTIVITY_COPY = {
  heading: '\uB0B4 \uD65C\uB3D9',
  description:
    '\uB0B4\uAC00 \uB0A8\uAE34 \uAC8C\uC2DC\uAE00\uACFC \uB313\uAE00 \uD65C\uB3D9\uC744 \uD55C\uACF3\uC5D0\uC11C \uD655\uC778\uD574\uBCF4\uC138\uC694.',
  myPosts: '\uB0B4 \uAC8C\uC2DC\uAE00',
  myComments: '\uB0B4 \uB313\uAE00',
  emptyPostsTitle: '\uC544\uC9C1 \uC791\uC131\uD55C \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC5B4\uC694.',
  emptyPostsDescription:
    '\uCCAB \uBC88\uC9F8 \uBC18\uB824\uC0DD\uD65C \uC774\uC57C\uAE30\uB97C \uCEE4\uBBA4\uB2C8\uD2F0\uC5D0 \uACF5\uC720\uD574\uBCF4\uC138\uC694.',
  emptyCommentsTitle: '\uC544\uC9C1 \uC791\uC131\uD55C \uB313\uAE00\uC774 \uC5C6\uC5B4\uC694.',
  emptyCommentsDescription:
    '\uB2E4\uB978 \uCE5C\uAD6C\uB4E4\uC758 \uAC8C\uC2DC\uAE00\uC5D0 \uB313\uAE00\uC744 \uB0A8\uAE30\uBA70 \uC18C\uD1B5\uD574\uBCF4\uC138\uC694.',
  writePost: '\uAE00\uC4F0\uAE30',
  browseCommunity: '\uCEE4\uBBA4\uB2C8\uD2F0 \uB458\uB7EC\uBCF4\uAE30',
};

function getTabFromSearch(value: string | null): ActivityTab {
  if (value === 'comments') return 'comments';
  return 'posts';
}

export function CommunityMyActivityPage() {
  const [searchParams] = useSearchParams();
  const activeTab = getTabFromSearch(searchParams.get('tab'));
  const { profileUrl, nickname } = useCurrentUser();

  return (
    <CommunityLayout
      sidebar={<CommunitySidebarPanel profileUrl={profileUrl} nickname={nickname} />}
      content={
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">MY COMMUNITY</p>
            <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-neutral-950">
              {ACTIVITY_COPY.heading}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">{ACTIVITY_COPY.description}</p>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.06)]">
            <div className="flex border-b border-neutral-100 bg-neutral-50/70">
              <TabButton to="/community/my?tab=posts" isActive={activeTab === 'posts'}>
                {ACTIVITY_COPY.myPosts}
              </TabButton>
              <TabButton to="/community/my?tab=comments" isActive={activeTab === 'comments'}>
                {ACTIVITY_COPY.myComments}
              </TabButton>
            </div>

            <div className="px-6 py-8 sm:px-8">{activeTab === 'posts' ? <MyPostsTab /> : <MyCommentsTab />}</div>
          </div>
        </div>
      }
    />
  );
}

function TabButton({ to, isActive, children }: { to: string; isActive: boolean; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={[
        'flex-1 py-4 text-center text-sm font-semibold transition-colors',
        isActive ? 'border-b-2 border-brand bg-white text-neutral-950' : 'text-neutral-500 hover:text-neutral-700',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

function MyPostsTab() {
  return (
    <EmptyState
      icon={<PostIcon className="h-10 w-10 text-neutral-300" />}
      message={ACTIVITY_COPY.emptyPostsTitle}
      description={ACTIVITY_COPY.emptyPostsDescription}
      action={
        <Link
          to="/community/new"
          className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
        >
          {ACTIVITY_COPY.writePost}
        </Link>
      }
    />
  );
}

function MyCommentsTab() {
  return (
    <EmptyState
      icon={<CommentIcon className="h-10 w-10 text-neutral-300" />}
      message={ACTIVITY_COPY.emptyCommentsTitle}
      description={ACTIVITY_COPY.emptyCommentsDescription}
      action={
        <Link
          to="/community"
          className="inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-brand/30 hover:bg-brand/[0.04]"
        >
          {ACTIVITY_COPY.browseCommunity}
        </Link>
      }
    />
  );
}

function EmptyState({
  icon,
  message,
  description,
  action,
}: {
  icon: ReactNode;
  message: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] bg-neutral-50 px-6 py-10 text-center">
      {icon}
      <p className="mt-4 text-sm font-semibold text-neutral-800">{message}</p>
      <p className="mt-1.5 text-sm leading-6 text-neutral-500">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

function PostIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 9h8M8 13h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className={className}>
      <path
        d="M8 19.5 4.5 21l1.125-3.375A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5H8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
