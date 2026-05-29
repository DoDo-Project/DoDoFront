export type NoticeTag = '안내' | '긴급';

export type NoticeItem = {
  id: number;
  tag: NoticeTag;
  title: string;
};

export type QuickLinkItem = {
  id: string;
  label: string;
  to: string;
};

export type HotTopicItem = {
  id: number;
  title: string;
};

export const NOTICES: NoticeItem[] = [
  { id: 1, tag: '안내', title: '겨울 시즌 산책 챌린지 오픈!' },
  { id: 2, tag: '긴급', title: '일부 알림 지연 현상 안내' },
  { id: 3, tag: '안내', title: '산책 중 위험 지역 사용자 제보 요청' },
  { id: 4, tag: '안내', title: '반려동물 프로필 개선 업데이트' },
  { id: 5, tag: '안내', title: '11월 6일 (목) 알려진 문제점 안내 (2025-11-06' },
];

export const QUICK_LINKS: QuickLinkItem[] = [
  { id: 'pet', label: '나의 반려동물', to: '/my' },
  { id: 'walk', label: '산책 기록', to: '/walk' },
  { id: 'device', label: '디바이스 관리', to: '/my' },
  { id: 'report', label: '레포트 보관함', to: '/my' },
];

export const HOT_TOPICS: HotTopicItem[] = [
  {
    id: 1,
    title: "A dog 'crazy' about ball play, is it really addicted to toys?",
  },
  {
    id: 2,
    title: 'Pets that lower dementia risk... does raising birds or fish help?',
  },
  {
    id: 3,
    title: "Jeju 'Cat Library' art festival opens to help cats.",
  },
  {
    id: 4,
    title: 'Amazing homing instinct of a dog that walked 400km over 6 months.',
  },
];
