import { useNavigate } from 'react-router-dom';

import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';
import { clearTokens } from '@/shared/lib/auth/token';
import { Modal } from '@/shared/ui';

interface WithdrawalCompleteModalProps {
  open: boolean;
}

export function WithdrawalCompleteModal({ open }: WithdrawalCompleteModalProps) {
  const navigate = useNavigate();

  // 홈으로 떠나는 시점에 토큰을 정리한다. (먼저 보호 페이지를 벗어난 뒤 세션 정리)
  const goHome = () => {
    navigate('/', { replace: true });
    clearTokens();
  };

  return (
    <Modal open={open} onClose={goHome} ariaLabel="회원 탈퇴 완료">
      <div className="flex flex-col items-center text-center">
        <DoDoLogo className="h-12 w-auto" />
        <h2 className="mt-5 text-xl font-semibold text-neutral-900">회원 탈퇴 완료</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-500">
          그동안 DoDo를 이용해 주셔서 감사합니다.
          <br />더 좋은 모습으로 다시 만날 수 있기를 바라요.
        </p>

        <button
          type="button"
          onClick={goHome}
          className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand px-6 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          홈으로
        </button>
      </div>
    </Modal>
  );
}
