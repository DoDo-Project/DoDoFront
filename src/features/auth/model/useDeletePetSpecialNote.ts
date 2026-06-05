import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePetSpecialNote } from '@/features/auth/api/pets';
import type { DeletePetSpecialNoteResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

interface DeletePetSpecialNoteVariables {
  petId: number;
  noteId: number;
}

export function useDeletePetSpecialNote() {
  const queryClient = useQueryClient();

  return useMutation<DeletePetSpecialNoteResponse, unknown, DeletePetSpecialNoteVariables>({
    mutationFn: ({ noteId }) => deletePetSpecialNote(noteId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', variables.petId, 'significant', 'list'],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.detail(variables.petId),
      });
    },
  });
}
