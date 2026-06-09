import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { LoginModal, redirectToSocialLogin, resolveSessionExpiredError } from '@/features/auth';
import { AuthErrorScreen } from '@/features/auth/ui/status/AuthErrorScreen';
import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';
import { clearTokens } from '@/shared/lib/auth/token';

const sessionExpiredButtonClassName =
  'group relative h-14 w-full overflow-hidden rounded-2xl bg-linear-to-r from-brand via-[#f08b57] to-[#f6b93b] px-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(229,108,49,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(229,108,49,0.42)]';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const sessionExpired = searchParams.get('reason') === 'session-expired';
  const errorPresentation = useMemo(() => (sessionExpired ? resolveSessionExpiredError() : null), [sessionExpired]);

  const handleGoHomeAsGuest = () => {
    clearTokens();
    navigate('/', { replace: true });
  };

  if (sessionExpired && errorPresentation) {
    return (
      <>
        <AuthErrorScreen
          presentation={errorPresentation}
          showHomeLink
          onHomeClick={handleGoHomeAsGuest}
          primaryAction={
            <button type="button" onClick={() => setIsLoginOpen(true)} className={sessionExpiredButtonClassName}>
              <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/18 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="absolute -right-8 top-0 h-full w-20 rotate-12 bg-white/12 blur-2xl transition-transform duration-500 group-hover:-translate-x-4" />
              <span className="relative flex items-center justify-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/18 text-base">
                  *
                </span>
                <span>다시 로그인하기</span>
              </span>
            </button>
          }
        />

        <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSelectProvider={redirectToSocialLogin} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-10 text-center font-sans">
        <DoDoLogo className="h-12 w-auto" />
        <div className="flex max-w-sm flex-col gap-2">
          <h1 className="text-[20px] font-semibold tracking-tight text-neutral-900">DoDo와 함께 시작해보세요</h1>
          <p className="text-[14px] font-normal text-neutral-500">네이버와 구글 계정으로 간편하게 시작할 수 있어요.</p>
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
      </div>

      <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSelectProvider={redirectToSocialLogin} />
    </>
  );
}
