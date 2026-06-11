import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPetInvitationCode } from '@/features/auth/api/pets';
import type { CreatePetInvitationCodeResponse } from '@/features/auth/model/types';
import { queryKeys } from '@/shared/lib/react-query/queryKey';

export function useCreatePetInvitationCode() {
  const queryClient = useQueryClient();

  return useMutation<CreatePetInvitationCodeResponse, unknown, number>({
    mutationFn: createPetInvitationCode,
    onSuccess: (_, petId) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.family.invitationCode(petId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.pets.detail(petId),
      });
    },
  });
}
