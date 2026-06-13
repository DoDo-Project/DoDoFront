import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import {
  type BoardListItem,
  type MyCommentListItem,
  CommunityFeedCard,
  CommunityLayout,
  CommunitySidebarPanel,
  MY_ACTIVITY_STATUS_MESSAGES,
  useMyBoardList,
  useMyCommentList,
} from '@/features/community';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { LoadingSpinner } from '@/shared/ui';

type ActivityTab = 'posts' | 'comments';

const PAGE_SIZE = 10;

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
  postsFailedTitle: '내 게시글을 불러오지 못했어요.',
  commentsFailedTitle: '내 댓글을 불러오지 못했어요.',
  failedDescription: '잠시 후 다시 시도해주세요.',
  retry: '다시 시도',
  previousPage: '이전',
  nextPage: '다음',
  loadingPosts: '내 게시글을 불러오는 중...',
  loadingComments: '내 댓글을 불러오는 중...',
  commentOn: '댓글 단 게시글',
};

function getTabFromSearch(value: string | null): ActivityTab {
  if (value === 'comments') return 'comments';
  return 'posts';
}

export function CommunityMyActivityPage() {
  const [searchParams] = useSearchParams();
  const activeTab = getTabFromSearch(searchParams.get('tab'));
  const { profileUrl, nickname } = useCurrentUser();
  const [postsPage, setPostsPage] = useState(0);
  const [commentsPage, setCommentsPage] = useState(0);

  const myPostsQuery = useMyBoardList({ page: postsPage, size: PAGE_SIZE });
  const myCommentsQuery = useMyCommentList({ page: commentsPage, size: PAGE_SIZE });

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

            <div className="px-6 py-8 sm:px-8">
              {activeTab === 'posts' ? (
                <MyPostsTab
                  boards={myPostsQuery.data?.boards ?? []}
                  page={postsPage}
                  hasNextPage={(myPostsQuery.data?.boards.length ?? 0) >= PAGE_SIZE}
                  isLoading={myPostsQuery.isLoading}
                  isError={myPostsQuery.isError}
                  errorMessage={getApiErrorMessage(
                    myPostsQuery.error,
                    ACTIVITY_COPY.failedDescription,
                    MY_ACTIVITY_STATUS_MESSAGES,
                  )}
                  onRetry={() => void myPostsQuery.refetch()}
                  onPreviousPage={() => setPostsPage((current) => Math.max(current - 1, 0))}
                  onNextPage={() => setPostsPage((current) => current + 1)}
                />
              ) : (
                <MyCommentsTab
                  comments={myCommentsQuery.data?.data ?? []}
                  pageInfo={myCommentsQuery.data?.pageInfo}
                  isLoading={myCommentsQuery.isLoading}
                  isError={myCommentsQuery.isError}
                  errorMessage={getApiErrorMessage(
                    myCommentsQuery.error,
                    ACTIVITY_COPY.failedDescription,
                    MY_ACTIVITY_STATUS_MESSAGES,
                  )}
                  onRetry={() => void myCommentsQuery.refetch()}
                  onPreviousPage={() => setCommentsPage((current) => Math.max(current - 1, 0))}
                  onNextPage={() => setCommentsPage((current) => current + 1)}
                />
              )}
            </div>
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

interface MyPostsTabProps {
  boards: BoardListItem[];
  page: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function MyPostsTab({
  boards,
  page,
  hasNextPage,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onPreviousPage,
  onNextPage,
}: MyPostsTabProps) {
  if (isLoading) {
    return <LoadingState message={ACTIVITY_COPY.loadingPosts} />;
  }

  if (isError) {
    return <ErrorState title={ACTIVITY_COPY.postsFailedTitle} description={errorMessage} onRetry={onRetry} />;
  }

  if (boards.length === 0) {
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

  return (
    <div className="space-y-8">
      <div>
        {boards.map((board) => (
          <CommunityFeedCard
            key={board.boardId}
            title={board.boardTitle}
            preview={board.boardContentPreview}
            imageUrl={board.thumbnailImageUrl}
            nickname={board.nickname}
            likes={board.likeCount}
            comments={board.commentCount}
            views={board.viewCount}
            createdAt={board.createdAt}
            to={`/community/${board.boardId}`}
            variant="list"
          />
        ))}
      </div>

      <PaginationControls
        page={page}
        hasPreviousPage={page > 0}
        hasNextPage={hasNextPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />
    </div>
  );
}

interface MyCommentsTabProps {
  comments: MyCommentListItem[];
  pageInfo?: { page: number; totalPages: number };
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  onRetry: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function MyCommentsTab({
  comments,
  pageInfo,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onPreviousPage,
  onNextPage,
}: MyCommentsTabProps) {
  if (isLoading) {
    return <LoadingState message={ACTIVITY_COPY.loadingComments} />;
  }

  if (isError) {
    return <ErrorState title={ACTIVITY_COPY.commentsFailedTitle} description={errorMessage} onRetry={onRetry} />;
  }

  if (comments.length === 0) {
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

  return (
    <div className="space-y-8">
      <div className="divide-y divide-neutral-200 rounded-[22px] border border-neutral-200 bg-white">
        {comments.map((comment) => (
          <Link
            key={comment.commentId}
            to={`/community/${comment.boardId}`}
            className="block px-5 py-5 transition-colors hover:bg-neutral-50"
          >
            <p className="text-xs font-semibold tracking-[0.14em] text-brand">{ACTIVITY_COPY.commentOn}</p>
            <p className="mt-2 text-[17px] font-semibold tracking-[-0.03em] text-neutral-900">{comment.boardTitle}</p>
            <p className="mt-3 line-clamp-2 whitespace-pre-wrap text-[15px] leading-7 text-neutral-600">
              {comment.commentContent}
            </p>
            <p className="mt-3 text-sm text-neutral-400">{formatDateTime(comment.modifiedAt ?? comment.createdAt)}</p>
          </Link>
        ))}
      </div>

      <PaginationControls
        page={pageInfo?.page ?? 0}
        hasPreviousPage={(pageInfo?.page ?? 0) > 0}
        hasNextPage={(pageInfo?.page ?? 0) < (pageInfo?.totalPages ?? 1) - 1}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
      />
    </div>
  );
}

function PaginationControls({
  page,
  hasPreviousPage,
  hasNextPage,
  onPreviousPage,
  onNextPage,
}: {
  page: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        type="button"
        onClick={onPreviousPage}
        disabled={!hasPreviousPage}
        className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        {ACTIVITY_COPY.previousPage}
      </button>
      <span className="text-sm text-neutral-500">{page + 1}</span>
      <button
        type="button"
        onClick={onNextPage}
        disabled={!hasNextPage}
        className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40"
      >
        {ACTIVITY_COPY.nextPage}
      </button>
    </div>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-[22px] bg-neutral-50 text-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-neutral-500">{message}</p>
    </div>
  );
}

function ErrorState({ title, description, onRetry }: { title: string; description: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[22px] bg-neutral-50 px-6 py-10 text-center">
      <p className="text-sm font-semibold text-neutral-800">{title}</p>
      <p className="mt-1.5 text-sm leading-6 text-neutral-500">{description}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 inline-flex items-center justify-center rounded-2xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-brand/30 hover:bg-brand/[0.04]"
      >
        {ACTIVITY_COPY.retry}
      </button>
    </div>
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

function formatDateTime(value?: string) {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
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
