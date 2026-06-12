import { useEffect, useState } from 'react';

import { useReleaseFamilyBlockedUser, type FamilyBlockedUser } from '@/features/auth';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';

export function useFamilyBlockedAction() {
  const releaseFamilyBlockedUserMutation = useReleaseFamilyBlockedUser();
  const [activeBlockedUserKey, setActiveBlockedUserKey] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackTone, setFeedbackTone] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    if (!feedbackMessage || !feedbackTone) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFeedbackMessage('');
      setFeedbackTone(null);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [feedbackMessage, feedbackTone]);

  const handleReleaseBlockedUser = async (user: FamilyBlockedUser) => {
    const blockedUserKey = `${user.targetPetId}-${user.userId}`;
    setActiveBlockedUserKey(blockedUserKey);
    setFeedbackMessage('');
    setFeedbackTone(null);

    try {
      await releaseFamilyBlockedUserMutation.mutateAsync({
        petId: user.targetPetId,
        targetUserId: user.userId,
      });

      setFeedbackTone('success');
      setFeedbackMessage(`${user.nickname}님의 차단을 해제했어요.`);
    } catch (error) {
      setFeedbackTone('error');
      setFeedbackMessage(
        getApiErrorMessage(error, '차단 해제에 실패했어요. 잠시 후 다시 시도해 주세요.', {
          401: '로그인이 필요해요. 다시 시도해 주세요.',
          403: '차단을 해제할 권한이 없어요.',
          404: '차단된 사용자 정보를 찾을 수 없어요.',
          500: '서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요.',
        }),
      );
      throw error;
    } finally {
      setActiveBlockedUserKey(null);
    }
  };

  return {
    activeBlockedUserKey,
    feedbackMessage,
    feedbackTone,
    handleReleaseBlockedUser,
  };
}
