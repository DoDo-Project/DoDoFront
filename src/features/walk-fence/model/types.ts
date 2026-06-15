// 울타리(지오펜스) REST API 요청/응답 타입

/** 좌표 (위도/경도) */
export interface FenceCenter {
  latitude: number;
  longitude: number;
}

/** 공통 메시지 응답 */
export interface FenceMessageResponse {
  message: string;
}

/** 1. 울타리 생성 — POST /fence/range */
export interface CreateFenceRequest {
  petId: number;
  centerLatitude: number;
  centerLongitude: number;
  /** 반경(미터) */
  radius: number;
  fenceName: string;
}

/** 2. 울타리 상태 조회 — GET /fence/{petId}/status */
export interface FenceStatusResponse {
  message: string;
  isActive: boolean;
}

/** 3. 울타리 ON/OFF — PATCH /fence/{fenceId}/toggle */
export interface ToggleFenceRequest {
  fenceIsActive: boolean;
}

/** 4. 울타리 범위 수정 — PATCH /fence/{fenceId}/range (모든 필드 선택) */
export interface UpdateFenceRangeRequest {
  centerLatitude?: number;
  centerLongitude?: number;
  fenceName?: string;
  radius?: number;
}

/** 5. 울타리 경계 조회 — GET /fence/{fenceId}/boundary */
export interface FenceBoundaryResponse {
  message: string;
  center: FenceCenter;
  radius: number;
  fenceId: number;
}

/** 6-1. 울타리 경계 목록의 단일 항목 */
export interface FenceBoundary {
  fenceId: number;
  fenceName: string;
  center: FenceCenter;
  radius: number;
  isActive: boolean;
  petId: number;
  petName: string;
  petImageUrl: string;
}

/** 6. 울타리 경계 목록 조회 — GET /fence/boundaries */
export interface FenceBoundariesResponse {
  message: string;
  boundaries: FenceBoundary[];
}
