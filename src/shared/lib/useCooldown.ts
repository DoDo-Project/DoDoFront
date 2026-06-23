import { useEffect, useState } from 'react';

interface UseCooldownResult {
  /** 남은 초 (0이면 쿨다운 종료) */
  seconds: number;
  /** 지정한 초만큼 쿨다운 시작 */
  start: (durationSeconds: number) => void;
}

/** 초 단위 카운트다운 쿨다운 (재발송 제한 등) */
export function useCooldown(): UseCooldownResult {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  return { seconds, start: setSeconds };
}
