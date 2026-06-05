import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePetWeight } from '@/features/auth/api/pets';
import type { DeletePetWeightResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface DeletePetWeightVariables {
  petId: number;
  weightId: number;
}

export function useDeletePetWeight() {
  const queryClient = useQueryClient();

  return useMutation<DeletePetWeightResponse, unknown, DeletePetWeightVariables>({
    mutationFn: ({ petId, weightId }) => deletePetWeight(petId, weightId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', variables.petId, 'weight', 'history'],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.detail(variables.petId),
      });
    },
  });
}
