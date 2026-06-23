import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ToastTone = 'default' | 'success' | 'error';

interface ToastProps {
  open: boolean;
  message: string;
  onClose: () => void;
  tone?: ToastTone;
  /** 자동 사라짐 시간(ms) */
  duration?: number;
}

const TONE_CLASS: Record<ToastTone, string> = {
  default: 'bg-neutral-950 text-white',
  success: 'bg-neutral-950 text-white',
  error: 'bg-red-500 text-white',
};

export function Toast({ open, message, onClose, tone = 'default', duration = 3000 }: ToastProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => onCloseRef.current(), duration);
    return () => clearTimeout(timer);
  }, [open, duration, message]);

  if (!open) return null;

  return createPortal(
    <div className="fixed left-1/2 top-6 z-60 -translate-x-1/2 px-4">
      <div
        role="status"
        className={`rounded-2xl px-5 py-3 text-sm font-medium shadow-[0_18px_42px_rgba(15,23,42,0.18)] ${TONE_CLASS[tone]}`}
      >
        {message}
      </div>
    </div>,
    document.body,
  );
}
