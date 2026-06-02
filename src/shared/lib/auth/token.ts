// 인증 토큰 저장소(localStorage) 접근을 한 곳에 모은 모듈
// 키 문자열을 여기서만 관리해 오타/중복을 방지
//
// 보안 메모: 현재는 백엔드가 토큰을 JSON 바디로 내려주고, apiClient 등 기존 코드가
// localStorage의 accessToken을 읽는 구조라 localStorage에 저장함
// TODO(보안 강화): 백엔드가 httpOnly 쿠키를 지원하면 refreshToken은 쿠키로 옮김

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const PROFILE_URL_KEY = 'profileUrl';
const NICKNAME_KEY = 'nickname';
const NOTIFICATION_ENABLED_KEY = 'notificationEnabled';
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'accessTokenExpiresAt';

interface StoredAuth {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  profileUrl: string;
  nickname?: string;
}

// 로그인/가입 완료 응답을 받아 토큰과 부가 정보를 저장
export function setTokens(auth: StoredAuth): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  localStorage.setItem(PROFILE_URL_KEY, auth.profileUrl);

  if (auth.nickname) {
    localStorage.setItem(NICKNAME_KEY, auth.nickname);
  }

  // 남은 시간(ms)을 만료 '시각'(epoch ms)으로 환산해 저장 → 만료 체크가 쉬워져요!!!
  const expiresAt = Date.now() + auth.accessTokenExpiresIn;
  localStorage.setItem(ACCESS_TOKEN_EXPIRES_AT_KEY, String(expiresAt));
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
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

// 저장된 모든 인증 정보를 제거(로그아웃 등)
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(PROFILE_URL_KEY);
  localStorage.removeItem(NICKNAME_KEY);
  localStorage.removeItem(NOTIFICATION_ENABLED_KEY);
  localStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY);
}
