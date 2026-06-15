import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createFence } from '../api/fence';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

/** 울타리 생성 후 경계 목록 갱신 */
export function useCreateFence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFence,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fence.boundaries() });
    },
  });
}
