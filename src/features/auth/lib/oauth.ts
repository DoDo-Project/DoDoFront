import { env } from '@/shared/config';

import type { SocialProvider } from '../model/types';

const OAUTH_STATE_KEY = 'oauth_state';

interface ProviderOAuthConfig {
  authorizeUrl: string;
  clientId: string;
  /** 요청할 사용자 정보 범위 (구글 등에서 사용) */
  scope?: string;
}

const PROVIDER_OAUTH: Record<SocialProvider, ProviderOAuthConfig> = {
  GOOGLE: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    clientId: env.GOOGLE_CLIENT_ID,
    scope: 'openid email profile',
  },
  NAVER: {
    authorizeUrl: 'https://nid.naver.com/oauth2.0/authorize',
    clientId: env.NAVER_CLIENT_ID,
  },
};

// provider별 redirect_uri. OAuth 콘솔에 등록된 값과 정확히 일치해야 함
function getRedirectUri(provider: SocialProvider): string {
  return `${env.OAUTH_REDIRECT_URI}/${provider.toLowerCase()}`;
}

// CSRF 방지용 랜덤 state를 생성하고 sessionStorage에 저장
function createState(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  return state;
}

// 콜백에서 검증할 수 있도록 저장된 state를 반환
export function getStoredState(): string | null {
  return sessionStorage.getItem(OAUTH_STATE_KEY);
}

// 사용 후 state를 제거
export function clearStoredState(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY);
}

// provider 인증 페이지 URL을 조립
export function buildSocialAuthUrl(provider: SocialProvider): string {
  const config = PROVIDER_OAUTH[provider];

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.clientId,
    redirect_uri: getRedirectUri(provider),
    state: createState(),
  });

  if (config.scope) {
    params.set('scope', config.scope);
  }

  return `${config.authorizeUrl}?${params.toString()}`;
}

// provider 로그인 페이지로 이동
export function redirectToSocialLogin(provider: SocialProvider): void {
  window.location.href = buildSocialAuthUrl(provider);
}
