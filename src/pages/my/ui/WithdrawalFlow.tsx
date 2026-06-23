import { useState } from 'react';

import {
  WITHDRAWAL_EMAIL_STATUS_MESSAGES,
  WITHDRAW_USER_STATUS_MESSAGES,
  getApiErrorMessage,
  useSendWithdrawalEmail,
  useWithdrawUser,
} from '@/features/auth';
import { getApiErrorStatus } from '@/shared/lib/api/errorMessage';
import { useCooldown } from '@/shared/lib/useCooldown';
import { Toast } from '@/shared/ui';
import { AuthCodeInput } from '@/pages/my/ui/AuthCodeInput';

const AUTH_CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;
/** 인증번호 불일치로 간주하는 상태 코드 */
const INVALID_CODE_STATUSES = new Set([400, 401]);

interface WithdrawalFlowProps {
  /** 최종 탈퇴 성공 시 호출 (토큰 정리·완료 화면 전환은 상위에서 처리) */
  onCompleted: () => void;
}

interface ToastState {
  message: string;
  tone: 'success' | 'error';
}

export function WithdrawalFlow({ onCompleted }: WithdrawalFlowProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [authCode, setAuthCode] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const { seconds: cooldown, start: startCooldown } = useCooldown();

  const { mutateAsync: sendEmail, isPending: isSending } = useSendWithdrawalEmail();
  const { mutateAsync: withdraw, isPending: isWithdrawing } = useWithdrawUser();

  const handleSendEmail = async () => {
    if (isSending || cooldown > 0) return;

    try {
      await sendEmail();
      setEmailSent(true);
      startCooldown(RESEND_COOLDOWN_SECONDS);
      setToast({ message: '인증번호를 메일로 보냈어요. 메일함을 확인해주세요.', tone: 'success' });
    } catch (error) {
      setToast({
        message: getApiErrorMessage(
          error,
          '인증 메일 발송에 실패했어요. 잠시 후 다시 시도해주세요.',
          WITHDRAWAL_EMAIL_STATUS_MESSAGES,
        ),
        tone: 'error',
      });
    }
  };

  const handleCodeChange = (value: string) => {
    setAuthCode(value);
    setWithdrawError('');
  };

  const handleWithdraw = async () => {
    if (isWithdrawing) return;

    if (authCode.length !== AUTH_CODE_LENGTH) {
      setWithdrawError('6자리 인증번호를 입력해주세요.');
      return;
    }

    setWithdrawError('');

    try {
      await withdraw(authCode);
      onCompleted();
    } catch (error) {
      const status = getApiErrorStatus(error);
      if (status !== null && INVALID_CODE_STATUSES.has(status)) {
        setWithdrawError('인증번호가 틀렸습니다. 다시 확인해주세요.');
        return;
      }

      setWithdrawError(
        getApiErrorMessage(error, '회원 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.', WITHDRAW_USER_STATUS_MESSAGES),
      );
    }
  };

  return (
    <>
      <Toast
        open={toast !== null}
        message={toast?.message ?? ''}
        tone={toast?.tone ?? 'default'}
        onClose={() => setToast(null)}
      />

      {!emailSent ? (
        <button
          type="button"
          onClick={handleSendEmail}
          disabled={isSending}
          className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand px-6 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSending ? '인증 메일 발송 중...' : '인증 메일 발송'}
        </button>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-md font-medium text-neutral-800">인증번호</p>
            <p className="mt-2 text-sm text-neutral-500">메일로 받은 6자리 숫자를 입력해주세요.</p>
            <div className="mt-3">
              <AuthCodeInput
                length={AUTH_CODE_LENGTH}
                value={authCode}
                onChange={handleCodeChange}
                disabled={isWithdrawing}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-400">인증번호를 받지 못하셨나요?</span>
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={isSending || cooldown > 0}
              className="text-sm font-medium text-brand transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:text-neutral-400"
            >
              {cooldown > 0 ? `${cooldown}초 후 재발송` : '인증 메일 재발송'}
            </button>
          </div>

          {withdrawError ? <p className="text-sm text-red-500">{withdrawError}</p> : null}

          <button
            type="button"
            onClick={handleWithdraw}
            disabled={isWithdrawing || authCode.length !== AUTH_CODE_LENGTH}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-red-500 px-6 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isWithdrawing ? '탈퇴 처리 중...' : '회원 탈퇴하기'}
          </button>
        </div>
      )}
    </>
  );
}
