import { useQuery } from '@tanstack/react-query';

import { getBoardDetail } from '@/features/community/api/boards';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useBoardDetail(boardId: number | null) {
  const isValidId = boardId !== null && !Number.isNaN(boardId);

  return useQuery({
    queryKey: isValidId ? queryKeys.boards.detail(boardId) : ['boards', 'detail', 'idle'],
    queryFn: () => getBoardDetail(boardId as number),
    enabled: isValidId,
  });
}
