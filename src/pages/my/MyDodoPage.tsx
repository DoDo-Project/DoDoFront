import { Link, useSearchParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import { PetListContent } from '@/features/pet-list';
import { MY_DODO_CONTENT_BY_KEY, getMyDodoMenuHref, getMyDodoMenuKeyFromSearch } from '@/pages/my/model/menu';
import { FamilyManagementContent } from '@/pages/my/ui/FamilyManagementContent';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyProfileEditContent } from '@/pages/my/ui/MyProfileEditContent';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { Skeleton } from '@/shared/ui';

function MyDodoContent({
  activeKey,
  isLoading = false,
}: {
  activeKey: ReturnType<typeof getMyDodoMenuKeyFromSearch>;
  isLoading?: boolean;
}) {
  const content = MY_DODO_CONTENT_BY_KEY[activeKey];
  const actionHref = activeKey === 'notifications' ? getMyDodoMenuHref(activeKey) : undefined;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="mt-4 h-8 w-56 rounded-lg" />
        </div>

        <div className="w-full overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm">
          <div className="px-6 py-6 sm:px-8">
            <Skeleton className="h-6 w-44 rounded-lg" />
            <div className="mt-4 max-w-2xl space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-7/12 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">{content.badge}</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">{content.title}</h1>
      </div>

      <div className="w-full overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]">
        <div className="border-b border-neutral-100 bg-linear-to-r from-brand/[0.04] via-white to-white px-6 py-5 sm:px-8">
          <h2 className="text-[18px] font-medium text-neutral-950">기능 준비 중</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">{content.description}</p>
        </div>

        <div className="flex min-h-[180px] flex-col gap-5 px-6 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl rounded-[16px] border border-neutral-200 bg-neutral-50/80 px-5 py-5">
            <p className="text-sm font-medium text-neutral-500">업데이트 예정</p>
            <p className="mt-2 text-sm leading-7 text-neutral-700">
              이 메뉴는 마이도도 전체 톤에 맞춰 순차적으로 연결하고 있어요. 기능이 준비되면 이 영역에서 바로 사용할 수
              있게 열릴 예정입니다.
            </p>
          </div>

          {actionHref ? (
            <Link
              to={actionHref}
              className="inline-flex h-10 min-w-28 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              {content.actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex h-10 min-w-28 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {content.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function MyDodoPage() {
  const [searchParams] = useSearchParams();
  const activeKey = getMyDodoMenuKeyFromSearch(searchParams.get('menu'));
  const { user, profileUrl, displayName, isLoading } = useCurrentUser();

  const content =
    activeKey === 'pet-list' ? (
      <PetListContent />
    ) : activeKey === 'family' ? (
      <FamilyManagementContent />
    ) : activeKey === 'profile-edit' ? (
      <MyProfileEditContent user={user} isLoading={isLoading} />
    ) : (
      <MyDodoContent activeKey={activeKey} isLoading={isLoading} />
    );

  return (
    <MyDodoLayout
      sidebar={
        <MyDodoSidebarPanel
          user={user}
          profileUrl={profileUrl}
          displayName={displayName}
          isLoading={isLoading}
          activeKey={activeKey}
        />
      }
      content={content}
    />
  );
}
