import type { ReactNode } from 'react';

interface MyDodoLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export function MyDodoLayout({ sidebar, content }: MyDodoLayoutProps) {
  return (
    <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
      <aside className="xl:sticky xl:top-6">{sidebar}</aside>
      <section className="min-h-[360px] rounded-[24px] border border-neutral-200 bg-white p-6 shadow-sm sm:p-7">
        {content}
      </section>
    </div>
  );
}
