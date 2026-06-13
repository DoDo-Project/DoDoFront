import { useQuery } from '@tanstack/react-query';

import { getMyBoardList } from '../api/boards';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useMyBoardList(params: { page: number; size: number }, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.boards.mine(params),
    queryFn: () => getMyBoardList(params),
    enabled: options?.enabled,
  });
}
