import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateFenceRange } from '../api/fence';
import type { UpdateFenceRangeRequest } from './types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface UpdateFenceRangeVariables {
  fenceId: number;
  payload: UpdateFenceRangeRequest;
}

/** 울타리 이름/중심/반경 수정 후 관련 쿼리 갱신 */
export function useUpdateFenceRange() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ fenceId, payload }: UpdateFenceRangeVariables) => updateFenceRange(fenceId, payload),
    onSuccess: (_data, { fenceId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fence.boundaries() });
      queryClient.invalidateQueries({ queryKey: queryKeys.fence.boundary(fenceId) });
    },
  });
}
