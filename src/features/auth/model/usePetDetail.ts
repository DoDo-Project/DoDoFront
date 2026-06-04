import { useQuery } from '@tanstack/react-query';

import { getPetDetail } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function usePetDetail(petId: number | null) {
  return useQuery({
    queryKey: petId ? queryKeys.pets.detail(petId) : ['pets', 'detail', 'idle'],
    queryFn: () => getPetDetail(petId as number),
    enabled: petId !== null,
  });
}
