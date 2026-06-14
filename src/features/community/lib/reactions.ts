import type { BoardDetailResponse, BoardListItem, ReactionType } from '../model/types';

const REACTION_TYPES: ReactionType[] = ['LIKE', 'DISLIKE'];

function clampCount(value: number) {
  return Math.max(0, value);
}

export function normalizeReactionType(value: unknown): ReactionType | null {
  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.toUpperCase();
  return REACTION_TYPES.includes(normalized as ReactionType) ? (normalized as ReactionType) : null;
}

export function getBoardReactionType(board: Partial<BoardDetailResponse> | null | undefined): ReactionType | null {
  if (!board) {
    return null;
  }

  return (
    normalizeReactionType(board.reactionType) ??
    normalizeReactionType(board.myReactionType) ??
    normalizeReactionType(board.currentUserReactionType) ??
    normalizeReactionType(board.userReactionType)
  );
}

export function getReactionCountDelta(previousReaction: ReactionType | null, nextReaction: ReactionType | null) {
  const likeDelta = (nextReaction === 'LIKE' ? 1 : 0) - (previousReaction === 'LIKE' ? 1 : 0);
  const dislikeDelta = (nextReaction === 'DISLIKE' ? 1 : 0) - (previousReaction === 'DISLIKE' ? 1 : 0);

  return { likeDelta, dislikeDelta };
}

export function applyReactionToBoardDetail(
  board: BoardDetailResponse,
  previousReaction: ReactionType | null,
  nextReaction: ReactionType | null,
): BoardDetailResponse {
  const { likeDelta, dislikeDelta } = getReactionCountDelta(previousReaction, nextReaction);

  return {
    ...board,
    likeCount: clampCount((board.likeCount ?? 0) + likeDelta),
    dislikeCount: clampCount((board.dislikeCount ?? 0) + dislikeDelta),
    reactionType: nextReaction,
    myReactionType: nextReaction,
    currentUserReactionType: nextReaction,
    userReactionType: nextReaction,
  };
}

export function applyReactionToBoardListItem(
  board: BoardListItem,
  previousReaction: ReactionType | null,
  nextReaction: ReactionType | null,
): BoardListItem {
  const { likeDelta, dislikeDelta } = getReactionCountDelta(previousReaction, nextReaction);

  return {
    ...board,
    likeCount: clampCount(board.likeCount + likeDelta),
    dislikeCount: clampCount(board.dislikeCount + dislikeDelta),
  };
}
