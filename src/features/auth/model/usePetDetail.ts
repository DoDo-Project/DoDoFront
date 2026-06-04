import { useQuery } from '@tanstack/react-query';

import { getPetDetail } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function usePetDetail(petId: number | null) {
  const isValidId = petId !== null && !Number.isNaN(petId);

  return useQuery({
    queryKey: isValidId ? queryKeys.pets.detail(petId) : ['pets', 'detail', 'idle'],
    queryFn: () => getPetDetail(petId as number),
    enabled: isValidId,
  });
}
