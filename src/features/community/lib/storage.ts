import { COMMUNITY_DRAFT_SESSION_KEY } from './constants';

export function getStoredBoardDraftSessionKey(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.localStorage.getItem(COMMUNITY_DRAFT_SESSION_KEY);
  return value?.trim() ? value : null;
}

export function setStoredBoardDraftSessionKey(sessionKey: string) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(COMMUNITY_DRAFT_SESSION_KEY, sessionKey);
}

export function clearStoredBoardDraftSessionKey() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(COMMUNITY_DRAFT_SESSION_KEY);
}
