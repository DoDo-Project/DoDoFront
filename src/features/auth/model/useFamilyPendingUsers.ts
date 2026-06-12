import { useQuery } from '@tanstack/react-query';

import { getFamilyPendingUsers, type GetFamilyPendingUsersParams } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useFamilyPendingUsers(params?: GetFamilyPendingUsersParams) {
  return useQuery({
    queryKey: queryKeys.pets.family.pendingUsers(params),
    queryFn: () => getFamilyPendingUsers(params),
  });
}
