import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { redirectToLogin, refreshAccessToken } from '@/shared/lib/auth/refreshSession';
import { getAccessToken, getRefreshToken, isAccessTokenExpired } from '@/shared/lib/auth/token';
import { Header } from '@/widgets/header';

export function AppLayout() {
  const location = useLocation();
  // 산책 페이지는 헤더 없는 전체화면(지도) 레이아웃
  const isFullBleed = location.pathname.startsWith('/walk');

  useEffect(() => {
    if (!getAccessToken() || !getRefreshToken() || !isAccessTokenExpired()) {
      return;
    }

    const refreshSession = async () => {
      const refreshedToken = await refreshAccessToken();
      if (!refreshedToken) {
        redirectToLogin();
      }
    };

    void refreshSession();
  }, []);

  if (isFullBleed) {
    return (
      <div className="flex min-h-screen flex-col bg-neutral-50">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
