import { useEffect, useState } from 'react';

import type { InvitationCodeState } from './types';

export function useRemainingSeconds(activeCode: InvitationCodeState | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!activeCode) return;

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeCode]);

  if (!activeCode) {
    return 0;
  }

  const elapsedSeconds = Math.floor((now - activeCode.createdAt) / 1000);
  return Math.max(0, activeCode.expiresIn - elapsedSeconds);
}
