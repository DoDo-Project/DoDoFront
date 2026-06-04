import { useQuery } from '@tanstack/react-query';

import { getPetList, type GetPetListParams } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function usePetList(params?: GetPetListParams) {
  return useQuery({
    queryKey: queryKeys.pets.list(params),
    queryFn: () => getPetList(params),
  });
}
