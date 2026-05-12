import { Link, NavLink } from 'react-router-dom';

import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';

import { useIsLoggedIn } from '../model/useIsLoggedIn';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  ['text-sm transition-colors', isActive ? 'font-semibold text-brand' : 'text-neutral-700 hover:text-brand'].join(' ');

function GuestNav() {
  return (
    <nav className="flex items-center gap-8" aria-label="비로그인 메뉴">
      <NavLink to="/" end className={linkClass}>
        서비스 소개
      </NavLink>
      <NavLink to="/auth" className={linkClass}>
        시작하기
      </NavLink>
    </nav>
  );
}

function AuthenticatedNav() {
  return (
    <nav className="flex items-center gap-8" aria-label="메인 메뉴">
      <NavLink to="/walk" className={linkClass}>
        산책
      </NavLink>
      <NavLink to="/community" className={linkClass}>
        커뮤니티
      </NavLink>
      <NavLink to="/my" className={linkClass}>
        마이도도
      </NavLink>
      <Link
        to="/my"
        className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-100"
        aria-label="프로필"
      >
        <span className="block h-7 w-7 rounded-full bg-neutral-200" aria-hidden />
      </Link>
    </nav>
  );
}

export function Header() {
  const isLoggedIn = useIsLoggedIn();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link to="/" className="flex shrink-0 items-center py-1" aria-label="DoDo 홈">
          <DoDoLogo className="h-8 w-auto" />
        </Link>
        <div className="ml-auto flex items-center">{isLoggedIn ? <AuthenticatedNav /> : <GuestNav />}</div>
      </div>
    </header>
  );
}
