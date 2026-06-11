import { useMutation, useQueryClient } from '@tanstack/react-query';

import { releaseFamilyBlockedUser } from '@/features/auth/api/pets';
import type { ReleaseFamilyBlockedUserRequest, ReleaseFamilyBlockedUserResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useReleaseFamilyBlockedUser() {
  const queryClient = useQueryClient();

  return useMutation<ReleaseFamilyBlockedUserResponse, unknown, ReleaseFamilyBlockedUserRequest>({
    mutationFn: releaseFamilyBlockedUser,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'blocked-users'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'pending-users'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'applications'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'list'],
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.detail(variables.petId),
      });
    },
  });
}
