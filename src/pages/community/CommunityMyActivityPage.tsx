import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { CommunityProfileCard } from '@/features/community';

type ActivityTab = 'posts' | 'comments';

function getTabFromSearch(value: string | null): ActivityTab {
  if (value === 'comments') return 'comments';
  return 'posts';
}

export function CommunityMyActivityPage() {
  const [searchParams] = useSearchParams();
  const activeTab = getTabFromSearch(searchParams.get('tab'));
  const { profileUrl, nickname } = useCurrentUser();

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <CommunityProfileCard profileUrl={profileUrl} nickname={nickname} />
      </aside>

      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">MY ACTIVITY</p>
          <h1 className="mt-2 text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">내 활동</h1>
        </div>

        <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
          <div className="flex border-b border-neutral-100">
            <TabButton to="/community/my?tab=posts" isActive={activeTab === 'posts'}>
              내 게시글
            </TabButton>
            <TabButton to="/community/my?tab=comments" isActive={activeTab === 'comments'}>
              내 댓글
            </TabButton>
          </div>

          <div className="px-6 py-8 sm:px-8">{activeTab === 'posts' ? <MyPostsTab /> : <MyCommentsTab />}</div>
        </div>
      </div>
    </div>
  );
}

function TabButton({ to, isActive, children }: { to: string; isActive: boolean; children: ReactNode }) {
  return (
    <Link
      to={to}
      className={[
        'flex-1 py-3.5 text-center text-sm font-medium transition-colors',
        isActive ? 'border-b-2 border-brand text-brand' : 'text-neutral-500 hover:text-neutral-700',
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
      message="작성한 게시글이 없어요."
      description="반려동물 이야기를 첫 번째로 공유해보세요!"
      action={
        <Link
          to="/community/new"
          className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          글쓰기
        </Link>
      }
    />
  );
}

function MyCommentsTab() {
  return (
    <EmptyState
      icon={<CommentIcon className="h-10 w-10 text-neutral-300" />}
      message="작성한 댓글이 없어요."
      description="다른 분들의 이야기에 댓글을 남겨보세요."
      action={
        <Link
          to="/community"
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          커뮤니티 둘러보기
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
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon}
      <p className="mt-4 text-sm font-medium text-neutral-700">{message}</p>
      <p className="mt-1.5 text-sm text-neutral-400">{description}</p>
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
