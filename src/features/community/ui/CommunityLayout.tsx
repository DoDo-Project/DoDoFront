import type { ReactNode } from 'react';

interface CommunityLayoutProps {
  sidebar: ReactNode;
  content: ReactNode;
}

export function CommunityLayout({ sidebar, content }: CommunityLayoutProps) {
  return (
    <div className="rounded-[30px] border border-neutral-200/80 bg-linear-to-br from-[#fffaf6] via-white to-brand/[0.05] p-3 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:p-4">
      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-6 xl:self-start">{sidebar}</aside>

        <section className="min-w-0 rounded-[26px] border border-white/80 bg-neutral-50/90 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-6 lg:p-8">
          {content}
        </section>
      </div>
    </div>
  );
}
