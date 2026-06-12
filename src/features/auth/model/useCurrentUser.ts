import { useEffect, useState } from 'react';

import {
  getAccessToken,
  getNickname,
  getNotificationEnabled,
  getProfileUrl,
  getRegion,
  subscribeAuthState,
  syncUserProfile,
} from '@/shared/lib/auth/token';

import { getMyProfile } from '../api/users';
import type { UserProfile } from '../model/types';

interface UseCurrentUserResult {
  user: UserProfile | null;
  isLoading: boolean;
  profileUrl: string | null;
  nickname: string | null;
  region: string | null;
  notificationEnabled: boolean | null;
  displayName: string;
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setAuthStateVersion] = useState(0);
  const accessToken = getAccessToken();
  const hasToken = Boolean(accessToken);

  useEffect(() => {
    return subscribeAuthState(() => {
      setAuthStateVersion((prev) => prev + 1);
    });
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setIsLoading(true);

      try {
        const profile = await getMyProfile();
        if (cancelled) return;
        syncUserProfile(profile);
        setUser(profile);
      } catch (error) {
        console.error('[users/me] 조회 실패', error);
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  const activeUser = hasToken ? user : null;
  const profileUrl = activeUser?.profileUrl?.trim() || getProfileUrl();
  const nickname = activeUser?.nickname?.trim() || getNickname();
  const region = activeUser?.region?.trim() || getRegion();
  const notificationEnabled = activeUser?.notificationEnabled ?? getNotificationEnabled();
  const displayName = nickname ? `${nickname}님` : '회원님';

  return {
    user: activeUser,
    isLoading: hasToken ? isLoading : false,
    profileUrl: hasToken ? profileUrl : null,
    nickname: hasToken ? nickname : null,
    region: hasToken ? region : null,
    notificationEnabled: hasToken ? notificationEnabled : null,
    displayName: hasToken ? displayName : '회원님',
  };
}
