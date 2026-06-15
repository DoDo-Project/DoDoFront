import { useEffect, useState } from 'react';

import { createStompClient } from '@/shared/lib/socket/stompClient';

import type { LiveLocationMessage, LiveLocationPayload } from './types';

/** 특정 펫의 실시간 위치를 구독 (petId 없으면 연결 안 함) */
export function useLiveLocation(petId: number | null) {
  const [location, setLocation] = useState<LiveLocationPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // petId가 바뀌면 이전 펫 위치를 초기화 (렌더 중 조정 — effect 내 setState 회피)
  const [trackedPetId, setTrackedPetId] = useState(petId);
  if (petId !== trackedPetId) {
    setTrackedPetId(petId);
    setLocation(null);
    setIsConnected(false);
  }

  useEffect(() => {
    if (petId == null) return;

    const client = createStompClient();

    // 연결 성공 시 구독 시작
    client.onConnect = () => {
      setIsConnected(true);
      client.subscribe(`/sub/fence/location/${petId}`, (frame) => {
        try {
          const message = JSON.parse(frame.body) as LiveLocationMessage;
          setLocation(message.payload); // 감싸진 payload만 꺼내 저장
        } catch {
          // JSON 파싱 실패는 무시
        }
      });
    };

    // 연결 끊기면 표시
    client.onWebSocketClose = () => {
      setIsConnected(false);
    };

    client.activate(); // 연결 시작

    // 언마운트 / petId 변경 시 연결 해제
    return () => {
      void client.deactivate();
    };
  }, [petId]);

  return { location, isConnected };
}
