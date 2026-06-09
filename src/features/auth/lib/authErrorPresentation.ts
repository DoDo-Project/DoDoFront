import { getApiErrorMessage, getApiErrorStatus, isNetworkError, isTimeoutError } from '@/shared/lib/api/errorMessage';

export type AuthErrorContext = 'social-login' | 'signup' | 'session-expired' | 'generic';

export type AuthClientErrorCode = 'invalid_provider' | 'missing_code' | 'invalid_state';

export interface AuthErrorPresentation {
  badge: string;
  title: string;
  message: string;
  hint?: string;
  statusCode: number | null;
}

const HTTP_PRESENTATION: Record<number, Omit<AuthErrorPresentation, 'message' | 'statusCode'>> = {
  400: {
    badge: '요청 확인',
    title: '요청을 다시 확인해주세요',
    hint: '입력값이나 로그인 흐름이 중간에 바뀌었을 수 있어요. 처음부터 다시 시도해주세요.',
  },
  401: {
    badge: '인증 필요',
    title: '로그인이 필요해요',
    hint: '세션이 만료되었거나 인증 정보가 유효하지 않을 수 있어요.',
  },
  403: {
    badge: '접근 제한',
    title: '현재 계정으로는 이용할 수 없어요',
    hint: '권한이 맞지 않거나 추가 확인이 필요한 상태일 수 있어요.',
  },
  404: {
    badge: '계정 확인',
    title: '계정 정보를 찾지 못했어요',
    hint: '다른 소셜 계정으로 가입했는지 확인해보세요.',
  },
  409: {
    badge: '중복 요청',
    title: '이미 처리된 요청일 수 있어요',
    hint: '같은 작업이 먼저 처리되었는지 확인한 뒤 다시 시도해주세요.',
  },
  429: {
    badge: '잠시 후',
    title: '요청이 잠시 많아졌어요',
    hint: '1~2분 뒤 다시 시도하면 더 안정적으로 연결될 가능성이 높아요.',
  },
  500: {
    badge: '서버 점검',
    title: '서버에서 문제가 발생했어요',
    hint: '잠시 뒤 다시 시도해주세요. 문제가 계속되면 운영팀 확인이 필요할 수 있어요.',
  },
};

const CLIENT_ERRORS: Record<AuthClientErrorCode, AuthErrorPresentation> = {
  invalid_provider: {
    badge: '로그인 안내',
    title: '지원하지 않는 로그인 방식이에요',
    message: '현재는 네이버와 구글 로그인만 지원하고 있어요.',
    hint: '이전 화면으로 돌아가서 다시 선택해주세요.',
    statusCode: null,
  },
  missing_code: {
    badge: '인증 중단',
    title: '로그인이 중간에 멈췄어요',
    message: '소셜 인증 코드를 받지 못했어요.',
    hint: '브라우저 뒤로가기를 누르지 말고, 처음부터 다시 시도해주세요.',
    statusCode: null,
  },
  invalid_state: {
    badge: '보안 확인',
    title: '로그인 검증에 실패했어요',
    message: '보안 검증을 완료하지 못해 로그인을 이어갈 수 없어요.',
    hint: '탭을 오래 열어두었거나 인증 흐름이 중간에 바뀌었을 수 있어요.',
    statusCode: null,
  },
};

const SESSION_EXPIRED: AuthErrorPresentation = {
  badge: '다시 인증',
  title: '로그인이 만료되었어요',
  message: '안전한 이용을 위해 한 번 더 로그인해주세요.',
  hint: '오래된 탭을 다시 열었거나, 토큰 유효 시간이 지나 세션이 종료되었을 수 있어요.',
  statusCode: 401,
};

const NETWORK_PRESENTATION: AuthErrorPresentation = {
  badge: '연결 확인',
  title: '네트워크 연결을 확인해주세요',
  message: '서버와 연결하지 못했어요.',
  hint: '인터넷 연결 상태를 확인한 뒤 다시 시도해주세요.',
  statusCode: null,
};

const TIMEOUT_PRESENTATION: AuthErrorPresentation = {
  badge: '응답 지연',
  title: '응답이 조금 늦어지고 있어요',
  message: '요청 시간이 초과되었어요.',
  hint: '네트워크 상태가 안정된 뒤 다시 시도해주세요.',
  statusCode: null,
};

function presentationFromStatus(
  status: number,
  message: string,
  statusMessages?: Partial<Record<number, string>>,
): AuthErrorPresentation {
  const preset = HTTP_PRESENTATION[status];
  if (preset) {
    return {
      ...preset,
      message: message || statusMessages?.[status] || preset.title,
      statusCode: status,
    };
  }

  return {
    badge: `오류 ${status}`,
    title: '문제가 발생했어요',
    message,
    statusCode: status,
  };
}

export function resolveClientAuthError(code: AuthClientErrorCode): AuthErrorPresentation {
  return CLIENT_ERRORS[code];
}

export function resolveSessionExpiredError(): AuthErrorPresentation {
  return SESSION_EXPIRED;
}

export function resolveApiAuthError(
  error: unknown,
  fallback: string,
  statusMessages?: Partial<Record<number, string>>,
): AuthErrorPresentation {
  if (isTimeoutError(error)) {
    return {
      ...TIMEOUT_PRESENTATION,
      message: getApiErrorMessage(error, TIMEOUT_PRESENTATION.message, statusMessages),
    };
  }

  if (isNetworkError(error)) {
    return {
      ...NETWORK_PRESENTATION,
      message: getApiErrorMessage(error, NETWORK_PRESENTATION.message, statusMessages),
    };
  }

  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, fallback, statusMessages);

  if (status !== null) {
    return presentationFromStatus(status, message, statusMessages);
  }

  return {
    badge: '알 수 없음',
    title: '문제가 발생했어요',
    message,
    statusCode: null,
  };
}

export function resolveAuthErrorFromMessage(message: string, statusCode?: number | null): AuthErrorPresentation {
  if (statusCode !== null && statusCode !== undefined) {
    return presentationFromStatus(statusCode, message);
  }

  return {
    badge: '일시 오류',
    title: '문제가 발생했어요',
    message,
    statusCode: null,
  };
}
