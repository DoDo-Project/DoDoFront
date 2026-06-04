import { useQuery } from '@tanstack/react-query';

import { getPetSpecialNoteList, type GetPetSpecialNoteListParams } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function usePetSpecialNoteList(petId: number | null, params?: GetPetSpecialNoteListParams) {
  const isValidId = petId !== null && !Number.isNaN(petId);

  return useQuery({
    queryKey: isValidId ? queryKeys.pets.significantList(petId, params) : ['pets', 'significant', 'list', 'idle'],
    queryFn: () => getPetSpecialNoteList(petId as number, params),
    enabled: isValidId,
  });
}
