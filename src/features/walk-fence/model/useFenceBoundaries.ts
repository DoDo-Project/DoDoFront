import { useQuery } from '@tanstack/react-query';

import { getFenceBoundaries } from '../api/fence';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

/** 접근 가능한 모든 울타리 경계 목록 조회 */
export function useFenceBoundaries() {
  return useQuery({
    queryKey: queryKeys.fence.boundaries(),
    queryFn: getFenceBoundaries,
  });
}
