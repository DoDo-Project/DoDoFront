import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';

interface ProfileAvatarImageProps {
  profileUrl: string | null;
  sizeClass?: string;
}

function ProfileAvatarImage({ profileUrl, sizeClass = 'h-9 w-9' }: ProfileAvatarImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const resolvedUrl = profileUrl?.trim() || null;
  const showUploadedImage = Boolean(resolvedUrl) && failedUrl !== resolvedUrl;

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 ${sizeClass}`}
    >
      {showUploadedImage ? (
        <img
          src={resolvedUrl!}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailedUrl(resolvedUrl)}
        />
      ) : (
        <img src={profileDefaultIllustration} alt="" className="h-full w-full object-cover" draggable={false} />
      )}
    </span>
  );
}

export function ProfileMenu() {
  const { profileUrl, displayName, region } = useCurrentUser();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="프로필 메뉴"
        className="cursor-pointer rounded-full transition-opacity hover:opacity-90"
      >
        <ProfileAvatarImage profileUrl={profileUrl} />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
        >
          <div className="flex items-center gap-3 px-4 py-4">
            <ProfileAvatarImage profileUrl={profileUrl} sizeClass="h-10 w-10" />
            <div className="min-w-0 text-left">
              <p className="truncate text-sm font-semibold text-neutral-900">{displayName}</p>
              {region ? <p className="mt-0.5 truncate text-xs text-neutral-500">{region}</p> : null}
            </div>
          </div>

          <div className="border-t border-neutral-100">
            <Link
              to="/my/notifications"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex cursor-pointer items-center gap-2 px-4 py-3 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <span aria-hidden>🔔</span>
              알림함
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
