import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createComment } from '@/features/community/api/comments';
import type { CreateCommentRequest, CreateCommentResponse } from '@/features/community/model/types';

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation<CreateCommentResponse, unknown, CreateCommentRequest>({
    mutationFn: createComment,
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
