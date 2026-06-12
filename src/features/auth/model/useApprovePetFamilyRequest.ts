import { useMutation, useQueryClient } from '@tanstack/react-query';

import { approvePetFamilyRequest } from '@/features/auth/api/pets';
import type { PetFamilyApprovalRequest, PetFamilyApprovalResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useApprovePetFamilyRequest() {
  const queryClient = useQueryClient();

  return useMutation<PetFamilyApprovalResponse, unknown, PetFamilyApprovalRequest>({
    mutationFn: approvePetFamilyRequest,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'pending-users'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'applications'],
      });
      void queryClient.invalidateQueries({
        queryKey: ['pets', 'family', 'blocked-users'],
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
