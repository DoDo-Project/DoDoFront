import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { redirectToLogin, refreshAccessToken } from '@/shared/lib/auth/refreshSession';
import { getAccessToken, getRefreshToken, isAccessTokenExpired } from '@/shared/lib/auth/token';
import { Header } from '@/widgets/header';

export function AppLayout() {
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

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
