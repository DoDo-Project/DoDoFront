import { Link } from 'react-router-dom';

interface CommunityFeedCardProps {
  title: string;
  imageUrl?: string | null;
  likes: number;
  comments: number;
  to?: string;
  badge?: string;
  muted?: boolean;
}

export function CommunityFeedCard({
  title,
  imageUrl,
  likes,
  comments,
  to,
  badge,
  muted = false,
}: CommunityFeedCardProps) {
  const content = (
    <article className="overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className={[
              'h-full w-full object-cover transition-transform duration-300',
              muted ? '' : 'group-hover:scale-[1.03]',
            ].join(' ')}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-200 via-neutral-100 to-neutral-200" />
        )}

        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-brand shadow-sm">
            {badge}
          </span>
        ) : null}
      </div>

      <div className="space-y-3 px-3 py-3">
        <p className="line-clamp-1 text-sm font-medium text-neutral-800">{title}</p>
        <div className="flex items-center justify-end gap-4 text-sm text-neutral-600">
          <SocialStat kind="like" value={likes} />
          <SocialStat kind="comment" value={comments} />
        </div>
      </div>
    </article>
  );

  const className = [
    'group block',
    muted ? 'cursor-default' : 'transition-transform duration-200 hover:-translate-y-0.5',
  ].join(' ');

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

function SocialStat({ kind, value }: { kind: 'like' | 'comment'; value: number }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {kind === 'like' ? (
        <HeartIcon className="h-4 w-4 text-[#d65d4b]" />
      ) : (
        <CommentIcon className="h-4 w-4 text-neutral-500" />
      )}
      <span>{value}</span>
    </span>
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
