import { useMutation } from '@tanstack/react-query';

import { createBoard } from '@/features/community/api/boards';
import type { CreateBoardRequest, CreateBoardResponse } from '@/features/community/model/types';

export function useCreateBoard() {
  return useMutation<CreateBoardResponse, unknown, CreateBoardRequest>({
    mutationFn: createBoard,
  });
}
