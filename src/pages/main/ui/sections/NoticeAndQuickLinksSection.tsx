import { Link } from 'react-router-dom';

import { NOTICES, type NoticeTag } from '@/pages/main/model/homeMock';
import { QUICK_LINKS } from '@/pages/main/model/quickLinks';

const TAG_STYLES: Record<NoticeTag, string> = {
  안내: 'bg-[#E8F5E9] text-[#2E7D32]',
  긴급: 'bg-[#FFEBEE] text-[#C62828]',
};

export function NoticeAndQuickLinksSection() {
  return (
    <section className="w-full" aria-labelledby="home-notice-quick-heading">
      <h2 id="home-notice-quick-heading" className="sr-only">
        공지사항 및 바로가기
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-5">
        <article className="px-2 py-5 sm:px-2 sm:py-6">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[20px] font-bold text-neutral-900">공지사항</h3>
            <button
              type="button"
              className="shrink-0 cursor-pointer text-2xl leading-none font-light text-neutral-400 transition-colors hover:text-neutral-600"
              aria-label="공지사항 더보기"
            >
              +
            </button>
          </div>

          <ul className="mt-3 flex flex-col">
            {NOTICES.map((notice) => (
              <li key={notice.id}>
                <button type="button" className="flex w-full items-center gap-2.5 py-2.5 text-left">
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none ${TAG_STYLES[notice.tag]}`}
                  >
                    {notice.tag}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-neutral-800">{notice.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="flex flex-col rounded-2xl px-5 py-5 sm:px-6 sm:py-6">
          <h3 className="text-[20px] font-bold text-neutral-900">바로가기</h3>

          <div className="mt-4 grid flex-1 content-center grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {QUICK_LINKS.map(({ id, to, label, Icon }) => (
              <Link
                key={id}
                to={to}
                className="flex aspect-square flex-col items-center justify-center gap-2.5 rounded-xl border border-neutral-200 bg-white px-2 py-3 transition-colors hover:border-neutral-300"
              >
                <Icon className="h-20 w-20 sm:h-24 sm:w-24" />
                <span className="text-center text-[14px] font-medium text-neutral-800">{label}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
