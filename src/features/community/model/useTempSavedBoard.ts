import { useQuery } from '@tanstack/react-query';

import { getTempSavedBoard } from '@/features/community/api/boards';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useTempSavedBoard(sessionKey: string | null) {
  const hasSessionKey = Boolean(sessionKey?.trim());

  return useQuery({
    queryKey: hasSessionKey ? queryKeys.boards.tempSaved(sessionKey as string) : ['boards', 'temp-save', 'idle'],
    queryFn: () => getTempSavedBoard(sessionKey as string),
    enabled: hasSessionKey,
  });
}
