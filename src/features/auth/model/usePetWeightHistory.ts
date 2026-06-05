import { useQuery } from '@tanstack/react-query';

import { getPetWeightHistory, type GetPetWeightHistoryParams } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function usePetWeightHistory(petId: number | null, params?: GetPetWeightHistoryParams) {
  const isValidId = petId !== null && !Number.isNaN(petId);

  return useQuery({
    queryKey: isValidId ? queryKeys.pets.weightHistory(petId, params) : ['pets', 'weight', 'history', 'idle'],
    queryFn: () => getPetWeightHistory(petId as number, params),
    enabled: isValidId,
  });
}
