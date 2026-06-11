import { useMutation, useQueryClient } from '@tanstack/react-query';

import { requestFamilyJoin } from '@/features/auth/api/pets';
import type { PetFamilyJoinResponse } from '@/features/auth/model/types';

export function useRequestFamilyJoin() {
  const queryClient = useQueryClient();

  return useMutation<PetFamilyJoinResponse, unknown, string>({
    mutationFn: (code) => requestFamilyJoin(code),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'applications'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'list'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', data.petId, 'detail'],
      });
    },
  });
}
