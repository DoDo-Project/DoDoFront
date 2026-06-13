import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateComment } from '@/features/community/api/comments';
import type { UpdateCommentRequest, UpdateCommentResponse } from '@/features/community/model/types';

interface UpdateCommentVariables {
  boardId: number;
  commentId: number;
  payload: UpdateCommentRequest;
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation<UpdateCommentResponse, unknown, UpdateCommentVariables>({
    mutationFn: ({ commentId, payload }) => updateComment(commentId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['boards', variables.boardId, 'comments'],
      });
    },
  });
}
