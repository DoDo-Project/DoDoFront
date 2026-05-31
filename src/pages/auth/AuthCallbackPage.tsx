import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

import { clearStoredState, getStoredState, parseProvider } from '@/features/auth';

type Status = 'loading' | 'error';

export function AuthCallbackPage() {
  const { provider: providerParam } = useParams();
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  // StrictMode에서 effect가 두 번 실행되어 state가 중복 소비되는 것을 방지
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    // 콜백 처리는 STEP 4에서 비동기(API 호출)로 확장되므로 async 함수로 감싼다.
    // effect 본문에서 직접 setState하면 렌더가 연쇄되어 린트 규칙에 걸리므로 async 함수 안에서 처리한다.
    const processCallback = async () => {
      const provider = parseProvider(providerParam);
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const storedState = getStoredState();
      clearStoredState();

      if (!provider) {
        setStatus('error');
        setMessage('지원하지 않는 로그인 방식이에요.');
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('인가 코드를 받지 못했어요. 다시 시도해주세요.');
        return;
      }

      if (!state || state !== storedState) {
        setStatus('error');
        setMessage('잘못된 접근이에요. 다시 시도해주세요.');
        return;
      }

      // TODO(STEP 4): socialLogin(provider, code) 호출 → 200(로그인)/202(회원가입) 분기
    };

    void processCallback();
  }, [providerParam, searchParams]);

  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-base text-neutral-700">{message}</p>
        <Link
          to="/"
          className="rounded-[10px] bg-brand px-5 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-brand" aria-hidden />
      <p className="text-sm text-neutral-500">사용자 정보를 확인 중이에요...</p>
    </div>
  );
}
