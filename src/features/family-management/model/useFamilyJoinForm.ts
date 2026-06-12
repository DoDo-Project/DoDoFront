import { useState } from 'react';

import { useRequestFamilyJoin } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

import { FAMILY_CODE_REGEX, FAMILY_JOIN_STATUS_MESSAGES } from '../lib/constants';
import { normalizeFamilyCode } from '../lib/formatters';

export function useFamilyJoinForm() {
  const [joinCode, setJoinCode] = useState('');
  const [joinErrorMessage, setJoinErrorMessage] = useState('');
  const [joinSuccessMessage, setJoinSuccessMessage] = useState('');
  const requestFamilyJoinMutation = useRequestFamilyJoin();

  const handleChangeJoinCode = (value: string) => {
    setJoinCode(normalizeFamilyCode(value));
    if (joinErrorMessage) {
      setJoinErrorMessage('');
    }
    if (joinSuccessMessage) {
      setJoinSuccessMessage('');
    }
  };

  const handleRequestFamilyJoin = async () => {
    const trimmed = joinCode.trim();

    if (!FAMILY_CODE_REGEX.test(trimmed)) {
      setJoinErrorMessage('가족 코드는 영문 대문자와 숫자 6자리여야 해요.');
      setJoinSuccessMessage('');
      return;
    }

    try {
      const result = await requestFamilyJoinMutation.mutateAsync(trimmed);
      setJoinSuccessMessage(`가족 신청이 완료되었어요. 반려동물 ID ${result.petId}의 승인을 기다려 주세요.`);
      setJoinErrorMessage('');
      setJoinCode('');
    } catch (error) {
      setJoinSuccessMessage('');
      setJoinErrorMessage(
        getApiErrorMessage(error, '가족 신청에 실패했어요. 잠시 후 다시 시도해 주세요.', FAMILY_JOIN_STATUS_MESSAGES),
      );
    }
  };

  return {
    joinCode,
    joinErrorMessage,
    joinSuccessMessage,
    isSubmitting: requestFamilyJoinMutation.isPending,
    handleChangeJoinCode,
    handleRequestFamilyJoin,
  };
}
