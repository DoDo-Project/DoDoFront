import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';

import { createBoardReaction, deleteBoardReaction, updateBoardReaction } from '../api/reactions';
import { applyReactionToBoardDetail, applyReactionToBoardListItem } from '../lib/reactions';
import type { BoardDetailResponse, BoardListResponse, MyBoardListResponse, ReactionType } from './types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface BoardReactionVariables {
  boardId: number;
  nextReactionType: ReactionType;
  currentReactionType: ReactionType | null;
}

interface BoardReactionContext {
  previousDetail?: BoardDetailResponse;
  previousListInfinite?: InfiniteData<BoardListResponse, number>;
  previousMineQueries: Array<readonly [readonly unknown[], MyBoardListResponse | undefined]>;
}

function updateBoardListResponse(
  data: BoardListResponse,
  boardId: number,
  previousReaction: ReactionType | null,
  nextReaction: ReactionType | null,
) {
  return {
    ...data,
    boards: data.boards.map((board) =>
      board.boardId === boardId ? applyReactionToBoardListItem(board, previousReaction, nextReaction) : board,
    ),
  };
}

export function useBoardReaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ boardId, nextReactionType, currentReactionType }: BoardReactionVariables) => {
      if (currentReactionType === null) {
        return createBoardReaction({ boardId, reactionType: nextReactionType });
      }

      if (currentReactionType === nextReactionType) {
        return deleteBoardReaction(boardId);
      }

      return updateBoardReaction(boardId, { reactionType: nextReactionType });
    },
    onMutate: async ({ boardId, nextReactionType, currentReactionType }): Promise<BoardReactionContext> => {
      const optimisticReactionType = currentReactionType === nextReactionType ? null : nextReactionType;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.boards.detail(boardId) }),
        queryClient.cancelQueries({ queryKey: queryKeys.boards.listInfinite() }),
        queryClient.cancelQueries({ queryKey: ['boards', 'mine'] }),
      ]);

      const previousDetail = queryClient.getQueryData<BoardDetailResponse>(queryKeys.boards.detail(boardId));
      const previousListInfinite = queryClient.getQueryData<InfiniteData<BoardListResponse, number>>(
        queryKeys.boards.listInfinite(),
      );
      const previousMineQueries = queryClient.getQueriesData<MyBoardListResponse>({ queryKey: ['boards', 'mine'] });

      queryClient.setQueryData<BoardDetailResponse>(queryKeys.boards.detail(boardId), (current) =>
        current ? applyReactionToBoardDetail(current, currentReactionType, optimisticReactionType) : current,
      );

      queryClient.setQueryData<InfiniteData<BoardListResponse, number>>(queryKeys.boards.listInfinite(), (current) =>
        current
          ? {
              ...current,
              pages: current.pages.map((page) =>
                updateBoardListResponse(page, boardId, currentReactionType, optimisticReactionType),
              ),
            }
          : current,
      );

      queryClient.setQueriesData<MyBoardListResponse>({ queryKey: ['boards', 'mine'] }, (current) =>
        current ? updateBoardListResponse(current, boardId, currentReactionType, optimisticReactionType) : current,
      );

      return {
        previousDetail,
        previousListInfinite,
        previousMineQueries,
      };
    },
    onError: (_error, variables, context) => {
      if (!context) {
        return;
      }

      if (context.previousDetail) {
        queryClient.setQueryData(queryKeys.boards.detail(variables.boardId), context.previousDetail);
      }

      if (context.previousListInfinite) {
        queryClient.setQueryData(queryKeys.boards.listInfinite(), context.previousListInfinite);
      }

      context.previousMineQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: async (_data, _error, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.boards.detail(variables.boardId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.boards.listInfinite() }),
        queryClient.invalidateQueries({ queryKey: ['boards', 'mine'] }),
      ]);
    },
  });
}
