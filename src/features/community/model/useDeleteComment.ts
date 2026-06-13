import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteComment } from '@/features/community/api/comments';
import type { DeleteCommentResponse } from '@/features/community/model/types';

interface DeleteCommentVariables {
  boardId: number;
  commentId: number;
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation<DeleteCommentResponse, unknown, DeleteCommentVariables>({
    mutationFn: ({ commentId }) => deleteComment(commentId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['boards', variables.boardId, 'comments'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['boards', variables.boardId, 'detail'],
      });
    },
  });
}
