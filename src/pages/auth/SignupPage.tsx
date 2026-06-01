import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { SignupFlow } from '@/features/auth';

// 콜백에서 202 응답과 함께 넘겨주는 회원가입 컨텍스트
interface SignupLocationState {
  registrationToken?: string;
  email?: string;
  name?: string;
}

export function SignupPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state ?? {}) as SignupLocationState;

  // registrationToken 없이 직접 접근하면 정상 흐름이 아니므로 로그인으로 되돌린다.
  if (!state.registrationToken) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SignupFlow
      registrationToken={state.registrationToken}
      email={state.email ?? ''}
      name={state.name ?? ''}
      onComplete={() => navigate('/', { replace: true })}
    />
  );
}
