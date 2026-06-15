import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toggleFence } from '../api/fence';
import type { ToggleFenceRequest } from './types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface ToggleFenceVariables {
  fenceId: number;
  payload: ToggleFenceRequest;
}

/** 울타리 ON/OFF 변경 후 경계 목록 갱신 */
export function useToggleFence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fenceId, payload }: ToggleFenceVariables) => toggleFence(fenceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fence.boundaries() });
    },
  });
}
