import { useMutation } from '@tanstack/react-query';

import { sendWithdrawalEmail } from '@/features/auth/api/users';
import type { WithdrawalEmailResponse } from '@/features/auth/model/types';

/** 탈퇴 인증 메일 발송 (POST /users/me/withdrawal/email) */
export function useSendWithdrawalEmail() {
  return useMutation<WithdrawalEmailResponse, unknown, void>({
    mutationFn: () => sendWithdrawalEmail(),
  });
}
