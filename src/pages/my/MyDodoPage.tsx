import { useState } from 'react';

import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import type { MyDodoMenuKey } from '@/pages/my/model/menu';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoProfileCard } from '@/pages/my/ui/MyDodoProfileCard';
import { MyDodoSidebar } from '@/pages/my/ui/MyDodoSidebar';

const DEFAULT_MENU_KEY: MyDodoMenuKey = 'pet-list';

const MENU_CONTENT: Record<MyDodoMenuKey, { badge: string; title: string; description: string; actionLabel: string }> =
  {
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
      description: '알림 설정과 수신 내역 확인이 가능한 화면으로 이어질 예정입니다.',
      actionLabel: '기능 준비 중',
    },
    logout: {
      badge: 'SESSION',
      title: '로그아웃 연결 예정',
      description: '다음 단계에서 실제 로그아웃 동작과 인증 정보 정리 흐름을 연결할 예정입니다.',
      actionLabel: '기능 준비 중',
    },
  };

function MyDodoContent({ activeKey }: { activeKey: MyDodoMenuKey }) {
  const content = MENU_CONTENT[activeKey];

  return (
    <div className="flex min-h-[300px] items-center">
      <div className="w-full rounded-[22px] border border-neutral-200 bg-neutral-50/70 px-6 py-10 text-center sm:px-8">
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">{content.badge}</p>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-[28px]">{content.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">{content.description}</p>
        <button
          type="button"
          className="mt-7 inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          {content.actionLabel}
        </button>
      </div>
    </div>
  );
}

export function MyDodoPage() {
  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const [activeKey, setActiveKey] = useState<MyDodoMenuKey>(DEFAULT_MENU_KEY);

  return (
    <MyDodoLayout
      sidebar={
        <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-6 shadow-sm">
          <MyDodoProfileCard user={user} profileUrl={profileUrl} displayName={displayName} isLoading={isLoading} />
          <MyDodoSidebar activeKey={activeKey} onSelect={setActiveKey} />
        </div>
      }
      content={<MyDodoContent activeKey={activeKey} />}
    />
  );
}
