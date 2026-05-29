import { useEffect, useState, type TransitionEvent } from 'react';

import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';
import { CloseButton } from '@/shared/ui';

import type { SocialProvider } from '../model/types';
import { SocialLoginButton } from './SocialLoginButton';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSelectProvider?: (provider: SocialProvider) => void;
}

export function LoginModal({ open, onClose, onSelectProvider }: LoginModalProps) {
  // 퇴장 애니메이션이 끝날 때까지 DOM을 유지하기 위한 마운트 상태
  const [isRendered, setIsRendered] = useState(open);
  // 트랜지션 트리거용 가시성 상태
  const [isVisible, setIsVisible] = useState(false);

  // open 변화에 따른 상태 보정. effect 안에서 동기로 setState하면 렌더가 연쇄되므로 렌더 중 처리한다.
  if (open && !isRendered) {
    setIsRendered(true);
  }
  if (!open && isVisible) {
    setIsVisible(false);
  }

  // 마운트된 다음 프레임에 등장 트랜지션을 시작한다. (rAF 콜백 내 setState는 지연 실행이라 허용)
  useEffect(() => {
    if (!isRendered || !open) return;
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [isRendered, open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // 패널 자신의 퇴장 트랜지션이 끝나면 DOM에서 제거한다. (자식 요소의 트랜지션 버블링은 무시)
  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !open) {
      setIsRendered(false);
    }
  };

  if (!isRendered) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-500 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden
      />

      <div
        onTransitionEnd={handleTransitionEnd}
        className={`relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl transition-all duration-500 ease-out ${
          isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
        }`}
      >
        <CloseButton onClick={onClose} className="absolute right-4 top-4" />

        <div className="mb-6 text-center">
          <DoDoLogo className="mx-auto h-14 w-auto" />
          <p className="mt-4 text-[16px] font-regular select-none">건강, 안전, 즐거움을 하나로 묶다!</p>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <SocialLoginButton provider="NAVER" onClick={onSelectProvider} />
          <SocialLoginButton provider="GOOGLE" onClick={onSelectProvider} />
        </div>
      </div>
    </div>
  );
}
