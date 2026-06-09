const ACCESS_TOKEN_KEY = 'accessToken';
/** @deprecated migration-only legacy key */
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';
const REFRESH_TOKEN_KEY = 'dodo.refreshToken';
const PROFILE_URL_KEY = 'profileUrl';
const NICKNAME_KEY = 'nickname';
const NOTIFICATION_ENABLED_KEY = 'notificationEnabled';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'accessTokenExpiresAt';
const ACCESS_TOKEN_TTL_MS_KEY = 'accessTokenTtlMs';
const AUTH_STATE_EVENT = 'dodo:auth-state-change';

/** Refresh before expiry with a bounded TTL-based buffer. */
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

function notifyAuthStateChanged(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(AUTH_STATE_EVENT));
}

/** Migrate legacy localStorage refresh token into sessionStorage once. */
function migrateLegacyRefreshToken(): void {
  const legacy = localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY);
  if (!legacy) return;

  if (!readRefreshFromSession()) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, legacy);
  }
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  notifyAuthStateChanged();
}

migrateLegacyRefreshToken();

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

export function subscribeAuthState(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (!event.key) {
      listener();
      return;
    }

    if (
      event.key === ACCESS_TOKEN_KEY ||
      event.key === LEGACY_REFRESH_TOKEN_KEY ||
      event.key === PROFILE_URL_KEY ||
      event.key === NICKNAME_KEY ||
      event.key === NOTIFICATION_ENABLED_KEY ||
      event.key === ACCESS_TOKEN_EXPIRES_AT_KEY ||
      event.key === ACCESS_TOKEN_TTL_MS_KEY
    ) {
      listener();
    }
  };

  window.addEventListener(AUTH_STATE_EVENT, listener);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(AUTH_STATE_EVENT, listener);
    window.removeEventListener('storage', handleStorage);
  };
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

export function setTokens(auth: StoredAuth): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  setRefreshToken(auth.refreshToken);
  localStorage.setItem(PROFILE_URL_KEY, auth.profileUrl);

  if (auth.nickname) {
    localStorage.setItem(NICKNAME_KEY, auth.nickname);
  }

  setAccessTokenExpiry(auth.accessTokenExpiresIn);
  notifyAuthStateChanged();
}

export function setReissueTokens(tokens: ReissueTokens): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
  setAccessTokenExpiry(tokens.accessTokenExpiresIn * 1000);
  notifyAuthStateChanged();
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
  notifyAuthStateChanged();
}

export function getNotificationEnabled(): boolean | null {
  const value = localStorage.getItem(NOTIFICATION_ENABLED_KEY);
  if (value === 'true') return true;
  if (value === 'false') return false;
  return null;
}

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
    localStorage.setItem(NOTIFICATION_ENABLED_KEY, profile.notificationEnabled ? 'true' : 'false');
  }

  notifyAuthStateChanged();
}

export function hasAuthSession(): boolean {
  return Boolean(getAccessToken()) && Boolean(getRefreshToken());
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(PROFILE_URL_KEY);
  localStorage.removeItem(NICKNAME_KEY);
  localStorage.removeItem(NOTIFICATION_ENABLED_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
  localStorage.removeItem(ACCESS_TOKEN_TTL_MS_KEY);
  notifyAuthStateChanged();
}
