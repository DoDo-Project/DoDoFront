import { createBrowserRouter } from 'react-router-dom';

import { LoginPage } from '@/pages/auth/LoginPage';
import { CommunityPage } from '@/pages/community/CommunityPage';
import { MainPage } from '@/pages/main/MainPage';
import { MyDodoPage } from '@/pages/my/MyDodoPage';
import { WalkPage } from '@/pages/walk/WalkPage';

export const router = createBrowserRouter([
  { path: '/', element: <MainPage /> },
  { path: '/walk', element: <WalkPage /> },
  { path: '/community', element: <CommunityPage /> },
  { path: '/my', element: <MyDodoPage /> },
  { path: '/auth', element: <LoginPage /> },
]);
