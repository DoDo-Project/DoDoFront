import { isAxiosError } from 'axios';

export interface ApiErrorBody {
  status?: number;
  message?: string;
}

/** axios 응답 body에서 서버 message 추출 */
export function getErrorBodyMessage(data: unknown): string | null {
  if (typeof data !== 'object' || data === null || !('message' in data)) {
    return null;
  }

  const message = (data as ApiErrorBody).message;
  return typeof message === 'string' && message.trim() ? message.trim() : null;
}

/**
 * API 실패 시 사용자용 메시지.
 * - 서버 message가 있으면 우선 사용
 * - statusMessages[status]로 기본 문구 보강
 */
export function getApiErrorMessage(
  error: unknown,
  fallback: string,
  statusMessages?: Partial<Record<number, string>>,
): string {
  if (!isAxiosError(error)) {
    return fallback;
  }

  const serverMessage = getErrorBodyMessage(error.response?.data);
  if (serverMessage) {
    return serverMessage;
  }

  const status = error.response?.status;
  if (status !== undefined && statusMessages?.[status]) {
    return statusMessages[status]!;
  }

  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return '요청 시간이 초과됐어요. 잠시 후 다시 시도해주세요.';
  }

  if (!error.response) {
    return '네트워크 연결을 확인한 뒤 다시 시도해주세요.';
  }

  return fallback;
}

/** axios 오류의 HTTP status. 없으면 null (네트워크 오류 등) */
export function getApiErrorStatus(error: unknown): number | null {
  if (!isAxiosError(error)) return null;
  const status = error.response?.status;
  return typeof status === 'number' ? status : null;
}

export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !error.response;
}

export function isTimeoutError(error: unknown): boolean {
  return isAxiosError(error) && (error.code === 'ECONNABORTED' || error.message.includes('timeout'));
}
