// 모든 모달이 공통으로 갖는 기본 레이아웃
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

import { usePresence } from '@/shared/lib/usePresence';

import { CloseButton } from './CloseButton';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** 스크린리더용 대화상자 라벨 */
  ariaLabel?: string;
  panelClassName?: string;
}

export function Modal({ open, onClose, children, ariaLabel, panelClassName = '' }: ModalProps) {
  const { isRendered, isVisible, handleTransitionEnd } = usePresence(open);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [open, onClose]);

  if (!isRendered) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto p-4" role="dialog" aria-modal="true" aria-label={ariaLabel}>
      <div
        className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden
      />

      <div className="flex min-h-full items-center justify-center">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`relative w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl transition-all duration-500 ease-out ${panelClassName} ${
            isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-3 scale-95 opacity-0'
          }`}
        >
          <CloseButton onClick={onClose} className="absolute right-4 top-4" />
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
