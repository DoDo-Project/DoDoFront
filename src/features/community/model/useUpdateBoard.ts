import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateBoard } from '@/features/community/api/boards';
import type { BoardDetailResponse, UpdateBoardRequest, UpdateBoardResponse } from '@/features/community/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface UpdateBoardVariables {
  boardId: number;
  payload: UpdateBoardRequest;
}

export function useUpdateBoard() {
  const queryClient = useQueryClient();

  return useMutation<UpdateBoardResponse, unknown, UpdateBoardVariables>({
    mutationFn: ({ boardId, payload }) => updateBoard(boardId, payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<BoardDetailResponse | undefined>(
        queryKeys.boards.detail(variables.boardId),
        (previous) => {
          if (!previous) {
            return previous;
          }

          return {
            ...previous,
            boardTitle: variables.payload.boardTitle,
            boardContent: variables.payload.boardContent,
            imageFileUrls: variables.payload.imageFileUrls,
            modifiedAt: new Date().toISOString(),
          };
        },
      );

      void queryClient.invalidateQueries({
        queryKey: queryKeys.boards.listInfinite(),
      });
    },
  });
}
