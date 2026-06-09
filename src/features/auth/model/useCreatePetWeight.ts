import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPetWeight } from '@/features/auth/api/pets';
import type { CreatePetWeightRequest, CreatePetWeightResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface CreatePetWeightVariables {
  petId: number;
  payload: CreatePetWeightRequest;
}

export function useCreatePetWeight() {
  const queryClient = useQueryClient();

  return useMutation<CreatePetWeightResponse, unknown, CreatePetWeightVariables>({
    mutationFn: ({ petId, payload }) => createPetWeight(petId, payload),
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
