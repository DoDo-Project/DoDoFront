import { env } from '@/shared/config';

import type { SocialProvider } from '../model/types';

const OAUTH_STATE_KEY = 'oauth_state';
const OAUTH_RETURN_TO_KEY = 'oauth_return_to';

interface ProviderOAuthConfig {
  authorizeUrl: string;
  clientId: string;
  scope?: string;
}

interface RedirectToSocialLoginOptions {
  returnTo?: string | null;
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

function getRedirectUri(provider: SocialProvider): string {
  return `${env.OAUTH_REDIRECT_URI}/${provider.toLowerCase()}`;
}

function isSafeReturnPath(value: string | null | undefined): value is string {
  return Boolean(value && value.startsWith('/') && !value.startsWith('//'));
}

export function parseProvider(value: string | undefined): SocialProvider | null {
  const upper = value?.toUpperCase();
  return upper === 'GOOGLE' || upper === 'NAVER' ? upper : null;
}

function createState(): string {
  const state = crypto.randomUUID();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);
  return state;
}

export function getStoredState(): string | null {
  return sessionStorage.getItem(OAUTH_STATE_KEY);
}

export function clearStoredState(): void {
  sessionStorage.removeItem(OAUTH_STATE_KEY);
}

export function setStoredReturnTo(path: string | null | undefined): void {
  if (!isSafeReturnPath(path)) {
    sessionStorage.removeItem(OAUTH_RETURN_TO_KEY);
    return;
  }

  sessionStorage.setItem(OAUTH_RETURN_TO_KEY, path);
}

export function getStoredReturnTo(): string | null {
  const value = sessionStorage.getItem(OAUTH_RETURN_TO_KEY);
  return isSafeReturnPath(value) ? value : null;
}

export function clearStoredReturnTo(): void {
  sessionStorage.removeItem(OAUTH_RETURN_TO_KEY);
}

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

export function redirectToSocialLogin(provider: SocialProvider, options?: RedirectToSocialLoginOptions): void {
  if (options?.returnTo !== undefined) {
    setStoredReturnTo(options.returnTo);
  }

  window.location.href = buildSocialAuthUrl(provider);
}
