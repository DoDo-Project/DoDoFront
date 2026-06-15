import { Client } from '@stomp/stompjs';

import { env } from '@/shared/config';
import { getAccessToken } from '@/shared/lib/auth/token';

/** 설정이 끝난 STOMP 클라이언트를 생성 (구독은 사용하는 쪽에서) */
export function createStompClient(): Client {
  const client = new Client({
    brokerURL: env.WS_URL, // wss://... 로 직접 연결 (SockJS 미사용)
    reconnectDelay: 5000, // 연결 끊기면 5초 후 자동 재연결
    heartbeatIncoming: 10000, // 서버 ↔ 클라이언트 연결 살아있는지 확인(10초)
    heartbeatOutgoing: 10000,
    beforeConnect: () => {
      // 연결 직전마다 최신 토큰을 헤더에 실음 (재연결 시 갱신된 토큰 반영)
      // 생성 시점에 넣으면 토큰 만료 시 갱신된 토큰이 반영되지 않음
      client.connectHeaders = {
        Authorization: `Bearer ${getAccessToken() ?? ''}`,
      };
    },
  });

  return client;
}
