import { useMutation, useQueryClient } from '@tanstack/react-query';

import { leavePetFamily } from '@/features/auth/api/pets';
import type { LeavePetFamilyResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

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
        queryKey: queryKeys.pets.detail(variables.petId),
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
