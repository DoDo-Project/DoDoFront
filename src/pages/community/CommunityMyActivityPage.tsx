import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { CommunityLayout, CommunitySidebarPanel } from '@/features/community';

type ActivityTab = 'posts' | 'comments';

const ACTIVITY_COPY = {
  heading: '내 활동',
  description: '내가 남긴 게시글과 댓글 활동을 한곳에서 확인해보세요.',
  myPosts: '내 게시글',
  myComments: '내 댓글',
  emptyPostsTitle: '아직 작성한 게시글이 없어요.',
  emptyPostsDescription: '첫 번째 반려생활 이야기를 커뮤니티에 공유해보세요.',
  emptyCommentsTitle: '아직 작성한 댓글이 없어요.',
  emptyCommentsDescription: '다른 친구들의 게시글에 댓글을 남기며 소통해보세요.',
  writePost: '글쓰기',
  browseCommunity: '커뮤니티 둘러보기',
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
      eyebrow="MY COMMUNITY"
      title={ACTIVITY_COPY.heading}
      description={ACTIVITY_COPY.description}
      sidebar={<CommunitySidebarPanel profileUrl={profileUrl} nickname={nickname} />}
      content={
        <div className="space-y-6">
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
