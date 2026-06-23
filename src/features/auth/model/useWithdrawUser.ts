import { useMutation } from '@tanstack/react-query';

import { withdrawUser } from '@/features/auth/api/users';
import type { WithdrawUserResponse } from '@/features/auth/model/types';

/** 최종 회원 탈퇴 (DELETE /users/me) — 메일로 받은 6자리 인증번호로 계정 삭제 */
export function useWithdrawUser() {
  return useMutation<WithdrawUserResponse, unknown, string>({
    mutationFn: (authCode) => withdrawUser(authCode),
  });
}
