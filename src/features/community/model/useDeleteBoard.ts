import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteBoard } from '@/features/community/api/boards';
import type { DeleteBoardResponse } from '@/features/community/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface DeleteBoardVariables {
  boardId: number;
}

export function useDeleteBoard() {
  const queryClient = useQueryClient();

  return useMutation<DeleteBoardResponse, unknown, DeleteBoardVariables>({
    mutationFn: ({ boardId }) => deleteBoard(boardId),
    onSuccess: (_, variables) => {
      void queryClient.removeQueries({
        queryKey: queryKeys.boards.detail(variables.boardId),
      });
    },
  });
}
