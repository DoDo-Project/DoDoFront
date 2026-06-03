import { Link, useSearchParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import { MY_DODO_CONTENT_BY_KEY, getMyDodoMenuHref, getMyDodoMenuKeyFromSearch } from '@/pages/my/model/menu';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
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
      <div className="flex min-h-[320px] items-center">
        <div className="w-full overflow-hidden rounded-[24px] border border-neutral-200 bg-white">
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

            <Skeleton className="mt-8 h-12 w-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[320px] items-center">
      <div className="w-full overflow-hidden rounded-[24px] border border-neutral-200 bg-white">
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
              className="mt-8 inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              {content.actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="mt-8 inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
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
      content={<MyDodoContent activeKey={activeKey} isLoading={isLoading} />}
    />
  );
}
