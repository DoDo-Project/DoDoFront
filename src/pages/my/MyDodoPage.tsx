import { Link, useSearchParams } from 'react-router-dom';

import { useCurrentUser, usePetList } from '@/features/auth';
import { MY_DODO_CONTENT_BY_KEY, getMyDodoMenuHref, getMyDodoMenuKeyFromSearch } from '@/pages/my/model/menu';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';
import { PetListPanel } from '@/pages/my/ui/PetListPanel';
import { getApiErrorMessage, getApiErrorStatus } from '@/shared/lib/api/errorMessage';
import { Skeleton } from '@/shared/ui';

const PET_LIST_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '요청 값을 다시 확인해 주세요.',
  401: '로그인이 필요한 기능입니다. 다시 로그인해 주세요.',
  403: '반려동물 목록을 조회할 권한이 없습니다.',
  404: '사용자 정보를 찾을 수 없습니다.',
  500: '반려동물 목록 조회 중 서버 오류가 발생했습니다.',
};

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
      <div className="flex min-h-[320px] items-center">
        <div className="w-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
            <Skeleton className="h-3 w-14 rounded-md" />
            <Skeleton className="mt-4 h-8 w-64 rounded-lg" />
          </div>

          <div className="px-6 py-8 sm:px-8">
            <div className="max-w-2xl space-y-3">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-11/12 rounded-md" />
              <Skeleton className="h-4 w-7/12 rounded-md" />
            </div>

            <Skeleton className="mt-4 h-12 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[320px] items-center">
      <div className="w-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white">
        <div className="border-b border-neutral-100 bg-gradient-to-r from-brand/8 via-white to-white px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-brand">{content.badge}</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900 sm:text-[28px]">{content.title}</h1>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm leading-7 text-neutral-600 sm:text-base">{content.description}</p>
          </div>

          {actionHref ? (
            <Link
              to={actionHref}
              className="mt-4 inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              {content.actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-4 inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {content.actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PetListEmptyState() {
  return (
    <section className="flex h-full items-start">
      <div className="w-full overflow-hidden rounded-[16px] border border-neutral-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top,rgba(229,108,49,0.1),transparent_40%)] px-6 py-12 text-center sm:px-8 sm:py-14">
          <p className="text-[16px] font-medium leading-8 text-neutral-950 sm:text-[18px]">
            현재 등록된 반려동물이 없습니다.
          </p>

          <Link
            to="/my/pets/new"
            className="mt-4 inline-flex min-w-56 items-center justify-center rounded-2xl bg-brand px-8 py-4 text-[16px] font-medium text-brand-foreground transition-opacity hover:opacity-90"
          >
            등록하기
          </Link>
        </div>
      </div>
    </section>
  );
}

function PetListErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(
    error,
    '잠시 후 다시 시도해 주세요. 문제가 계속되면 네트워크 상태와 로그인 정보를 함께 확인해 주세요.',
    PET_LIST_STATUS_MESSAGES,
  );

  return (
    <div className="flex min-h-[320px] items-center">
      <div className="w-full overflow-hidden rounded-[16px] border border-red-100 bg-white">
        <div className="border-b border-red-100 bg-red-50 px-6 py-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.24em] text-red-500">{status ? `ERROR ${status}` : 'ERROR'}</p>
          <h1 className="mt-3 text-2xl font-semibold text-neutral-900 sm:text-[28px]">
            반려동물 목록을 불러오지 못했습니다
          </h1>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm leading-7 text-neutral-600 sm:text-base">{message}</p>
          </div>

          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-w-32 items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}

function PetListContent() {
  const { data, isLoading, isError, error, refetch, isFetching } = usePetList({ page: 0, size: 10 });

  if (isLoading) {
    return <MyDodoContent activeKey="pet-list" isLoading />;
  }

  if (isError) {
    return <PetListErrorState error={error} onRetry={() => void refetch()} />;
  }

  if (!data || data.pets.length === 0) {
    return <PetListEmptyState />;
  }

  return <PetListPanel pets={data.pets} totalElements={data.totalElements} isRefreshing={isFetching} />;
}

export function MyDodoPage() {
  const [searchParams] = useSearchParams();
  const activeKey = getMyDodoMenuKeyFromSearch(searchParams.get('menu'));
  const { user, profileUrl, displayName, isLoading } = useCurrentUser();

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
      content={activeKey === 'pet-list' ? <PetListContent /> : <MyDodoContent activeKey={activeKey} />}
    />
  );
}
