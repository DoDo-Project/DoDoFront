import { useQuery } from '@tanstack/react-query';

import { getFenceStatus } from '../api/fence';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

/** 특정 반려동물의 울타리 활성화 상태 조회 (petId 없으면 비활성) */
export function useFenceStatus(petId: number | null) {
  return useQuery({
    queryKey: queryKeys.fence.status(petId ?? 0),
    queryFn: () => getFenceStatus(petId as number),
    enabled: petId != null,
  });
}
