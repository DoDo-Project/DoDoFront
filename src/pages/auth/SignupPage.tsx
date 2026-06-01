import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { SignupFlow } from '@/features/auth';

// 콜백에서 202 응답과 함께 넘겨주는 회원가입 컨텍스트
interface SignupLocationState {
  registrationToken?: string;
  email?: string;
  name?: string;
  profileUrl?: string;
}

// 로컬 개발 시 UI만 볼 때 쓰는 더미 데이터 (?preview=1)
const DEV_PREVIEW_SIGNUP: SignupLocationState = {
  registrationToken: 'dev-preview-registration-token',
  email: 'dodo7543@gmail.com',
  name: '조수빈',
};

export function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isDevPreview = import.meta.env.DEV && searchParams.get('preview') === '1';
  const state = (isDevPreview ? DEV_PREVIEW_SIGNUP : (location.state ?? {})) as SignupLocationState;

  // registrationToken 없이 직접 접근하면 정상 흐름이 아니므로 로그인으로 되돌린다.
  if (!state.registrationToken) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <>
      {isDevPreview ? (
        <p className="bg-amber-50 px-6 py-2 text-center text-xs text-amber-800">
          개발용 미리보기 — 마지막 제출(registerProfile)은 실제 토큰이 아니라 실패할 수 있어요
        </p>
      ) : null}
      <SignupFlow
        registrationToken={state.registrationToken}
        email={state.email ?? ''}
        name={state.name ?? ''}
        initialProfileUrl={state.profileUrl}
        onComplete={() => navigate('/', { replace: true })}
      />
    </>
  );
}
