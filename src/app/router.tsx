import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/app/layouts/AppLayout';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { RequireAuth } from '@/app/guards/RequireAuth';
import { AuthCallbackPage } from '@/pages/auth/AuthCallbackPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { SignupPage } from '@/pages/auth/SignupPage';
import { FamilyJoinPage } from '@/pages/family/FamilyJoinPage';
import { CommunityPage } from '@/pages/community/CommunityPage';
import { MainPage } from '@/pages/main/MainPage';
import { MyDodoPage } from '@/pages/my/MyDodoPage';
import { NotificationSettingsPage } from '@/pages/my/NotificationSettingsPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { WalkPage } from '@/pages/walk/WalkPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/walk', element: <WalkPage /> },
      { path: '/community', element: <CommunityPage /> },
      {
        path: '/my',
        element: (
          <RequireAuth>
            <MyDodoPage />
          </RequireAuth>
        ),
      },
      {
        path: '/my/notifications',
        element: (
          <RequireAuth>
            <NotificationSettingsPage />
          </RequireAuth>
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'callback/:provider', element: <AuthCallbackPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        path: 'family/join',
        element: (
          <RequireAuth>
            <FamilyJoinPage />
          </RequireAuth>
        ),
      },
    ],
  },
]);
