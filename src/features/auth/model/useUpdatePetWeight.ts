import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePetWeight } from '@/features/auth/api/pets';
import type { UpdatePetWeightRequest, UpdatePetWeightResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface UpdatePetWeightVariables {
  petId: number;
  weightId: number;
  payload: UpdatePetWeightRequest;
}

export function useUpdatePetWeight() {
  const queryClient = useQueryClient();

  return useMutation<UpdatePetWeightResponse, unknown, UpdatePetWeightVariables>({
    mutationFn: ({ petId, weightId, payload }) => updatePetWeight(petId, weightId, payload),
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
