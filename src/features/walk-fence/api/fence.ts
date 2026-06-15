import { apiClient } from '@/shared/api/axios';

import type {
  CreateFenceRequest,
  FenceBoundariesResponse,
  FenceBoundaryResponse,
  FenceMessageResponse,
  FenceStatusResponse,
  ToggleFenceRequest,
  UpdateFenceRangeRequest,
} from '../model/types';

/** 1. 울타리 생성 */
export async function createFence(payload: CreateFenceRequest): Promise<FenceMessageResponse> {
  const response = await apiClient.post<FenceMessageResponse>('/fence/range', payload);
  return response.data;
}

/** 2. 특정 반려동물의 울타리 활성화 상태 조회 */
export async function getFenceStatus(petId: number): Promise<FenceStatusResponse> {
  const response = await apiClient.get<FenceStatusResponse>(`/fence/${petId}/status`);
  return response.data;
}

/** 3. 울타리 ON/OFF 변경 */
export async function toggleFence(fenceId: number, payload: ToggleFenceRequest): Promise<FenceMessageResponse> {
  const response = await apiClient.patch<FenceMessageResponse>(`/fence/${fenceId}/toggle`, payload);
  return response.data;
}

/** 4. 울타리 이름/중심/반경 수정 */
export async function updateFenceRange(
  fenceId: number,
  payload: UpdateFenceRangeRequest,
): Promise<FenceMessageResponse> {
  const response = await apiClient.patch<FenceMessageResponse>(`/fence/${fenceId}/range`, payload);
  return response.data;
}

/** 5. 지도에 표시할 단일 울타리 경계 조회 */
export async function getFenceBoundary(fenceId: number): Promise<FenceBoundaryResponse> {
  const response = await apiClient.get<FenceBoundaryResponse>(`/fence/${fenceId}/boundary`);
  return response.data;
}

/** 6. 접근 가능한 모든 울타리 경계 목록 조회 */
export async function getFenceBoundaries(): Promise<FenceBoundariesResponse> {
  const response = await apiClient.get<FenceBoundariesResponse>('/fence/boundaries');
  return response.data;
}
