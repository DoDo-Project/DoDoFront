import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePet } from '@/features/auth/api/pets';
import type { UpdatePetRequest, UpdatePetResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface UpdatePetVariables {
  petId: number;
  payload: UpdatePetRequest;
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation<UpdatePetResponse, unknown, UpdatePetVariables>({
    mutationFn: ({ petId, payload }) => updatePet(petId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'list'],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.detail(variables.petId),
      });
    },
  });
}
