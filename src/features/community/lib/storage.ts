import { COMMUNITY_DRAFT_SESSION_KEY } from './constants';
import type { ReactionType } from '../model/types';

const COMMUNITY_BOARD_REACTION_KEY_PREFIX = 'community-board-reaction';

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

function getBoardReactionStorageKey(boardId: number) {
  return `${COMMUNITY_BOARD_REACTION_KEY_PREFIX}:${boardId}`;
}

export function getStoredBoardReactionType(boardId: number): ReactionType | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.localStorage.getItem(getBoardReactionStorageKey(boardId));
  return value === 'LIKE' || value === 'DISLIKE' ? value : null;
}

export function setStoredBoardReactionType(boardId: number, reactionType: ReactionType) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(getBoardReactionStorageKey(boardId), reactionType);
}

export function clearStoredBoardReactionType(boardId: number) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(getBoardReactionStorageKey(boardId));
}
