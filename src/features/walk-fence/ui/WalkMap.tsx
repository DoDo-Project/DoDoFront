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
  /** 실시간 펫 위치 (없으면 마커 숨김) */
  livePosition: { lat: number; lng: number; insideFence: boolean } | null;
}

const DEFAULT_CENTER = { lat: 37.5796, lng: 126.977 }; // 경복궁

// HTML 마커에 펫 이름을 넣기 전 간단한 이스케이프 (XSS 방지)
function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function petLabelContent(name: string, isActive: boolean): string {
  const color = isActive ? '#16a34a' : '#6b7280';
  return `<div style="transform:translate(-50%,-50%);white-space:nowrap;background:#fff;border:1px solid ${color};border-radius:9999px;padding:2px 8px;font-size:12px;font-weight:600;color:${color};box-shadow:0 1px 2px rgba(0,0,0,.12)">${escapeHtml(name)}</div>`;
}

// 실시간 위치 점 마커 (울타리 안=초록, 밖=빨강)
function liveMarkerContent(insideFence: boolean): string {
  const color = insideFence ? '#22c55e' : '#ef4444';
  return `<div style="transform:translate(-50%,-50%);width:16px;height:16px;border-radius:9999px;background:${color};border:3px solid #fff;box-shadow:0 0 0 5px ${color}33"></div>`;
}

export function WalkMap({ boundaries, draftCenter, draftRadius, onMapClick, livePosition }: WalkMapProps) {
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<naver.maps.Map | null>(null);
  const circlesRef = useRef<naver.maps.Circle[]>([]); // 기존 울타리 원들
  const markersRef = useRef<naver.maps.Marker[]>([]); // 펫 이름 라벨들
  const draftCircleRef = useRef<naver.maps.Circle | null>(null); // 미리보기 원
  const liveMarkerRef = useRef<naver.maps.Marker | null>(null); // 실시간 위치 마커
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

  // 2. 기존 울타리 원 + 펫 이름 라벨 그리기 (데이터 바뀔 때마다)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map) return;

    // 이전 원/라벨 제거
    circlesRef.current.forEach((circle) => circle.setMap(null));
    circlesRef.current = [];
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    boundaries.forEach((fence) => {
      const center = new naver.maps.LatLng(fence.center.latitude, fence.center.longitude);

      const circle = new naver.maps.Circle({
        map,
        center,
        radius: fence.radius,
        strokeColor: fence.isActive ? '#22c55e' : '#9ca3af', // 활성=초록, 비활성=회색
        strokeWeight: 2,
        fillColor: fence.isActive ? '#22c55e' : '#9ca3af',
        fillOpacity: 0.15,
      });
      circlesRef.current.push(circle);

      // 울타리 중심에 펫 이름 라벨
      const marker = new naver.maps.Marker({
        map,
        position: center,
        icon: {
          content: petLabelContent(fence.petName, fence.isActive),
          anchor: new naver.maps.Point(0, 0),
        },
      });
      markersRef.current.push(marker);
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
  }, [isMapReady, draftCenter, draftRadius]);

  // 3-1. 지도 중심 이동은 draftCenter가 바뀔 때만 (반경 조절 시 스냅 방지)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map || !draftCenter) return;
    map.setCenter(new naver.maps.LatLng(draftCenter.lat, draftCenter.lng));
  }, [isMapReady, draftCenter]);

  // 4. 실시간 펫 위치 마커 (위치 올 때마다 갱신)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!isMapReady || !map) return;

    // 이전 마커 제거 후 다시 그림 (마커 1개라 부담 없음)
    liveMarkerRef.current?.setMap(null);
    liveMarkerRef.current = null;

    if (!livePosition) return;

    liveMarkerRef.current = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(livePosition.lat, livePosition.lng),
      icon: {
        content: liveMarkerContent(livePosition.insideFence),
        anchor: new naver.maps.Point(0, 0),
      },
    });
  }, [isMapReady, livePosition]);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-50 p-6 text-sm text-red-500">{error}</div>
    );
  }

  return <div ref={mapElementRef} className="h-full w-full" />;
}
