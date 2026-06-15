import { Link, NavLink } from 'react-router-dom';

import profileDefaultIllustration from '@/features/auth/assets/profile-default.svg';
import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';
import { useIsLoggedIn } from '@/widgets/header';

interface IconProps {
  className?: string;
}

function PawIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="5.5" cy="9" r="1.6" />
      <circle cx="9.5" cy="6" r="1.6" />
      <circle cx="14.5" cy="6" r="1.6" />
      <circle cx="18.5" cy="9" r="1.6" />
      <path d="M12 11c-2.5 0-4.5 2-5.2 4.2-.5 1.6.8 3 2.4 2.6 1-.2 1.8-.5 2.8-.5s1.8.3 2.8.5c1.6.4 2.9-1 2.4-2.6C16.5 13 14.5 11 12 11Z" />
    </svg>
  );
}

function ChatIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: '/walk', label: '산책', Icon: PawIcon },
  { to: '/community', label: '커뮤니티', Icon: ChatIcon },
  { to: '/my', label: '마이도도', Icon: UserIcon },
];

const itemClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex w-full flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-medium transition-colors',
    isActive ? 'bg-brand/10 text-brand' : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800',
  ].join(' ');

function RailProfile() {
  const { profileUrl } = useCurrentUser();
  const resolvedUrl = profileUrl?.trim() || profileDefaultIllustration;

  return (
    <Link
      to="/my"
      aria-label="마이도도"
      className="overflow-hidden rounded-full border border-neutral-200 transition-opacity hover:opacity-90"
    >
      <img src={resolvedUrl} alt="" className="h-9 w-9 object-cover" draggable={false} />
    </Link>
  );
}

export function WalkSideRail() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <nav className="flex h-full w-20 shrink-0 flex-col items-center gap-2 rounded-2xl bg-white px-2 py-4 shadow-md">
      <Link to="/" aria-label="DoDo 홈" className="mb-2 flex items-center justify-center">
        <DoDoLogo className="h-6 w-auto max-w-full" />
      </Link>

      <div className="flex w-full flex-1 flex-col items-center gap-1.5">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink key={to} to={to} end={to === '/walk'} className={itemClass}>
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      {isLoggedIn ? (
        <RailProfile />
      ) : (
        <Link to="/auth" className="text-[11px] font-medium text-neutral-500 hover:text-brand">
          로그인
        </Link>
      )}
    </nav>
  );
}
