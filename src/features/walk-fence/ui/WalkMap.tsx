import { useEffect, useRef, useState } from 'react';

import { loadNaverMap } from '@/shared/lib/naver-map/loadNaverMap';

import type { FenceBoundary } from '../model/types';

interface DraftCenter {
  lat: number;
  lng: number;
}

interface WalkMapProps {
  /** 지도에 그릴 기존 울타리 목록 */
  boundaries: FenceBoundary[];
  /** 생성/수정 미리보기용 중심 (없으면 미리보기 원 숨김) */
  draftCenter: DraftCenter | null;
  /** 미리보기 원 반경(미터) */
  draftRadius: number;
  /** 지도 클릭 시 좌표 콜백 */
  onMapClick: (lat: number, lng: number) => void;
}

const DEFAULT_CENTER = { lat: 37.5796, lng: 126.977 }; // 경복궁

export function WalkMap({ boundaries, draftCenter, draftRadius, onMapClick }: WalkMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const circlesRef = useRef<naver.maps.Circle[]>([]); // 기존 울타리 원들
  const draftCircleRef = useRef<naver.maps.Circle | null>(null); // 미리보기 원
  const onMapClickRef = useRef(onMapClick); // 항상 최신 콜백 보관
  const [isMapReady, setIsMapReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 리스너를 다시 달지 않고도 최신 onMapClick을 부르도록 ref만 갱신
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // 1. 지도 생성 + 클릭 리스너 (최초 1회)
  useEffect(() => {
    let canceled = false;

    loadNaverMap()
      .then(() => {
        if (canceled || !mapElementRef.current) return;

        const map = new naver.maps.Map(mapElementRef.current, {
          center: new naver.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
          zoom: 15,
        });

        // 지도를 클릭하면 그 좌표를 콜백으로 올려보냄
        map.addListener('click', (event) => {
          onMapClickRef.current(event.coord.lat(), event.coord.lng());
        });

        mapInstanceRef.current = map;
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

  // 2. 기존 울타리 원 그리기 (데이터 바뀔 때마다)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map) return;

    circlesRef.current.forEach((circle) => circle.setMap(null));
    circlesRef.current = [];

    boundaries.forEach((fence) => {
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
  }, [isMapReady, boundaries]);

  // 3. 미리보기(점선) 원 그리기/갱신
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map) return;

    // 중심이 없으면 미리보기 원 제거
    if (!draftCenter) {
      draftCircleRef.current?.setMap(null);
      draftCircleRef.current = null;
      return;
    }

    const center = new naver.maps.LatLng(draftCenter.lat, draftCenter.lng);

    if (draftCircleRef.current) {
      // 이미 있으면 위치/반경만 갱신
      draftCircleRef.current.setCenter(center);
      draftCircleRef.current.setRadius(draftRadius);
    } else {
      draftCircleRef.current = new naver.maps.Circle({
        map,
        center,
        radius: draftRadius,
        strokeColor: '#f59e0b',
        strokeWeight: 2,
        strokeStyle: 'shortdash',
        fillColor: '#f59e0b',
        fillOpacity: 0.12,
      });
    }

    map.setCenter(center);
  }, [isMapReady, draftCenter, draftRadius]);

  if (error) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-2xl bg-red-50 p-6 text-sm text-red-500">
        {error}
      </div>
    );
  }

  return <div ref={mapElementRef} className="h-[500px] w-full overflow-hidden rounded-2xl" />;
}
