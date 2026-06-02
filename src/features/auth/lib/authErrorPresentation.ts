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
    badge: '400',
    title: '요청을 처리할 수 없어요',
    hint: '입력·로그인 과정을 처음부터 다시 시도해주세요.',
  },
  401: {
    badge: '401',
    title: '로그인에 실패했어요',
    hint: '소셜 계정으로 다시 로그인해주세요.',
  },
  403: {
    badge: '403',
    title: '이용이 제한된 계정이에요',
    hint: '정지·휴면 계정은 고객센터로 문의해주세요.',
  },
  404: {
    badge: '404',
    title: '계정을 찾을 수 없어요',
    hint: '다른 소셜 계정으로 가입했을 수 있어요.',
  },
  409: {
    badge: '409',
    title: '요청을 완료할 수 없어요',
    hint: '이미 처리된 요청일 수 있어요.',
  },
  429: {
    badge: '429',
    title: '잠시만 기다려주세요',
    hint: '요청이 너무 많아요. 1~2분 뒤 다시 시도해주세요.',
  },
  500: {
    badge: '500',
    title: '서버에 문제가 있어요',
    hint: '잠시 후 다시 시도해주세요.',
  },
};

const CLIENT_ERRORS: Record<AuthClientErrorCode, AuthErrorPresentation> = {
  invalid_provider: {
    badge: '안내',
    title: '지원하지 않는 로그인이에요',
    message: '네이버 또는 구글 로그인만 이용할 수 있어요.',
    hint: '홈에서 다시 시작해주세요.',
    statusCode: null,
  },
  missing_code: {
    badge: '안내',
    title: '로그인이 중단됐어요',
    message: '인가 코드를 받지 못했어요.',
    hint: '소셜 로그인을 처음부터 다시 시도해주세요.',
    statusCode: null,
  },
  invalid_state: {
    badge: '안내',
    title: '잘못된 접근이에요',
    message: '보안 검증에 실패했어요.',
    hint: '브라우저 뒤로가기 없이 홈에서 다시 로그인해주세요.',
    statusCode: null,
  },
};

const SESSION_EXPIRED: AuthErrorPresentation = {
  badge: '세션',
  title: '로그인이 만료됐어요',
  message: '안전을 위해 다시 로그인해주세요.',
  hint: '오래된 탭이거나 토큰이 만료됐을 수 있어요.',
  statusCode: 401,
};

const NETWORK_PRESENTATION: AuthErrorPresentation = {
  badge: '연결',
  title: '네트워크를 확인해주세요',
  message: '서버와 연결하지 못했어요.',
  hint: '인터넷 연결 후 다시 시도해주세요.',
  statusCode: null,
};

const TIMEOUT_PRESENTATION: AuthErrorPresentation = {
  badge: '시간',
  title: '응답이 지연되고 있어요',
  message: '요청 시간이 초과됐어요.',
  hint: '잠시 후 다시 시도해주세요.',
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
    badge: String(status),
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
    badge: '오류',
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
    badge: '오류',
    title: '문제가 발생했어요',
    message,
    statusCode: null,
  };
}
