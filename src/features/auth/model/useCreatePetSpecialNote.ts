import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPetSpecialNote } from '@/features/auth/api/pets';
import type { CreatePetSpecialNoteRequest, CreatePetSpecialNoteResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useCreatePetSpecialNote() {
  const queryClient = useQueryClient();

  return useMutation<CreatePetSpecialNoteResponse, unknown, CreatePetSpecialNoteRequest>({
    mutationFn: createPetSpecialNote,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.significantList(variables.petId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.detail(variables.petId),
      });
    },
  });
}
