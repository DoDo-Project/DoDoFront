import { useMutation } from '@tanstack/react-query';

import { logout } from '@/features/auth/api/auth';
import type { LogoutResponse } from '@/features/auth/model/types';
import { getRefreshToken } from '@/shared/lib/auth/token';

/**
 * 로그아웃 (POST /auth/logout)
 * - refreshToken이 없으면 서버 호출 없이 로컬 세션만 정리하도록 null 반환
 * - 토큰/캐시 정리·이동은 호출 측에서 처리
 */
export function useLogout() {
  return useMutation<LogoutResponse | null, unknown, void>({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) return null;

      return logout(refreshToken);
    },
  });
}
