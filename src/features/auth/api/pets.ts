import { apiClient } from '@/shared/api/axios';

import type {
  CreatePetInvitationCodeResponse,
  CreatePetRequest,
  CreatePetResponse,
  CreatePetSpecialNoteRequest,
  CreatePetSpecialNoteResponse,
  CreatePetWeightRequest,
  CreatePetWeightResponse,
  DeletePetWeightResponse,
  DeletePetSpecialNoteResponse,
  FamilyApplicationsResponse,
  FamilyPendingUsersResponse,
  LeavePetFamilyResponse,
  PetFamilyApprovalRequest,
  PetFamilyApprovalResponse,
  PetDetailResponse,
  PetFamilyJoinResponse,
  PetListResponse,
  PetSpecialNoteListResponse,
  PetWeightHistoryResponse,
  UpdatePetRequest,
  UpdatePetResponse,
  UpdatePetSpecialNoteRequest,
  UpdatePetSpecialNoteResponse,
  UpdatePetWeightRequest,
  UpdatePetWeightResponse,
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

export interface GetPetWeightHistoryParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface GetFamilyPendingUsersParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface GetFamilyApplicationsParams {
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
 * 가족 초대 코드 생성 (POST /pets/{petId}/invitation-code)
 */
export async function createPetInvitationCode(petId: number): Promise<CreatePetInvitationCodeResponse> {
  const response = await apiClient.post<CreatePetInvitationCodeResponse>(`/pets/${petId}/invitation-code`);

  return response.data;
}

/**
 * 가족 신청 대기자 조회 (GET /pets/family/pending-users)
 */
export async function getFamilyPendingUsers(params?: GetFamilyPendingUsersParams): Promise<FamilyPendingUsersResponse> {
  const response = await apiClient.get<FamilyPendingUsersResponse>('/pets/family/pending-users', {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sort: params?.sort,
    },
  });

  return response.data;
}

/**
 * 내 가족 신청 내역 조회 (GET /pets/family/applications)
 */
export async function getFamilyApplications(params?: GetFamilyApplicationsParams): Promise<FamilyApplicationsResponse> {
  const response = await apiClient.get<FamilyApplicationsResponse>('/pets/family/applications', {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sort: params?.sort,
    },
  });

  return response.data;
}

/**
 * 가족 신청 승인/거절 (POST /pets/family/approval)
 */
export async function approvePetFamilyRequest(payload: PetFamilyApprovalRequest): Promise<PetFamilyApprovalResponse> {
  const response = await apiClient.post<PetFamilyApprovalResponse>('/pets/family/approval', payload);

  return response.data;
}

/**
 * 펫 가족 나가기 (DELETE /pets/{petId})
 */
export async function leavePetFamily(petId: number): Promise<LeavePetFamilyResponse> {
  const response = await apiClient.delete<LeavePetFamilyResponse>(`/pets/${petId}`);

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

/**
 * 반려동물 몸무게 기록 조회 (GET /pet/{petId}/weight/history)
 */
export async function getPetWeightHistory(
  petId: number,
  params?: GetPetWeightHistoryParams,
): Promise<PetWeightHistoryResponse> {
  const response = await apiClient.get<PetWeightHistoryResponse>(`/pet/${petId}/weight/history`, {
    params: {
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      sort: params?.sort ?? 'petWeightsMeasuredAt,desc',
    },
  });

  return response.data;
}

/**
 * 반려동물 몸무게 기록 추가 (POST /pet/{petId}/weight)
 */
export async function createPetWeight(
  petId: number,
  payload: CreatePetWeightRequest,
): Promise<CreatePetWeightResponse> {
  const response = await apiClient.post<CreatePetWeightResponse>(`/pet/${petId}/weight`, payload);

  return response.data;
}

/**
 * 반려동물 몸무게 기록 수정 (PATCH /pet/{petId}/weight/{weightId})
 */
export async function updatePetWeight(
  petId: number,
  weightId: number,
  payload: UpdatePetWeightRequest,
): Promise<UpdatePetWeightResponse> {
  const response = await apiClient.patch<UpdatePetWeightResponse>(`/pet/${petId}/weight/${weightId}`, payload);

  return response.data;
}

/**
 * 반려동물 몸무게 기록 삭제 (DELETE /pet/{petId}/weight/{weightId})
 */
export async function deletePetWeight(petId: number, weightId: number): Promise<DeletePetWeightResponse> {
  const response = await apiClient.delete<DeletePetWeightResponse>(`/pet/${petId}/weight/${weightId}`);

  return response.data;
}
