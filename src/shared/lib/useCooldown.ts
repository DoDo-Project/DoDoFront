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
  const isActive = seconds > 0;

  // isActive(쿨다운 진행 여부)가 바뀔 때만 타이머를 재설정해 매초 재생성되지 않도록 한다.
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSeconds((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  return { seconds, start: setSeconds };
}
