import { useMutation } from '@tanstack/react-query';

import { tempSaveBoard } from '@/features/community/api/boards';
import type { TempSaveBoardRequest, TempSaveBoardResponse } from '@/features/community/model/types';

export function useTempSaveBoard() {
  return useMutation<TempSaveBoardResponse, unknown, TempSaveBoardRequest>({
    mutationFn: tempSaveBoard,
  });
}
