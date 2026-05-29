import type { ComponentType, SVGProps } from 'react';

import DeviceIcon from '@/pages/main/assets/device.svg?react';
import PetIcon from '@/pages/main/assets/pet.svg?react';
import ReportIcon from '@/pages/main/assets/report.svg?react';
import WalkIcon from '@/pages/main/assets/walk.svg?react';

export type QuickLinkItem = {
  id: string;
  label: string;
  to: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
};

/** 홈 화면 바로가기 메뉴(정적 네비게이션 설정, API 데이터 아님) */
export const QUICK_LINKS: QuickLinkItem[] = [
  { id: 'pet', label: '나의 반려동물', to: '/my', Icon: PetIcon },
  { id: 'walk', label: '산책 기록', to: '/walk', Icon: WalkIcon },
  { id: 'device', label: '디바이스 관리', to: '/my', Icon: DeviceIcon },
  { id: 'report', label: '레포트 보관함', to: '/my', Icon: ReportIcon },
];
