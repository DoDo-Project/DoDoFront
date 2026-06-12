import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateBoard } from '@/features/community/api/boards';
import type { UpdateBoardRequest, UpdateBoardResponse } from '@/features/community/model/types';
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
      void queryClient.invalidateQueries({
        queryKey: queryKeys.boards.detail(variables.boardId),
      });
    },
  });
}
