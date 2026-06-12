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
}: CommunityFeedCardProps) {
  const formattedDate = createdAt ? formatRelativeDate(createdAt) : null;

  const content = (
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
            {views !== undefined && <SocialStat kind="view" value={views} />}
          </div>
        </div>

        {formattedDate ? <p className="text-[11px] text-neutral-400">{formattedDate}</p> : null}
      </div>
    </article>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
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
