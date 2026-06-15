import { useEffect, useRef, useState } from 'react';

import { loadNaverMap } from '@/shared/lib/naver-map/loadNaverMap';

// 지도 기본 중심 좌표 (서울시청) — 나중에 펫 위치로 교체
const DEFAULT_CENTER = { lat: 37.5666103, lng: 126.9783882 };

export function WalkMap() {
  // 지도를 그릴 빈 div 참조
  const mapElementRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // useEffect 내에서 loadNaverMap() 호출 → new naver.maps.Map() 생성
    let map: naver.maps.Map | null = null;
    let canceled = false;

    loadNaverMap()
      .then(() => {
        // 스크립트 로드 사이에 언마운트됐거나 div가 없으면 중단
        if (canceled || !mapElementRef.current) return;

        map = new naver.maps.Map(mapElementRef.current, {
          center: new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          zoom: 15,
        });
      })
      .catch((e: unknown) => {
        if (!canceled) {
          setError(e instanceof Error ? e.message : '지도를 불러오지 못했습니다.');
        }
      });

    // 언마운트 시 정리
    return () => {
      // canceled 플래그 + map.destroy()로 페이지 나갈 때 깔끔하게 정리
      canceled = true;
      map?.destroy();
    };
  }, []);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-red-50 p-6 text-sm text-red-500">
        {error}
      </div>
    );
  }

  // 지도는 부모에 높이가 있어야 보여요 → 여기서 높이 지정
  return <div ref={mapElementRef} className="h-[500px] w-full overflow-hidden rounded-2xl" />;
}
