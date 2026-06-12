import { Link } from 'react-router-dom';

interface CommunityFeedCardProps {
  title: string;
  preview?: string | null;
  imageUrl?: string | null;
  nickname?: string | null;
  likes: number;
  comments: number;
  views?: number;
  createdAt?: string | null;
  to?: string;
  badge?: string;
  variant?: 'card' | 'list';
}

export function CommunityFeedCard({
  title,
  preview,
  imageUrl,
  nickname,
  likes,
  comments,
  views,
  createdAt,
  to,
  badge,
  variant = 'card',
}: CommunityFeedCardProps) {
  const formattedDate = createdAt ? formatRelativeDate(createdAt) : null;

  const content =
    variant === 'list' ? (
      <ListFeedItem
        title={title}
        preview={preview}
        imageUrl={imageUrl}
        nickname={nickname}
        likes={likes}
        comments={comments}
        views={views}
        formattedDate={formattedDate}
        badge={badge}
      />
    ) : (
      <CardFeedItem
        title={title}
        preview={preview}
        imageUrl={imageUrl}
        nickname={nickname}
        likes={likes}
        comments={comments}
        views={views}
        formattedDate={formattedDate}
        badge={badge}
      />
    );

  if (to) {
    return (
      <Link to={to} className="block h-full cursor-pointer">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}

function CardFeedItem({
  title,
  preview,
  imageUrl,
  nickname,
  likes,
  comments,
  views,
  formattedDate,
  badge,
}: {
  title: string;
  preview?: string | null;
  imageUrl?: string | null;
  nickname?: string | null;
  likes: number;
  comments: number;
  views?: number;
  formattedDate: string | null;
  badge?: string;
}) {
  return (
    <article className="group/card flex h-full flex-col overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-4/3 shrink-0 overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand/[0.06] via-neutral-100 to-neutral-200">
            <ImagePlaceholderIcon className="h-10 w-10 text-neutral-300" />
          </div>
        )}

        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-brand shadow-sm">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 px-3.5 py-3.5">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-neutral-900">{title}</p>
        {preview ? <p className="line-clamp-2 text-xs leading-relaxed text-neutral-500">{preview}</p> : null}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          {nickname ? <span className="truncate text-xs text-neutral-400">{nickname}</span> : <span />}
          <div className="flex shrink-0 items-center gap-3 text-xs text-neutral-500">
            <SocialStat kind="like" value={likes} />
            <SocialStat kind="comment" value={comments} />
            {views !== undefined ? <SocialStat kind="view" value={views} /> : null}
          </div>
        </div>

        {formattedDate ? <p className="text-[11px] text-neutral-400">{formattedDate}</p> : null}
      </div>
    </article>
  );
}

function ListFeedItem({
  title,
  preview,
  imageUrl,
  nickname,
  likes,
  comments,
  views,
  formattedDate,
  badge,
}: {
  title: string;
  preview?: string | null;
  imageUrl?: string | null;
  nickname?: string | null;
  likes: number;
  comments: number;
  views?: number;
  formattedDate: string | null;
  badge?: string;
}) {
  return (
    <article className="py-6 first:pt-0 last:pb-0">
      <div className="flex items-start gap-5 sm:gap-6">
        <div className="min-w-0 flex-1">
          {badge ? (
            <span className="inline-flex rounded-full bg-brand/8 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-brand">
              {badge}
            </span>
          ) : null}

          <p className="mt-2 line-clamp-1 text-[16px] font-semibold tracking-[-0.03em] text-neutral-900 sm:text-[18px]">
            {title}
          </p>

          {preview ? (
            <p className="mt-1.5 line-clamp-2 text-[15px] leading-[1.65] text-neutral-600 sm:text-[16px]">{preview}</p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px] text-neutral-400 sm:text-[15px]">
            <span className="inline-flex items-center gap-1.5 text-[#ef3c32]">
              <ThumbsUpIcon className="h-5 w-5" />
              <span className="font-medium">{likes}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#1ab7c4]">
              <CommentOutlineIcon className="h-5 w-5" />
              <span className="font-medium">{comments}</span>
            </span>
            {formattedDate ? <MetaDivider /> : null}
            {formattedDate ? <span>{formattedDate}</span> : null}
            {nickname ? <MetaDivider /> : null}
            {nickname ? <span>{nickname}</span> : null}
            {views !== undefined ? <MetaDivider /> : null}
            {views !== undefined ? <span>조회 {views}</span> : null}
          </div>
        </div>

        {imageUrl ? (
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-[10px] bg-neutral-100 sm:h-[72px] sm:w-[72px]">
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 border-b border-neutral-300/90 last:hidden" />
    </article>
  );
}

function MetaDivider() {
  return <span className="text-neutral-300">|</span>;
}

function SocialStat({ kind, value }: { kind: 'like' | 'comment' | 'view'; value: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {kind === 'like' ? (
        <HeartIcon className="h-3.5 w-3.5 text-[#d65d4b]" />
      ) : kind === 'comment' ? (
        <CommentIcon className="h-3.5 w-3.5 text-neutral-400" />
      ) : (
        <EyeIcon className="h-3.5 w-3.5 text-neutral-400" />
      )}
      <span>{value}</span>
    </span>
  );
}

function formatRelativeDate(iso: string): string {
  const now = Date.now();
  const date = new Date(iso).getTime();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return new Date(iso).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function ImagePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden className={className}>
      <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m7 16 3.25-3.25a1 1 0 0 1 1.414 0L14 15l1.75-1.75a1 1 0 0 1 1.414 0L19 15" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 21s-6.716-4.304-9.428-7.851C-.315 9.382.496 4.5 4.96 3.297A5.53 5.53 0 0 1 12 6.045a5.53 5.53 0 0 1 7.04-2.748c4.464 1.203 5.276 6.085 2.387 9.852C18.716 16.696 12 21 12 21Z" />
    </svg>
  );
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
      <path
        d="M8 19.5 4.5 21l1.125-3.375A7.5 7.5 0 1 1 19.5 12 7.5 7.5 0 0 1 12 19.5H8Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentOutlineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <path d="M7.5 19.5H4.5L5.6 16A7.5 7.5 0 1 1 12 19.5H7.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden className={className}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
