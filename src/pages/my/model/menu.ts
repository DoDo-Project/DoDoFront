export type MyDodoMenuSection = 'pet' | 'account';

export type MyDodoMenuKey =
  | 'pet-list'
  | 'device'
  | 'family'
  | 'walk-history'
  | 'ai-report'
  | 'profile-edit'
  | 'notifications'
  | 'logout';

export interface MyDodoMenuItem {
  key: MyDodoMenuKey;
  label: string;
  section: MyDodoMenuSection;
  path?: string;
}

export interface MyDodoContent {
  badge: string;
  title: string;
  description: string;
  actionLabel: string;
}

export const MY_DODO_DEFAULT_MENU_KEY: MyDodoMenuKey = 'pet-list';

export const MY_DODO_SECTION_LABELS: Record<MyDodoMenuSection, string> = {
  pet: '반려동물',
  account: '회원정보',
};

export const MY_DODO_MENU_ITEMS: MyDodoMenuItem[] = [
  { key: 'pet-list', label: '반려동물 리스트', section: 'pet' },
  { key: 'device', label: '디바이스 관리', section: 'pet' },
  { key: 'family', label: '가족 관리', section: 'pet' },
  { key: 'walk-history', label: '산책 기록', section: 'pet' },
  { key: 'ai-report', label: 'AI 레포트', section: 'pet' },
  { key: 'profile-edit', label: '회원정보 수정', section: 'account' },
  { key: 'notifications', label: '알림함', section: 'account', path: '/my/notifications' },
  { key: 'logout', label: '로그아웃', section: 'account' },
];

export const MY_DODO_CONTENT_BY_KEY: Record<MyDodoMenuKey, MyDodoContent> = {
  'pet-list': {
    badge: 'PET',
    title: '등록된 반려동물이 없습니다',
    description: '반려동물을 등록하면 이곳에서 목록과 상세 정보를 한눈에 관리할 수 있어요.',
    actionLabel: '등록하기',
  },
  device: {
    badge: 'DEVICE',
    title: '디바이스 관리 준비 중',
    description: '연결된 디바이스 상태 확인과 재등록 기능이 이 영역에 들어올 예정입니다.',
    actionLabel: '기능 준비 중',
  },
  family: {
    badge: 'FAMILY',
    title: '가족 관리 준비 중',
    description: '가족 초대, 신청 내역, 승인 및 거절 기능을 이 화면에서 관리하게 됩니다.',
    actionLabel: '기능 준비 중',
  },
  'walk-history': {
    badge: 'WALK',
    title: '산책 기록 준비 중',
    description: '산책 기록과 요약 정보를 나중에 이 영역에서 확인할 수 있도록 구성할 예정입니다.',
    actionLabel: '기능 준비 중',
  },
  'ai-report': {
    badge: 'REPORT',
    title: 'AI 레포트 준비 중',
    description: '반려동물 데이터를 바탕으로 한 AI 레포트가 이 패널에 노출될 예정입니다.',
    actionLabel: '기능 준비 중',
  },
  'profile-edit': {
    badge: 'ACCOUNT',
    title: '회원정보 수정 준비 중',
    description: '사용자 기본 정보와 계정 관련 설정을 수정할 수 있도록 확장할 예정입니다.',
    actionLabel: '기능 준비 중',
  },
  notifications: {
    badge: 'NOTICE',
    title: '알림함 준비 중',
    description: '헤더 프로필 메뉴와 같은 알림함 화면으로 연결되도록 구조를 정리했습니다.',
    actionLabel: '알림함 열기',
  },
  logout: {
    badge: 'SESSION',
    title: '로그아웃 연결 예정',
    description: '다음 단계에서 실제 로그아웃 동작과 인증 정보 정리 흐름을 연결할 예정입니다.',
    actionLabel: '기능 준비 중',
  },
};

export function getMyDodoMenuKeyByPathname(pathname: string): MyDodoMenuKey {
  const matched = MY_DODO_MENU_ITEMS.find((item) => item.path && pathname.startsWith(item.path));
  return matched?.key ?? MY_DODO_DEFAULT_MENU_KEY;
}
