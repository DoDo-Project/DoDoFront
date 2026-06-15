import { useEffect, useRef, useState } from 'react';

import { loadNaverMap } from '@/shared/lib/naver-map/loadNaverMap';

import { useFenceBoundaries } from '../model/useFenceBoundaries';

const DEFAULT_CENTER = { lat: 37.5666103, lng: 126.9783882 };

export function WalkMap() {
  // useRef로 지도 요소와 인스턴스, 그려둔 원들 보관
  // 리렌더돼도 같은 지도 객체를 유지하고 다시 그릴 때 이전 원을 지우기
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null); // 생성된 지도 보관
  const circlesRef = useRef<naver.maps.Circle[]>([]); // 그려둔 원들 보관(나중에 지우려고)
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data } = useFenceBoundaries();

  // 1. 지도 생성 (최초 1회)
  useEffect(() => {
    let canceled = false;

    loadNaverMap()
      .then(() => {
        if (canceled || !mapElementRef.current) return;
        mapInstanceRef.current = new naver.maps.Map(mapElementRef.current, {
          center: new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          zoom: 15,
        });
        setIsMapReady(true);
      })
      .catch((e: unknown) => {
        if (!canceled) setError(e instanceof Error ? e.message : '지도를 불러오지 못했습니다.');
      });

    return () => {
      canceled = true;
      mapInstanceRef.current?.destroy();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. 울타리 원 그리기 (지도 준비됨 + 데이터 들어옴/바뀜)
  // 울타리 데이터는 나중에 도착하고 바뀔 수 있기 때문에
  // → [isMapReady, data] (데이터 올 때마다 다시 그림)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map || !data) return;

    // 이전에 그린 원 모두 제거
    circlesRef.current.forEach((circle) => circle.setMap(null));
    circlesRef.current = [];

    // 새로 그리기
    data.boundaries.forEach((fence) => {
      const circle = new naver.maps.Circle({
        map,
        center: new naver.maps.LatLng(fence.center.latitude, fence.center.longitude),
        radius: fence.radius,
        strokeColor: fence.isActive ? '#22c55e' : '#9ca3af', // 활성=초록, 비활성=회색
        strokeWeight: 2,
        fillColor: fence.isActive ? '#22c55e' : '#9ca3af',
        fillOpacity: 0.15,
      });
      circlesRef.current.push(circle);
    });

    // 첫 울타리로 지도 중심 이동
    const first = data.boundaries[0];
    if (first) {
      map.setCenter(new naver.maps.LatLng(first.center.latitude, first.center.longitude));
    }
  }, [isMapReady, data]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-red-50 p-6 text-sm text-red-500">
        {error}
      </div>
    );
  }

  return <div ref={mapElementRef} className="h-[500px] w-full overflow-hidden rounded-2xl" />;
}
