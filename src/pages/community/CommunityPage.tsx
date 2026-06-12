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
  popularTitle: '\uC778\uAE30 \uAC8C\uC2DC\uBB3C',
  popularDescription:
    '\uC9C0\uAE08 \uCEE4\uBBA4\uB2C8\uD2F0\uC5D0\uC11C \uBC18\uC751\uC774 \uC88B\uC740 \uC774\uC57C\uAE30\uB97C \uBA3C\uC800 \uB9CC\uB098\uBCF4\uC138\uC694.',
  recentTitle: '\uCD5C\uADFC \uAC8C\uC2DC\uBB3C',
  recentDescription:
    '\uBC18\uB824\uC0DD\uD65C \uC18D \uC18C\uC18C\uD55C \uAE30\uB85D\uBD80\uD130 \uC720\uC6A9\uD55C \uD301\uAE4C\uC9C0 \uD55C\uB208\uC5D0 \uB458\uB7EC\uBCF4\uC138\uC694.',
  loadMore: '\uB354 \uBCF4\uAE30',
  loadingMore: '\uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uB294 \uC911...',
  loadErrorTitle: '\uAC8C\uC2DC\uAE00\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.',
  loadErrorDescription: '\uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694.',
  emptyPopular: '\uC544\uC9C1 \uC778\uAE30 \uAC8C\uC2DC\uBB3C\uC774 \uC5C6\uC5B4\uC694.',
  emptyRecentTitle: '\uC544\uC9C1 \uB4F1\uB85D\uB41C \uAC8C\uC2DC\uAE00\uC774 \uC5C6\uC5B4\uC694.',
  emptyRecentDescription:
    '\uCCAB \uBC88\uC9F8 \uBC18\uB824\uC0DD\uD65C \uC774\uC57C\uAE30\uB97C \uB0A8\uACA8\uBCF4\uC138\uC694.',
  writePost: '\uAE00\uC4F0\uAE30',
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
        <div className="space-y-10">
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
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PopularCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState />
      ) : boards.length === 0 ? (
        <EmptyPopularState />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {boards.map((board, index) => (
            <PopularCard key={board.boardId} board={board} rank={index + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

function PopularCard({ board, rank }: { board: BoardListItem; rank: number }) {
  const rankColors: Record<number, string> = {
    1: 'bg-amber-400 text-white',
    2: 'bg-neutral-400 text-white',
    3: 'bg-amber-700/80 text-white',
  };
  const rankColor = rankColors[rank] ?? 'bg-neutral-300 text-white';

  return (
    <Link to={`/community/${board.boardId}`} className="group block">
      <article className="overflow-hidden rounded-[24px] border border-neutral-200/80 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_56px_rgba(15,23,42,0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
          {board.thumbnailImageUrl ? (
            <img
              src={board.thumbnailImageUrl}
              alt={board.boardTitle}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-brand/[0.08] via-[#fff5ea] to-neutral-100">
              <ImagePlaceholderIcon className="h-10 w-10 text-neutral-300" />
            </div>
          )}
          <span
            className={`absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow-sm ${rankColor}`}
          >
            {rank}
          </span>
        </div>

        <div className="space-y-2.5 px-4 py-4">
          <p className="line-clamp-2 text-base font-semibold leading-snug text-neutral-900">{board.boardTitle}</p>
          {board.boardContentPreview ? (
            <p className="line-clamp-2 text-sm leading-6 text-neutral-500">{board.boardContentPreview}</p>
          ) : null}
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="truncate text-sm text-neutral-400">{board.nickname}</span>
            <div className="flex shrink-0 items-center gap-3 text-sm text-neutral-500">
              <span className="inline-flex items-center gap-1">
                <HeartIcon className="h-4 w-4 text-[#d65d4b]" />
                {board.likeCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <CommentIcon className="h-4 w-4 text-neutral-400" />
                {board.commentCount}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
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
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <BoardCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState />
      ) : boards.length === 0 ? (
        <EmptyRecentState />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
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

function PopularCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
      <div className="aspect-[4/3] animate-pulse bg-neutral-100" />
      <div className="space-y-2.5 px-4 py-4">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-3 w-full animate-pulse rounded-md bg-neutral-100" />
        <div className="h-3 w-2/3 animate-pulse rounded-md bg-neutral-100" />
        <div className="flex justify-between pt-1">
          <div className="h-3 w-16 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-3 w-20 animate-pulse rounded-md bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

function BoardCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.05)]">
      <div className="aspect-[4/3] animate-pulse bg-neutral-100" />
      <div className="space-y-2.5 px-4 py-4">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-3 w-full animate-pulse rounded-md bg-neutral-100" />
        <div className="h-3 w-2/3 animate-pulse rounded-md bg-neutral-100" />
        <div className="flex justify-between pt-1">
          <div className="h-3 w-16 animate-pulse rounded-md bg-neutral-100" />
          <div className="h-3 w-20 animate-pulse rounded-md bg-neutral-100" />
        </div>
      </div>
    </div>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 21s-6.716-4.304-9.428-7.851C-.315 9.382.496 4.5 4.96 3.297A5.53 5.53 0 0 1 12 6.045a5.53 5.53 0 0 1 7.04-2.748c4.464 1.203 5.276 6.085 2.387 9.852C18.716 16.696 12 21 12 21Z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <path
        d="M8 19.5 4.5 21l1.125-3.375A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5H8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImagePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
