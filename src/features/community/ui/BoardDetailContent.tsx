import { Link } from 'react-router-dom';

import type { BoardDetailResponse } from '../model/types';

interface BoardDetailContentProps {
  board: BoardDetailResponse;
  canManage: boolean;
  onDelete: () => void;
}

const DETAIL_COPY = {
  authorFallback: '작성자',
  report: '신고',
  edit: '수정',
  delete: '삭제',
  commentsTitle: '댓글',
  commentsDescription: '댓글 API 연동 전이라 형식 목업을 먼저 맞춰두었어요.',
  total: '총',
  placeholder: '댓글을 입력해주세요',
  placeholderAria: '댓글 등록 예정 버튼',
};

const MOCK_COMMENTS = [
  {
    id: 1,
    nickname: '배웅배웅',
    dateTime: '2025-10-14 11:25:00',
    content: '어머~^^ 좋은 정보 감사드려요! 행복하세요 :D',
  },
  {
    id: 2,
    nickname: '배웅배웅',
    dateTime: '2025-10-14 11:25:00',
    content: '어머~^^ 좋은 정보 감사드려요! 행복하세요 :D',
  },
];

function formatDateTime(value: string) {
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

export function BoardDetailContent({ board, canManage, onDelete }: BoardDetailContentProps) {
  const likeCount = Math.max(12, Math.round(board.viewCount * 1.7));
  const commentCount = Math.max(MOCK_COMMENTS.length, Math.round(board.viewCount / 3));
  const authorName = board.nickname.trim() || DETAIL_COPY.authorFallback;
  const primaryImage = board.imageFileUrls[0] ?? null;

  return (
    <article className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-neutral-300 bg-white shadow-sm">
        <div className="px-6 py-6 sm:px-8">
          <div className="flex items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f7e5bf] text-lg font-semibold text-neutral-700">
                {authorName.slice(0, 1)}
              </div>
              <div>
                <p className="text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">{authorName}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-neutral-400">
                  <span>{formatDateTime(board.boardCreatedAt)}</span>
                  <span className="inline-flex items-center gap-1">
                    <EyeIcon className="h-4 w-4" />
                    {board.viewCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-400">
              {!canManage ? <button type="button">{DETAIL_COPY.report}</button> : null}
              {canManage ? (
                <>
                  <Link to={`/community/${board.boardId}/edit`}>{DETAIL_COPY.edit}</Link>
                  <button type="button" onClick={onDelete}>
                    {DETAIL_COPY.delete}
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <h1 className="mt-8 text-[26px] font-semibold tracking-[-0.03em] text-neutral-950 sm:text-[34px]">
            {board.boardTitle}
          </h1>

          <div className="mt-6 grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-start">
            <div>
              {primaryImage ? (
                <img
                  src={primaryImage}
                  alt={board.boardTitle}
                  className="aspect-square w-full rounded-[20px] object-cover"
                />
              ) : (
                <div className="aspect-square w-full rounded-[20px] bg-neutral-100" />
              )}
            </div>

            <div className="flex min-h-full flex-col">
              <p className="whitespace-pre-wrap break-words text-[15px] leading-8 text-neutral-800">
                {board.boardContent}
              </p>

              <div className="mt-6 flex items-center justify-end gap-5">
                <SocialStat kind="like" value={likeCount} />
                <SocialStat kind="comment" value={commentCount} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-300 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-[18px] font-medium text-neutral-950">{DETAIL_COPY.commentsTitle}</h2>
              <p className="mt-1 text-sm text-neutral-500">{DETAIL_COPY.commentsDescription}</p>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
              {DETAIL_COPY.total} {commentCount}
            </span>
          </div>
        </div>

        <div className="space-y-0 px-6 py-4 sm:px-8">
          {MOCK_COMMENTS.map((comment) => (
            <CommentRow
              key={comment.id}
              nickname={comment.nickname}
              dateTime={comment.dateTime}
              content={comment.content}
            />
          ))}
          <div className="flex items-center justify-center gap-2 px-2 py-4 text-sm text-neutral-500">
            <span className="text-brand">&lt;</span>
            <span>1, 2, 3</span>
            <span className="text-brand">&gt;</span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-300 bg-white shadow-sm">
        <div className="flex items-center gap-4 px-6 py-4 sm:px-8">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-200" />
          <div className="flex min-w-0 flex-1 items-center rounded-full bg-neutral-100 px-4 py-3">
            <span className="truncate text-sm text-neutral-500">{DETAIL_COPY.placeholder}</span>
          </div>
          <button
            type="button"
            className="h-12 w-12 shrink-0 rounded-full bg-[#bf6e67] transition-opacity hover:opacity-90"
            aria-label={DETAIL_COPY.placeholderAria}
          />
        </div>
      </section>
    </article>
  );
}

function SocialStat({ kind, value }: { kind: 'like' | 'comment'; value: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-base font-medium text-neutral-700">
      {kind === 'like' ? (
        <HeartIcon className="h-7 w-7 text-[#d65d4b]" />
      ) : (
        <CommentIcon className="h-6 w-6 text-neutral-500" />
      )}
      <span>{value}</span>
    </span>
  );
}

function CommentRow({ nickname, dateTime, content }: { nickname: string; dateTime: string; content: string }) {
  return (
    <div className="border-b border-neutral-200 py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f7e5bf] text-sm font-semibold text-neutral-700">
            {nickname.slice(0, 1)}
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">{nickname}</p>
            <p className="mt-0.5 text-xs text-neutral-400">{dateTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-400">
          <button type="button">{DETAIL_COPY.report}</button>
          <button type="button">{DETAIL_COPY.edit}</button>
          <button type="button">{DETAIL_COPY.delete}</button>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-neutral-700">{content}</p>
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

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
