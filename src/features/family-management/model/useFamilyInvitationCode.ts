import { useEffect, useMemo, useState } from 'react';

import { useCreatePetInvitationCode, type PetListItem } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import { INVITATION_CODE_STATUS_MESSAGES } from '../lib/constants';
import type { InvitationCodeState } from './types';

const INVITATION_CODE_STORAGE_KEY = 'family-invitation-code-by-pet-id';

function pruneInvitationCodes(codes: Record<number, InvitationCodeState>) {
  const now = Date.now();

  return Object.fromEntries(
    Object.entries(codes).filter(([, value]) => {
      const elapsedSeconds = Math.floor((now - value.createdAt) / 1000);
      return elapsedSeconds < value.expiresIn;
    }),
  ) as Record<number, InvitationCodeState>;
}

function readStoredInvitationCodes() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(INVITATION_CODE_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as Record<string, InvitationCodeState>;
    return pruneInvitationCodes(parsed as Record<number, InvitationCodeState>);
  } catch {
    return {};
  }
}

export function useFamilyInvitationCode(selectedPet: PetListItem | null) {
  const [invitationCodeByPetId, setInvitationCodeByPetId] = useState<Record<number, InvitationCodeState>>(() =>
    readStoredInvitationCodes(),
  );
  const createInvitationCodeMutation = useCreatePetInvitationCode();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(
      INVITATION_CODE_STORAGE_KEY,
      JSON.stringify(pruneInvitationCodes(invitationCodeByPetId)),
    );
  }, [invitationCodeByPetId]);

  const activeInvitationCode = useMemo(() => {
    if (!selectedPet) {
      return null;
    }

    return invitationCodeByPetId[selectedPet.petId] ?? null;
  }, [invitationCodeByPetId, selectedPet]);

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
