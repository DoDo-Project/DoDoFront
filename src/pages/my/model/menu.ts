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
}

export const MY_DODO_MENU_ITEMS: MyDodoMenuItem[] = [
  { key: 'pet-list', label: '반려동물 리스트', section: 'pet' },
  { key: 'device', label: '디바이스 관리', section: 'pet' },
  { key: 'family', label: '가족 관리', section: 'pet' },
  { key: 'walk-history', label: '산책 기록', section: 'pet' },
  { key: 'ai-report', label: 'AI 레포트', section: 'pet' },
  { key: 'profile-edit', label: '회원정보 수정', section: 'account' },
  { key: 'notifications', label: '알림함', section: 'account' },
  { key: 'logout', label: '로그아웃', section: 'account' },
];
