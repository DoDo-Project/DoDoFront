import type { ReactNode } from 'react';

interface MyDodoLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export function MyDodoLayout({ sidebar, content }: MyDodoLayoutProps) {
  return (
    <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[308px_minmax(0,1fr)] xl:items-start">
      <aside className="xl:sticky xl:top-6">{sidebar}</aside>
      <section className="min-h-[640px] rounded-[28px] border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
        {content}
      </section>
    </div>
  );
}
