import { useNavigate } from 'react-router-dom';

import { useLogout } from '@/features/auth';
import { clearTokens } from '@/shared/lib/auth/token';
import { Modal } from '@/shared/ui';

interface LogoutConfirmDialogProps {
  open: boolean;
  onClose: () => void;
}

export function LogoutConfirmDialog({ open, onClose }: LogoutConfirmDialogProps) {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useLogout();

  const handleClose = () => {
    if (isPending) return;
    onClose();
  };

  const handleConfirm = async () => {
    try {
      await mutateAsync();
    } catch (error) {
      // 서버 로그아웃이 실패해도 로컬 세션은 반드시 정리해 사용자가 갇히지 않도록 한다.
      console.error('[auth/logout] 서버 로그아웃 실패', error);
    } finally {
      // 인증 페이지(마이도도)에서 먼저 빠져나간 뒤 토큰을 정리해야
      // 잔여 인증 쿼리의 재요청 → 401 → 세션 만료 리다이렉트를 피할 수 있다.
      navigate('/', { replace: true });
      clearTokens();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} ariaLabel="로그아웃 확인 대화상자">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">LOGOUT</p>
        <h2 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-neutral-950">로그아웃 하시겠습니까?</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600">
          로그아웃하면 현재 기기에서 로그인 정보가 정리돼요. 다시 이용하려면 로그인이 필요해요.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isPending ? '로그아웃 중...' : '로그아웃'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
