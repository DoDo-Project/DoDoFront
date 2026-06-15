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

// 실시간 위치 업데이트 WebSocket 메시지 타입
/** 실시간 위치 메시지의 payload (서버가 울타리 판정까지 해서 보냄) */
export interface LiveLocationPayload {
  petId: number;
  latitude: number;
  longitude: number;
  measuredAt: string;
  /** 울타리 안에 있는지 (서버 판정) */
  insideFence: boolean;
  /** 울타리 중심에서의 거리(미터) */
  distanceMeter: number;
  radius: number;
  message: string;
}

/** WebSocket 수신 메시지 (payload가 한 겹 감싸져 있음) */
export interface LiveLocationMessage {
  type: string;
  payload: LiveLocationPayload;
}
