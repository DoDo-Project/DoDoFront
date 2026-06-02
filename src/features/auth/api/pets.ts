import { apiClient } from '@/shared/api/axios';

import type { PetFamilyJoinResponse } from '../model/types';

interface RequestFamilyJoinOptions {
  /** 가입 단계에서는 registrationToken을 Authorization 헤더로 전달 */
  authToken?: string;
}

/**
 * 가족 초대 수락 신청 (POST /pets/family)
 * - 초대 코드로 반려동물 가족 등록을 신청한다. 승인 대기 상태.
 */
export async function requestFamilyJoin(
  code: string,
  options?: RequestFamilyJoinOptions,
): Promise<PetFamilyJoinResponse> {
  const response = await apiClient.post<PetFamilyJoinResponse>(
    '/pets/family',
    { code },
    {
      headers: options?.authToken
        ? {
            Authorization: `Bearer ${options.authToken}`,
          }
        : undefined,
    },
  );

  return response.data;
}
