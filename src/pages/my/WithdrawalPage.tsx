import { Link } from 'react-router-dom';

export function WithdrawalPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 sm:py-14">
      <div className="mb-6">
        <Link
          to="/my?menu=profile-edit"
          className="text-sm text-neutral-500 underline-offset-2 hover:text-brand hover:underline"
        >
          ← 회원정보 수정으로 돌아가기
        </Link>
      </div>

      <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-red-500">WITHDRAWAL</p>
          <h1 className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-neutral-950">회원 탈퇴</h1>
          <p className="mt-2 text-sm leading-7 text-neutral-600">
            탈퇴를 진행하려면 본인 확인이 필요해요. 가입하신 이메일로 인증번호를 보내드릴게요.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {/* TODO(Step 5): 인증 메일 발송 → 6자리 인증번호 입력 → 최종 탈퇴 플로우 */}
        </div>
      </div>
    </div>
  );
}
