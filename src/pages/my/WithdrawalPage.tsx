import { useState } from 'react';
import { Link } from 'react-router-dom';

import { WithdrawalCompleteModal } from '@/pages/my/ui/WithdrawalCompleteModal';
import { WithdrawalFlow } from '@/pages/my/ui/WithdrawalFlow';

export function WithdrawalPage() {
  const [completed, setCompleted] = useState(false);

  // 토큰 정리는 완료 모달을 닫고 홈으로 이동하는 시점(WithdrawalCompleteModal)으로 미룬다.
  // RequireAuth 가드 아래에서 즉시 clearTokens 하면 모달 노출 전에 /auth로 리다이렉트될 수 있다.
  const handleCompleted = () => {
    setCompleted(true);
  };

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <div className="mb-2">
        <Link
          to="/my?menu=profile-edit"
          className="text-sm text-neutral-500 underline-offset-2 hover:text-brand hover:underline"
        >
          ← 회원정보 수정으로 돌아가기
        </Link>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
          <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-neutral-950">회원 탈퇴</h1>
          <p className="mt-2 text-sm leading-7 text-neutral-600">
            탈퇴를 진행하려면 본인 확인이 필요해요. 가입하신 이메일로 인증번호를 보내드릴게요.
          </p>
          {/* <p className="text-sm leading-7 text-red-500">탈퇴 시 계정과 모든 데이터가 삭제되며 되돌릴 수 없어요.</p> */}
        </div>

        <div className="px-6 py-6 sm:px-8">
          <WithdrawalFlow onCompleted={handleCompleted} />
        </div>
      </div>

      <WithdrawalCompleteModal open={completed} />
    </div>
  );
}
