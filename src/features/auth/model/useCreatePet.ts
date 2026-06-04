import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPet } from '@/features/auth/api/pets';
import type { CreatePetRequest, CreatePetResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation<CreatePetResponse, unknown, CreatePetRequest>({
    mutationFn: createPet,
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'list'],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.detail(data.petId),
      });
    },
  });
}
