// 네이버 지도(NCP Maps) 전역 타입 — 우선 지도 표시에 필요한 최소만 선언
declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
  }

  interface MapOptions {
    center: LatLng;
    zoom?: number;
  }

  class Map {
    constructor(element: string | HTMLElement, options: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number): void;
    destroy(): void;
  }

  interface CircleOptions {
    map?: Map;
    center: LatLng;
    /** 반경(미터) */
    radius: number;
    strokeColor?: string;
    strokeWeight?: number;
    strokeOpacity?: number;
    fillColor?: string;
    fillOpacity?: number;
  }

  class Circle {
    constructor(options: CircleOptions);
    setMap(map: Map | null): void;
    setCenter(center: LatLng): void;
    setRadius(radius: number): void;
  }
}

// window.naver 로 접근할 수 있게 augment
interface Window {
  naver: typeof naver;
}
