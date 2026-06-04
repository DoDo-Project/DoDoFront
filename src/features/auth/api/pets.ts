import { apiClient } from '@/shared/api/axios';

import type { PetFamilyJoinResponse, PetListResponse } from '../model/types';

interface RequestFamilyJoinOptions {
  /** 가입 단계에서는 registrationToken을 Authorization 헤더로 전달 */
  authToken?: string;
}

export interface GetPetListParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * 가족 초대 수락 요청 (POST /pets/family)
 * - 초대 코드로 반려동물 가족 등록을 요청한다. 승인 대기 상태.
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

/**
 * 반려동물 목록 조회 (GET /pets/list)
 * - 로그인한 사용자의 반려동물 목록을 페이지 단위로 조회한다.
 */
export async function getPetList(params?: GetPetListParams): Promise<PetListResponse> {
  const response = await apiClient.get<PetListResponse>('/pets/list', {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      ...(params?.sort ? { sort: params.sort } : {}),
    },
  });

  return response.data;
}
