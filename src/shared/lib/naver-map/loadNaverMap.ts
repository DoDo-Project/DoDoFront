import { env } from '@/shared/config';

let loadPromise: Promise<void> | null = null;

/** 네이버 지도 스크립트를 한 번만 로드하고, 완료 시 resolve */
export function loadNaverMap(): Promise<void> {
  // 이미 로드 완료된 경우
  if (window.naver?.maps) return Promise.resolve();

  // 로딩 중이면 같은 Promise 재사용 (중복 로드 방지)
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${env.NAVER_MAP_CLIENT_ID}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loadPromise = null; // 실패 시 다음에 재시도 가능하도록 초기화
      reject(new Error('네이버 지도 스크립트를 불러오지 못했습니다.'));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}
