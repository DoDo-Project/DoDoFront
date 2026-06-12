import { useQuery } from '@tanstack/react-query';

import { getFamilyBlockedUsers, type GetFamilyBlockedUsersParams } from '@/features/auth/api/pets';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useFamilyBlockedUsers(params?: GetFamilyBlockedUsersParams) {
  return useQuery({
    queryKey: queryKeys.pets.family.blockedUsers(params),
    queryFn: () => getFamilyBlockedUsers(params),
  });
}
