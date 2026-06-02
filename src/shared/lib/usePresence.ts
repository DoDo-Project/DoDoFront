// 모달이 언제 나타나고 사라질지 타이밍 관리
import { useEffect, useState, type TransitionEvent } from 'react';

interface Presence {
  /** DOM에 렌더할지 여부 (퇴장 트랜지션이 끝나면 false) */
  isRendered: boolean;
  /** 등장 트랜지션 클래스 적용 여부 */
  isVisible: boolean;
  /** 퇴장 트랜지션 종료 시 언마운트하기 위해 트랜지션 대상 요소에 연결 */
  handleTransitionEnd: (event: TransitionEvent<HTMLElement>) => void;
}

/**
 * open 상태에 맞춰 마운트/언마운트 타이밍과 등장·퇴장 트랜지션을 관리
 * 퇴장 시 트랜지션이 끝날 때까지 DOM을 유지
 */
export function usePresence(open: boolean): Presence {
  // 퇴장 애니메이션이 끝날 때까지 DOM을 유지하기 위한 마운트 상태
  const [isRendered, setIsRendered] = useState(open);
  // 트랜지션 트리거용 가시성 상태
  const [isVisible, setIsVisible] = useState(false);

  // open 변화에 따른 상태 보정. effect 안에서 동기로 setState하면 렌더가 연쇄되므로 렌더 중 처리
  if (open && !isRendered) {
    setIsRendered(true);
  }
  if (!open && isVisible) {
    setIsVisible(false);
  }

  // 마운트된 다음 프레임에 등장 트랜지션을 시작 (rAF 콜백 내 setState는 지연 실행이라 허용)
  useEffect(() => {
    if (!isRendered || !open) return;
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [isRendered, open]);

  // 대상 요소 자신의 퇴장 트랜지션이 끝나면 DOM에서 제거 (자식 요소의 트랜지션 버블링은 무시)
  const handleTransitionEnd = (event: TransitionEvent<HTMLElement>) => {
    if (event.target === event.currentTarget && !open) {
      setIsRendered(false);
    }
  };

  return { isRendered, isVisible, handleTransitionEnd };
}
