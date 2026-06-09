import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import {
  AuthErrorScreen,
  AuthLoadingScreen,
  clearStoredReturnTo,
  clearStoredState,
  getStoredReturnTo,
  getStoredState,
  parseProvider,
  redirectToSocialLogin,
  resolveApiAuthError,
  resolveClientAuthError,
  socialLogin,
  type AuthErrorPresentation,
  type SocialProvider,
} from '@/features/auth';
import { SOCIAL_LOGIN_STATUS_MESSAGES } from '@/features/auth/lib/apiErrorMessages';
import { setTokens } from '@/shared/lib/auth/token';

type Status = 'loading' | 'error';

const PROVIDER_LABEL: Record<SocialProvider, string> = {
  NAVER: '네이버',
  GOOGLE: '구글',
};

export function AuthCallbackPage() {
  const { provider: providerParam } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<Status>('loading');
  const [errorPresentation, setErrorPresentation] = useState<AuthErrorPresentation | null>(null);
  const [retryProvider, setRetryProvider] = useState<SocialProvider | null>(null);

  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    const processCallback = async () => {
      const provider = parseProvider(providerParam);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = getStoredState();
      const returnTo = getStoredReturnTo();
      clearStoredState();

      if (provider) {
        setRetryProvider(provider);
      }

      if (!provider) {
        setStatus('error');
        setErrorPresentation(resolveClientAuthError('invalid_provider'));
        return;
      }

      if (!code) {
        setStatus('error');
        setErrorPresentation(resolveClientAuthError('missing_code'));
        return;
      }

      if (!state || state !== storedState) {
        setStatus('error');
        setErrorPresentation(resolveClientAuthError('invalid_state'));
        return;
      }

      try {
        const result = await socialLogin(provider, code);

        if (result.kind === 'LOGIN') {
          setTokens(result.data);
          const nextPath = returnTo ?? '/';
          clearStoredReturnTo();
          navigate(nextPath, { replace: true });
          return;
        }

        navigate('/auth/signup', {
          replace: true,
          state: {
            registrationToken: result.data.registrationToken,
            email: result.data.email,
            name: result.data.name,
            profileUrl: result.data.profileUrl,
          },
        });
      } catch (error) {
        console.error('[social-login] 실패', error);
        setStatus('error');
        setErrorPresentation(
          resolveApiAuthError(error, '로그인에 실패했어요. 잠시 후 다시 시도해주세요.', SOCIAL_LOGIN_STATUS_MESSAGES),
        );
      }
    };

    void processCallback();
  }, [navigate, providerParam, searchParams]);

  const provider = parseProvider(providerParam);
  const providerLabel = provider ? PROVIDER_LABEL[provider] : null;

  if (status === 'error' && errorPresentation) {
    return (
      <AuthErrorScreen
        presentation={errorPresentation}
        retryProvider={retryProvider}
        onRetrySocial={redirectToSocialLogin}
      />
    );
  }

  return (
    <AuthLoadingScreen
      title="로그인을 확인하고 있어요"
      message="선택한 소셜 계정 정보를 안전하게 불러오는 중입니다."
      stepLabel={providerLabel ? `${providerLabel} 로그인 연동 중` : undefined}
    />
  );
}
