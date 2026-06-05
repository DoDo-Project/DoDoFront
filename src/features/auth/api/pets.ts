import { apiClient } from '@/shared/api/axios';

import type {
  CreatePetRequest,
  CreatePetResponse,
  CreatePetSpecialNoteRequest,
  CreatePetSpecialNoteResponse,
  DeletePetSpecialNoteResponse,
  PetDetailResponse,
  PetFamilyJoinResponse,
  PetListResponse,
  PetSpecialNoteListResponse,
  UpdatePetRequest,
  UpdatePetResponse,
  UpdatePetSpecialNoteRequest,
  UpdatePetSpecialNoteResponse,
} from '../model/types';

interface RequestFamilyJoinOptions {
  /** 가입 단계에서는 registrationToken을 Authorization 헤더로 전달 */
  authToken?: string;
}

export interface GetPetListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface GetPetSpecialNoteListParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * 반려동물 등록 (POST /pets)
 */
export async function createPet(payload: CreatePetRequest): Promise<CreatePetResponse> {
  const response = await apiClient.post<CreatePetResponse>('/pets', payload);

  return response.data;
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
      sort: params?.sort ?? 'registrationCreatedAt,desc',
    },
  });

  return response.data;
}

/**
 * 반려동물 상세 조회 (GET /pets/{petId})
 */
export async function getPetDetail(petId: number): Promise<PetDetailResponse> {
  const response = await apiClient.get<PetDetailResponse>(`/pets/${petId}`);

  return response.data;
}

/**
 * 반려동물 정보 수정 (PATCH /pets/{petId})
 */
export async function updatePet(petId: number, payload: UpdatePetRequest): Promise<UpdatePetResponse> {
  const response = await apiClient.patch<UpdatePetResponse>(`/pets/${petId}`, payload);

  return response.data;
}

/**
 * 펫 특이사항 목록 조회 (GET /pets/{petId}/significant)
 */
export async function getPetSpecialNoteList(
  petId: number,
  params?: GetPetSpecialNoteListParams,
): Promise<PetSpecialNoteListResponse> {
  const response = await apiClient.get<PetSpecialNoteListResponse>(`/pets/${petId}/significant`, {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sort: params?.sort,
    },
  });

  return response.data;
}

/**
 * 펫 특이사항 생성 (POST /pets/significant)
 */
export async function createPetSpecialNote(
  payload: CreatePetSpecialNoteRequest,
): Promise<CreatePetSpecialNoteResponse> {
  const response = await apiClient.post<CreatePetSpecialNoteResponse>('/pets/significant', payload);

  return response.data;
}

/**
 * 펫 특이사항 수정 (PATCH /pets/significant/{noteId})
 */
export async function updatePetSpecialNote(
  noteId: number,
  payload: UpdatePetSpecialNoteRequest,
): Promise<UpdatePetSpecialNoteResponse> {
  const response = await apiClient.patch<UpdatePetSpecialNoteResponse>(`/pets/significant/${noteId}`, payload);

  return response.data;
}

/**
 * 펫 특이사항 삭제 (DELETE /pets/significant/{noteId})
 */
export async function deletePetSpecialNote(noteId: number): Promise<DeletePetSpecialNoteResponse> {
  const response = await apiClient.delete<DeletePetSpecialNoteResponse>(`/pets/significant/${noteId}`);

  return response.data;
}
