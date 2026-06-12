import type { ReactNode } from 'react';

interface CommunityLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  sidebar?: ReactNode;
  content: ReactNode;
}

export function CommunityLayout({ eyebrow, title, description, sidebar, content }: CommunityLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">{eyebrow}</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-600">{description}</p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">{content}</div>
        {sidebar ? <aside className="space-y-6">{sidebar}</aside> : null}
      </div>
    </div>
  );
}
