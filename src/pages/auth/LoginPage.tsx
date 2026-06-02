import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { LoginModal, redirectToSocialLogin, resolveSessionExpiredError } from '@/features/auth';
import { AuthErrorScreen } from '@/features/auth/ui/status/AuthErrorScreen';
import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const sessionExpired = searchParams.get('reason') === 'session-expired';
  const errorPresentation = useMemo(() => (sessionExpired ? resolveSessionExpiredError() : null), [sessionExpired]);

  if (sessionExpired && errorPresentation) {
    return (
      <AuthErrorScreen
        presentation={errorPresentation}
        onRetrySocial={redirectToSocialLogin}
        showHomeLink
        primaryAction={
          <button
            type="button"
            onClick={() => setIsLoginOpen(true)}
            className="h-12 w-full cursor-pointer rounded-xl bg-brand text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            다시 로그인하기
          </button>
        }
      />
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center font-sans">
        <DoDoLogo className="h-12 w-auto" />
        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="text-[20px] font-semibold tracking-tight text-neutral-900">DoDo에 오신 것을 환영해요</h1>
          <p className="text-[14px] font-normal text-neutral-500">네이버·구글 계정으로 간편하게 시작할 수 있어요.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsLoginOpen(true)}
          className="h-12 min-w-[12rem] cursor-pointer rounded-xl bg-brand px-6 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          시작하기
        </button>
        <Link to="/" className="text-sm text-neutral-500 underline-offset-2 hover:text-brand hover:underline">
          홈으로
        </Link>
        {import.meta.env.DEV ? (
          <Link to="/auth/signup?preview=1" className="text-xs text-amber-700 underline">
            회원가입 UI 미리보기 (dev)
          </Link>
        ) : null}
      </div>

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSelectProvider={redirectToSocialLogin} />
    </>
  );
}
