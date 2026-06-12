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

function trimOrNull(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = getAccessToken();
  const hasToken = Boolean(accessToken);

  useEffect(() => {
    return subscribeAuthState(() => {
      setUser((current) => {
        if (!current) return current;

        return {
          ...current,
          nickname: trimOrNull(getNickname()) ?? current.nickname,
          profileUrl: trimOrNull(getProfileUrl()) ?? current.profileUrl,
          region: trimOrNull(getRegion()) ?? current.region,
          notificationEnabled: getNotificationEnabled() ?? current.notificationEnabled,
        };
      });
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
        console.error('[users/me] failed', error);
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
  const profileUrl = trimOrNull(getProfileUrl()) ?? trimOrNull(activeUser?.profileUrl) ?? null;
  const nickname = trimOrNull(getNickname()) ?? trimOrNull(activeUser?.nickname) ?? null;
  const region = trimOrNull(getRegion()) ?? trimOrNull(activeUser?.region) ?? null;
  const notificationEnabled = getNotificationEnabled() ?? activeUser?.notificationEnabled ?? null;
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
