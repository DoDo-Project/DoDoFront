// 인증 토큰 저장소 — 키 문자열은 여기서만 관리
//
// 저장 전략 (XSS 완화, 백엔드 쿠키 전환 전):
// - accessToken: localStorage (apiClient·RequireAuth가 읽음)
// - refreshToken: sessionStorage (탭 종료 시 제거, localStorage보다 노출 범위 축소)
// TODO(보안 강화): 백엔드 httpOnly 쿠키 지원 시 refreshToken은 쿠키로, accessToken도 쿠키 검토

const ACCESS_TOKEN_KEY = 'accessToken';
/** @deprecated 마이그레이션용 — 신규 저장은 sessionStorage만 사용 */
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';
const REFRESH_TOKEN_KEY = 'dodo.refreshToken';
const PROFILE_URL_KEY = 'profileUrl';
const NICKNAME_KEY = 'nickname';
const NOTIFICATION_ENABLED_KEY = 'notificationEnabled';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'accessTokenExpiresAt';
const ACCESS_TOKEN_TTL_MS_KEY = 'accessTokenTtlMs';

/** 만료 N ms 전에 선제 갱신 (TTL 대비 cap 적용) */
export const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  profileUrl: string;
  nickname?: string;
}

interface ReissueTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

function readRefreshFromSession(): string | null {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

/** 예전 localStorage refreshToken → sessionStorage로 1회 이전 */
function migrateLegacyRefreshToken(): void {
  const legacy = localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
  if (!legacy) return;

  if (!readRefreshFromSession()) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, legacy);
  }
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

migrateLegacyRefreshToken();

/** 소셜 로그인·가입 응답: accessTokenExpiresIn은 밀리초 (OpenAPI SocialLoginResponse) */
export function normalizeExpiresInMs(expiresIn: number): number {
  if (expiresIn < 100_000) {
    return expiresIn * 1000;
  }
  return expiresIn;
}

function setRefreshToken(refreshToken: string): void {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

function setAccessTokenExpiry(expiresInMs: number): void {
  const expiresAt = Date.now() + expiresInMs;
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
  localStorage.setItem(ACCESS_TOKEN_TTL_MS_KEY, String(expiresInMs));
}

function getRefreshBufferMs(): number {
  const ttlRaw = localStorage.getItem(ACCESS_TOKEN_TTL_MS_KEY);
  const ttlMs = ttlRaw ? Number(ttlRaw) : NaN;
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
    return ACCESS_TOKEN_REFRESH_BUFFER_MS;
  }
  return Math.min(ACCESS_TOKEN_REFRESH_BUFFER_MS, Math.max(5_000, Math.floor(ttlMs * 0.1)));
}

export function getAccessTokenExpiresAt(): number | null {
  const raw = localStorage.getItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isAccessTokenExpired(bufferMs = getRefreshBufferMs()): boolean {
  const expiresAt = getAccessTokenExpiresAt();
  if (expiresAt === null) return false;
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return true;
  return remaining <= bufferMs;
}

// 로그인/가입 완료 응답을 받아 토큰과 부가 정보를 저장
export function setTokens(auth: StoredAuth): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  setRefreshToken(auth.refreshToken);
  localStorage.setItem(PROFILE_URL_KEY, auth.profileUrl);

  if (auth.nickname) {
    localStorage.setItem(NICKNAME_KEY, auth.nickname);
  }

  setAccessTokenExpiry(normalizeExpiresInMs(auth.accessTokenExpiresIn));
}

/** POST /auth/reissue 응답 — accessTokenExpiresIn은 초 단위 (OpenAPI TokenResponse) */
export function setReissueTokens(tokens: ReissueTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  setAccessTokenExpiry(normalizeExpiresInMs(tokens.accessTokenExpiresIn));
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return readRefreshFromSession();
}

export function getProfileUrl(): string | null {
  return localStorage.getItem(PROFILE_URL_KEY);
}

export function getNickname(): string | null {
  return localStorage.getItem(NICKNAME_KEY);
}

export function setNotificationEnabled(enabled: boolean): void {
  localStorage.setItem(NOTIFICATION_ENABLED_KEY, enabled ? 'true' : 'false');
}

export function getNotificationEnabled(): boolean | null {
  const value = localStorage.getItem(NOTIFICATION_ENABLED_KEY);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

/** GET /users/me 응답으로 localStorage 프로필 캐시를 갱신 */
export function syncUserProfile(profile: {
  profileUrl?: string;
  nickname?: string;
  notificationEnabled?: boolean;
}): void {
  const profileUrl = profile.profileUrl?.trim();
  if (profileUrl) {
    localStorage.setItem(PROFILE_URL_KEY, profileUrl);
  }

  const nickname = profile.nickname?.trim();
  if (nickname) {
    localStorage.setItem(NICKNAME_KEY, nickname);
  }

  if (profile.notificationEnabled !== undefined) {
    setNotificationEnabled(profile.notificationEnabled);
  }
}

/** access + refresh 모두 있을 때만 true (reissue 가능한 완전한 세션) */
export function hasAuthSession(): boolean {
  return Boolean(getAccessToken()) && Boolean(getRefreshToken());
}

// 저장된 모든 인증 정보를 제거(로그아웃·갱신 실패 등)
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(PROFILE_URL_KEY);
  localStorage.removeItem(NICKNAME_KEY);
  localStorage.removeItem(NOTIFICATION_ENABLED_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(ACCESS_TOKEN_TTL_MS_KEY);
}
