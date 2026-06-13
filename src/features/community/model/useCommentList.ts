import { useQuery } from '@tanstack/react-query';

import { getCommentList } from '@/features/community/api/comments';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useCommentList(boardId: number | null, params: { page: number; size: number }) {
  const isValidId = boardId !== null && !Number.isNaN(boardId);

  return useQuery({
    queryKey: isValidId ? queryKeys.boards.comments(boardId, params) : ['boards', 'comments', 'idle'],
    queryFn: () => getCommentList(boardId as number, params),
    enabled: isValidId,
  });
}
