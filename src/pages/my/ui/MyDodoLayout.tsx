import type { ReactNode } from 'react';

interface MyDodoLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export function MyDodoLayout({ sidebar, content }: MyDodoLayoutProps) {
  return (
    <div className="rounded-[24px] border border-neutral-200/80 bg-linear-to-br from-neutral-50 via-white to-brand/[0.03] p-3 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-4">
      <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[280px_minmax(0,1fr)] xl:items-stretch">
        <aside className="xl:sticky xl:top-6 xl:self-start">{sidebar}</aside>
        <section className="min-h-[360px] rounded-[22px] border border-white/80 bg-neutral-50/85 p-6 shadow-[0_12px_28px_rgba(15,23,42,0.04)] backdrop-blur-sm xl:h-full sm:p-7">
          {content}
        </section>
      </div>
    </div>
  );
}
