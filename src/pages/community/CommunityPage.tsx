import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import {
  type BoardListItem,
  CommunityFeedCard,
  CommunityLayout,
  CommunitySidebarPanel,
  useBoardList,
} from '@/features/community';
import { LoadingSpinner } from '@/shared/ui';

const COMMUNITY_COPY = {
  popularTitle: '인기 게시물',
  popularDescription: '지금 커뮤니티에서 반응이 좋은 이야기를 먼저 만나보세요.',
  recentTitle: '최근 게시물',
  recentDescription: '반려생활 속 소소한 기록부터 유용한 팁까지 한눈에 둘러보세요.',
  loadMore: '더 보기',
  loadingMore: '게시글을 불러오는 중...',
  loadErrorTitle: '게시글을 불러오지 못했어요.',
  loadErrorDescription: '잠시 후 다시 시도해주세요.',
  emptyPopular: '아직 인기 게시물이 없어요.',
  emptyRecentTitle: '아직 등록된 게시글이 없어요.',
  emptyRecentDescription: '첫 번째 반려생활 이야기를 남겨보세요.',
  writePost: '글쓰기',
};

export function CommunityPage() {
  const { profileUrl, nickname } = useCurrentUser();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useBoardList();

  const boards = useMemo(() => data?.pages.flatMap((page) => page.boards) ?? [], [data]);
  const popularBoards = useMemo(() => [...boards].sort((a, b) => b.likeCount - a.likeCount).slice(0, 3), [boards]);

  return (
    <CommunityLayout
      sidebar={<CommunitySidebarPanel profileUrl={profileUrl} nickname={nickname} />}
      content={
        <div className="space-y-14">
          <PopularSection boards={popularBoards} isLoading={isLoading} isError={isError} />
          <RecentSection
            boards={boards}
            isLoading={isLoading}
            isError={isError}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => void fetchNextPage()}
          />
        </div>
      }
    />
  );
}

function PopularSection({
  boards,
  isLoading,
  isError,
}: {
  boards: BoardListItem[];
  isLoading: boolean;
  isError: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">POPULAR PICKS</p>
          <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-neutral-950">
            {COMMUNITY_COPY.popularTitle}
          </h2>
          <p className="mt-1 text-sm text-neutral-500">{COMMUNITY_COPY.popularDescription}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-6 shadow-sm sm:px-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState />
      ) : boards.length === 0 ? (
        <EmptyPopularState />
      ) : (
        <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-6 shadow-sm sm:px-8">
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
      )}
    </section>
  );
}

function RecentSection({
  boards,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  boards: BoardListItem[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-neutral-400">COMMUNITY BOARD</p>
        <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.03em] text-neutral-950">
          {COMMUNITY_COPY.recentTitle}
        </h2>
        <p className="mt-1 text-sm text-neutral-500">{COMMUNITY_COPY.recentDescription}</p>
      </div>

      {isLoading ? (
        <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-6 shadow-sm sm:px-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListRowSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState />
      ) : boards.length === 0 ? (
        <EmptyRecentState />
      ) : (
        <div className="space-y-10 rounded-[24px] border border-neutral-200 bg-white px-6 py-6 shadow-sm sm:px-8">
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

          {hasNextPage ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
              >
                {isFetchingNextPage ? <LoadingSpinner size="sm" /> : null}
                {isFetchingNextPage ? COMMUNITY_COPY.loadingMore : COMMUNITY_COPY.loadMore}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-neutral-200 bg-white px-6 py-14 text-center shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
      <p className="text-sm font-semibold text-neutral-800">{COMMUNITY_COPY.loadErrorTitle}</p>
      <p className="mt-1.5 text-sm text-neutral-500">{COMMUNITY_COPY.loadErrorDescription}</p>
    </div>
  );
}

function EmptyPopularState() {
  return (
    <div className="flex items-center justify-center rounded-[24px] border border-dashed border-neutral-200 bg-white px-6 py-12 text-center">
      <p className="text-sm text-neutral-500">{COMMUNITY_COPY.emptyPopular}</p>
    </div>
  );
}

function EmptyRecentState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-neutral-200 bg-white px-6 py-16 text-center shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
      <p className="text-sm font-semibold text-neutral-800">{COMMUNITY_COPY.emptyRecentTitle}</p>
      <p className="mt-1.5 text-sm text-neutral-500">{COMMUNITY_COPY.emptyRecentDescription}</p>
      <Link
        to="/community/new"
        className="mt-5 inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5"
      >
        {COMMUNITY_COPY.writePost}
      </Link>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className="py-6 first:pt-0 last:pb-0 last:[&>.item-divider]:hidden">
      <div className="flex gap-4">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-4 w-full animate-pulse rounded-md bg-neutral-100" />
          <div className="h-4 w-4/5 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-4 w-1/2 animate-pulse rounded-md bg-neutral-100" />
        </div>
        <div className="h-16 w-16 shrink-0 animate-pulse rounded-[10px] bg-neutral-100 sm:h-[72px] sm:w-[72px]" />
      </div>
      <div className="item-divider mt-6 border-b border-neutral-300/90" />
    </div>
  );
}
