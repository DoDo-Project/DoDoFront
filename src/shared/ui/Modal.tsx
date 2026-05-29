// 모든 모달이 공통으로 갖는 기본 레이아웃
import { useEffect, type ReactNode } from 'react';

import { usePresence } from '@/shared/lib/usePresence';

import { CloseButton } from './CloseButton';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 스크린리더용 대화상자 라벨 */
  ariaLabel?: string;
}

export function Modal({ open, onClose, children, ariaLabel }: ModalProps) {
  const { isRendered, isVisible, handleTransitionEnd } = usePresence(open);

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

  if (!isRendered) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
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
        {children}
      </div>
    </div>
  );
}
