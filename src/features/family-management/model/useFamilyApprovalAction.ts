import { useState } from 'react';

import { useApprovePetFamilyRequest, type FamilyPendingUser, type PetFamilyApprovalAction } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

function getSuccessMessage(request: FamilyPendingUser, action: PetFamilyApprovalAction) {
  if (action === 'APPROVED') {
    return `${request.nickname}님의 가족 신청을 승인했어요.`;
  }

  if (action === 'BLOCKED') {
    return `${request.nickname}님을 차단 목록에 추가했어요.`;
  }

  return `${request.nickname}님의 가족 신청을 거절했어요.`;
}

function getDefaultErrorMessage(action: PetFamilyApprovalAction) {
  if (action === 'APPROVED') {
    return '가족 신청 승인에 실패했어요. 잠시 후 다시 시도해 주세요.';
  }

  if (action === 'BLOCKED') {
    return '가족 신청 차단에 실패했어요. 잠시 후 다시 시도해 주세요.';
  }

  return '가족 신청 거절에 실패했어요. 잠시 후 다시 시도해 주세요.';
}

export function useFamilyApprovalAction() {
  const approvePetFamilyRequestMutation = useApprovePetFamilyRequest();
  const [activeRequestKey, setActiveRequestKey] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error' | null>(null);

  const handleApproveAction = async (request: FamilyPendingUser, action: PetFamilyApprovalAction) => {
    const requestKey = `${request.targetPetId}-${request.userId}`;
    setActiveRequestKey(requestKey);
    setFeedbackMessage('');
    setFeedbackTone(null);

    try {
      await approvePetFamilyRequestMutation.mutateAsync({
        petId: request.targetPetId,
        targetUserId: request.userId,
        action,
      });

      setFeedbackTone('success');
      setFeedbackMessage(getSuccessMessage(request, action));
    } catch (error) {
      setFeedbackTone('error');
      setFeedbackMessage(
        getApiErrorMessage(error, getDefaultErrorMessage(action), {
          401: '로그인이 필요해요. 다시 시도해 주세요.',
          403: '이 요청을 처리할 권한이 없어요.',
          404: `${request.nickname}님을 찾을 수 없습니다.`,
          409: '이미 처리된 요청이거나 이미 가족으로 등록된 상태예요.',
          500: '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
        }),
      );
      throw error;
    } finally {
      setActiveRequestKey(null);
    }
  };

  return {
    activeRequestKey,
    feedbackMessage,
    feedbackTone,
    handleApproveAction,
  };
}
