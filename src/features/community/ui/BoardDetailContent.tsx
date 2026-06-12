import { Link } from 'react-router-dom';

import type { BoardDetailResponse } from '../model/types';

interface BoardDetailContentProps {
  board: BoardDetailResponse;
  canManage: boolean;
  currentUserProfileUrl?: string | null;
  onDelete: () => void;
}

const DETAIL_COPY = {
  authorFallback: '작성자',
  report: '신고',
  edit: '수정',
  delete: '삭제',
  commentsTitle: '댓글',
  placeholder: '댓글을 입력해주세요',
  submit: '등록',
  submitAria: '댓글 등록 예정 버튼',
  viewLabel: '조회',
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

export function BoardDetailContent({ board, canManage, currentUserProfileUrl, onDelete }: BoardDetailContentProps) {
  const likeCount = Math.max(12, Math.round(board.viewCount * 1.7));
  const commentCount = Math.max(MOCK_COMMENTS.length, Math.round(board.viewCount / 3));
  const authorName = board.nickname.trim() || DETAIL_COPY.authorFallback;
  const imageUrls = board.imageFileUrls.filter((imageUrl) => imageUrl.trim().length > 0);

  return (
    <article className="space-y-6 pb-28">
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-5 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <AuthorBadge name={authorName} size="lg" profileUrl={board.profileUrl} />
              <div className="min-w-0">
                <p className="text-[22px] font-semibold tracking-[-0.03em] text-neutral-950">{authorName}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-neutral-400">
                  <span>{formatDateTime(board.boardCreatedAt)}</span>
                  <MetaDivider />
                  <span className="inline-flex items-center gap-1.5">
                    <EyeIcon className="h-4 w-4" />
                    <span>
                      {DETAIL_COPY.viewLabel} {board.viewCount}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-neutral-400">
              {!canManage ? (
                <button type="button" className="transition-colors hover:text-neutral-700">
                  {DETAIL_COPY.report}
                </button>
              ) : null}
              {canManage ? (
                <>
                  <Link to={`/community/${board.boardId}/edit`} className="transition-colors hover:text-neutral-700">
                    {DETAIL_COPY.edit}
                  </Link>
                  <button type="button" onClick={onDelete} className="transition-colors hover:text-red-500">
                    {DETAIL_COPY.delete}
                  </button>
                </>
              ) : null}
            </div>
          </div>

          <div className="pt-7">
            <h1 className="text-[24px] font-semibold tracking-[-0.04em] text-neutral-950 sm:text-[28px]">
              {board.boardTitle}
            </h1>

            <div className="mt-6 space-y-6">
              {imageUrls.length > 0 ? <BoardImageGallery title={board.boardTitle} imageUrls={imageUrls} /> : null}

              <p className="whitespace-pre-wrap break-words text-[17px] leading-8 text-neutral-700 sm:text-[18px]">
                {board.boardContent}
              </p>

              <div className="flex items-center justify-end gap-5 border-t border-neutral-200 pt-5">
                <SocialStat kind="like" value={likeCount} />
                <SocialStat kind="comment" value={commentCount} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white px-6 py-4 shadow-sm sm:px-8">
        <div className="flex items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <h2 className="text-[18px] font-semibold text-neutral-950">
            {DETAIL_COPY.commentsTitle} {commentCount}
          </h2>
        </div>

        <div>
          {MOCK_COMMENTS.map((comment) => (
            <CommentRow
              key={comment.id}
              nickname={comment.nickname}
              dateTime={comment.dateTime}
              content={comment.content}
            />
          ))}
        </div>
      </section>

      <section className="sticky bottom-4 z-10">
        <div className="rounded-[24px] border border-neutral-200 bg-white/96 shadow-[0_18px_42px_rgba(15,23,42,0.10)] backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
            <AuthorBadge name="나" size="sm" profileUrl={currentUserProfileUrl} />
            <div className="flex min-w-0 flex-1 items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-3">
              <span className="truncate text-sm text-neutral-500">{DETAIL_COPY.placeholder}</span>
            </div>
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              aria-label={DETAIL_COPY.submitAria}
            >
              {DETAIL_COPY.submit}
            </button>
          </div>
        </div>
      </section>
    </article>
  );
}

function BoardImageGallery({ title, imageUrls }: { title: string; imageUrls: string[] }) {
  if (imageUrls.length === 1) {
    return (
      <div className="max-w-[220px] overflow-hidden rounded-[18px] border border-neutral-100 bg-neutral-50">
        <img src={imageUrls[0]} alt={title} className="aspect-square w-full object-cover" />
      </div>
    );
  }

  return (
    <div className="grid max-w-[720px] grid-cols-2 gap-3 sm:grid-cols-3">
      {imageUrls.map((imageUrl, index) => (
        <div
          key={`${imageUrl}-${index}`}
          className="overflow-hidden rounded-[18px] border border-neutral-100 bg-neutral-50"
        >
          <img src={imageUrl} alt={`${title} 이미지 ${index + 1}`} className="aspect-square w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

function AuthorBadge({ name, size, profileUrl }: { name: string; size: 'sm' | 'lg'; profileUrl?: string | null }) {
  const wrapperSizeClass = size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const textSizeClass = size === 'lg' ? 'text-lg' : 'text-sm';
  const normalizedProfileUrl = profileUrl?.trim();

  return (
    <div className={['shrink-0 overflow-hidden rounded-full bg-[#f7e5bf]', wrapperSizeClass].join(' ')}>
      {normalizedProfileUrl ? (
        <img src={normalizedProfileUrl} alt={name} className="block h-full w-full object-cover" />
      ) : (
        <div
          className={[
            'flex h-full w-full items-center justify-center font-semibold text-neutral-700',
            textSizeClass,
          ].join(' ')}
        >
          {name.slice(0, 1)}
        </div>
      )}
    </div>
  );
}

function SocialStat({ kind, value }: { kind: 'like' | 'comment'; value: number }) {
  return (
    <span className="inline-flex items-center gap-2 text-base font-medium text-neutral-700">
      {kind === 'like' ? (
        <ThumbsUpIcon className="h-6 w-6 text-[#ef3c32]" />
      ) : (
        <CommentIcon className="h-5.5 w-5.5 text-[#1ab7c4]" />
      )}
      <span>{value}</span>
    </span>
  );
}

function CommentRow({ nickname, dateTime, content }: { nickname: string; dateTime: string; content: string }) {
  return (
    <div className="border-b border-neutral-200 py-6 first:pt-5 last:border-b-0 last:pb-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <AuthorBadge name={nickname} size="sm" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">{nickname}</p>
            <p className="mt-0.5 text-xs text-neutral-400">{dateTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-neutral-400">
          <button type="button" className="transition-colors hover:text-neutral-700">
            {DETAIL_COPY.report}
          </button>
          <button type="button" className="transition-colors hover:text-neutral-700">
            {DETAIL_COPY.edit}
          </button>
          <button type="button" className="transition-colors hover:text-red-500">
            {DETAIL_COPY.delete}
          </button>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-neutral-700">{content}</p>
    </div>
  );
}

function MetaDivider() {
  return <span className="text-neutral-300">|</span>;
}

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <path
        d="M9.5 10.5 12.5 4a2 2 0 0 1 3.8.8V9h2.2a2 2 0 0 1 2 2.4l-1 5A2 2 0 0 1 17.5 18H9.5m0-7.5V18m0-7.5H6a1.5 1.5 0 0 0-1.5 1.5v4A1.5 1.5 0 0 0 6 17.5h3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <path d="M7.5 19.5H4.5L5.6 16A7.5 7.5 0 1 1 12 19.5H7.5Z" strokeLinecap="round" strokeLinejoin="round" />
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
