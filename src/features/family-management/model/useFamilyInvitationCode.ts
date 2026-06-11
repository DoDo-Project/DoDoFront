import { useState } from 'react';

import { useCreatePetInvitationCode, type PetListItem } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import { INVITATION_CODE_STATUS_MESSAGES } from '../lib/constants';
import type { InvitationCodeState } from './types';

export function useFamilyInvitationCode(selectedPet: PetListItem | null) {
  const [invitationCodeByPetId, setInvitationCodeByPetId] = useState<Record<number, InvitationCodeState>>({});
  const createInvitationCodeMutation = useCreatePetInvitationCode();

  const activeInvitationCode = selectedPet ? (invitationCodeByPetId[selectedPet.petId] ?? null) : null;

  const createErrorMessage =
    createInvitationCodeMutation.isError && selectedPet
      ? getApiErrorMessage(
          createInvitationCodeMutation.error,
          '초대 코드 생성에 실패했어요. 잠시 후 다시 시도해 주세요.',
          INVITATION_CODE_STATUS_MESSAGES,
        )
      : '';

  const createSuccessMessage =
    createInvitationCodeMutation.isSuccess && activeInvitationCode
      ? `${selectedPet?.petName ?? '선택한 반려동물'}의 초대 코드가 준비되었어요.`
      : '';

  const handleCreateInvitationCode = async () => {
    if (!selectedPet) return;

    const created = await createInvitationCodeMutation.mutateAsync(selectedPet.petId);
    setInvitationCodeByPetId((current) => ({
      ...current,
      [selectedPet.petId]: {
        ...created,
        createdAt: Date.now(),
      },
    }));
  };

  return {
    activeInvitationCode,
    isCreating: createInvitationCodeMutation.isPending,
    createErrorMessage,
    createSuccessMessage,
    handleCreateInvitationCode,
  };
}
