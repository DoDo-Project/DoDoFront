import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth/model/useCurrentUser';
import {
  MY_DODO_CONTENT_BY_KEY,
  MY_DODO_DEFAULT_MENU_KEY,
  MY_DODO_MENU_ITEMS,
  type MyDodoMenuKey,
} from '@/pages/my/model/menu';
import { MyDodoLayout } from '@/pages/my/ui/MyDodoLayout';
import { MyDodoSidebarPanel } from '@/pages/my/ui/MyDodoSidebarPanel';

function MyDodoContent({ activeKey }: { activeKey: MyDodoMenuKey }) {
  const content = MY_DODO_CONTENT_BY_KEY[activeKey];
  const activeItem = MY_DODO_MENU_ITEMS.find((item) => item.key === activeKey);

  return (
    <div className="flex min-h-[300px] items-center">
      <div className="w-full rounded-[22px] border border-neutral-200 bg-neutral-50/70 px-6 py-10 text-center sm:px-8">
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">{content.badge}</p>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-900 sm:text-[28px]">{content.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-500 sm:text-base">{content.description}</p>

        {activeItem?.path ? (
          <Link
            to={activeItem.path}
            className="mt-7 inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            {content.actionLabel}
          </Link>
        ) : (
          <button
            type="button"
            className="mt-7 inline-flex min-w-40 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            {content.actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function MyDodoPage() {
  const { user, profileUrl, displayName, isLoading } = useCurrentUser();
  const [activeKey, setActiveKey] = useState<MyDodoMenuKey>(MY_DODO_DEFAULT_MENU_KEY);

  return (
    <MyDodoLayout
      sidebar={
        <MyDodoSidebarPanel
          user={user}
          profileUrl={profileUrl}
          displayName={displayName}
          isLoading={isLoading}
          activeKey={activeKey}
          onSelect={setActiveKey}
        />
      }
      content={<MyDodoContent activeKey={activeKey} />}
    />
  );
}
