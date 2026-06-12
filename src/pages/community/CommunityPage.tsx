import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { type BoardListItem, CommunityFeedCard, CommunityProfileCard, useBoardList } from '@/features/community';
import { LoadingSpinner } from '@/shared/ui';

export function CommunityPage() {
  const { profileUrl, nickname } = useCurrentUser();
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useBoardList();

  const boards = useMemo(() => data?.pages.flatMap((page) => page.boards) ?? [], [data]);

  const popularBoards = useMemo(() => [...boards].sort((a, b) => b.likeCount - a.likeCount).slice(0, 3), [boards]);

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-6 lg:self-start">
        <CommunityProfileCard profileUrl={profileUrl} nickname={nickname} />
      </aside>

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
    </div>
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
      <div className="flex items-center gap-3">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-brand">HOT TOPICS</p>
          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-neutral-950">인기 게시물</h2>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold tracking-[0.14em] text-brand">
          TOP 3
        </span>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PopularCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState />
      ) : boards.length === 0 ? (
        <EmptyPopularState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
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
    3: 'bg-amber-700/70 text-white',
  };
  const rankColor = rankColors[rank] ?? 'bg-neutral-300 text-white';

  return (
    <Link to={`/community/${board.boardId}`} className="group block">
      <article className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
          {board.thumbnailImageUrl ? (
            <img
              src={board.thumbnailImageUrl}
              alt={board.boardTitle}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/[0.06] via-neutral-100 to-neutral-200">
              <ImagePlaceholderIcon className="h-10 w-10 text-neutral-300" />
            </div>
          )}
          <span
            className={`absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold shadow-sm ${rankColor}`}
          >
            {rank}
          </span>
        </div>

        <div className="space-y-2 px-3.5 py-3.5">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">{board.boardTitle}</p>
          {board.boardContentPreview ? (
            <p className="line-clamp-1 text-xs text-neutral-500">{board.boardContentPreview}</p>
          ) : null}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <span className="truncate text-xs text-neutral-400">{board.nickname}</span>
            <div className="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
              <span className="inline-flex items-center gap-1">
                <HeartIcon className="h-3.5 w-3.5 text-[#d65d4b]" />
                {board.likeCount}
              </span>
              <span className="inline-flex items-center gap-1">
                <CommentIcon className="h-3.5 w-3.5 text-neutral-400" />
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
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.22em] text-neutral-400">BOARD</p>
          <h2 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-neutral-950">최근 게시물</h2>
        </div>
        <Link
          to="/community/new"
          className="shrink-0 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          글쓰기
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
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
          <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
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

          {hasNextPage && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={onLoadMore}
                disabled={isFetchingNextPage}
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-2.5 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
              >
                {isFetchingNextPage ? <LoadingSpinner size="sm" /> : null}
                {isFetchingNextPage ? '불러오는 중...' : '더 보기'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-neutral-200 bg-white px-6 py-12 text-center shadow-sm">
      <p className="text-sm font-medium text-neutral-700">게시글을 불러오지 못했어요.</p>
      <p className="mt-1.5 text-sm text-neutral-400">잠시 후 다시 시도해주세요.</p>
    </div>
  );
}

function EmptyPopularState() {
  return (
    <div className="flex items-center justify-center rounded-[20px] border border-dashed border-neutral-200 bg-white px-6 py-10 text-center">
      <p className="text-sm text-neutral-400">아직 게시글이 없어요.</p>
    </div>
  );
}

function EmptyRecentState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-neutral-200 bg-white px-6 py-14 text-center shadow-sm">
      <p className="text-sm font-medium text-neutral-700">아직 게시글이 없어요.</p>
      <p className="mt-1.5 text-sm text-neutral-400">첫 번째 이야기를 들려주세요!</p>
      <Link
        to="/community/new"
        className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
      >
        글쓰기
      </Link>
    </div>
  );
}

function PopularCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="aspect-4/3 animate-pulse bg-neutral-100" />
      <div className="space-y-2 px-3.5 py-3.5">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-3 w-full animate-pulse rounded-md bg-neutral-100" />
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
    <div className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
      <div className="aspect-4/3 animate-pulse bg-neutral-100" />
      <div className="space-y-2 px-3.5 py-3.5">
        <div className="h-4 w-3/4 animate-pulse rounded-md bg-neutral-100" />
        <div className="h-3 w-full animate-pulse rounded-md bg-neutral-100" />
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
