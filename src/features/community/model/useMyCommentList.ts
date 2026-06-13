import { useQuery } from '@tanstack/react-query';

import { getMyCommentList } from '../api/comments';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useMyCommentList(params: { page: number; size: number }, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.comments.mine(params),
    queryFn: () => getMyCommentList(params),
    enabled: options?.enabled,
  });
}
