import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updatePetSpecialNote } from '@/features/auth/api/pets';
import type { UpdatePetSpecialNoteRequest, UpdatePetSpecialNoteResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface UpdatePetSpecialNoteVariables {
  petId: number;
  noteId: number;
  payload: UpdatePetSpecialNoteRequest;
}

export function useUpdatePetSpecialNote() {
  const queryClient = useQueryClient();

  return useMutation<UpdatePetSpecialNoteResponse, unknown, UpdatePetSpecialNoteVariables>({
    mutationFn: ({ noteId, payload }) => updatePetSpecialNote(noteId, payload),
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
