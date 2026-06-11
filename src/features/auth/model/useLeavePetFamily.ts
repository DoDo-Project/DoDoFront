import { useMutation, useQueryClient } from '@tanstack/react-query';

import { leavePetFamily } from '@/features/auth/api/pets';
import type { LeavePetFamilyResponse } from '@/features/auth/model/types';

interface LeavePetFamilyVariables {
  petId: number;
}

export function useLeavePetFamily() {
  const queryClient = useQueryClient();

  return useMutation<LeavePetFamilyResponse, unknown, LeavePetFamilyVariables>({
    mutationFn: ({ petId }) => leavePetFamily(petId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'list'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', variables.petId, 'detail'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'applications'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'pending-users'],
      });
    },
  });
}
