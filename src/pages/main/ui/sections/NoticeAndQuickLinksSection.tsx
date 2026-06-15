import { Link } from 'react-router-dom';

import type { MainAnnouncement } from '@/pages/main/model/types';
import { QUICK_LINKS } from '@/pages/main/model/quickLinks';
import { Skeleton } from '@/shared/ui';

import { summarizeContent } from '../../model/formatters';

interface NoticeAndQuickLinksSectionProps {
  isLoading: boolean;
  errorMessage: string | null;
  announcements: MainAnnouncement[];
}

export function NoticeAndQuickLinksSection({
  isLoading,
  errorMessage,
  announcements,
}: NoticeAndQuickLinksSectionProps) {
  return (
    <section className="w-full" aria-labelledby="home-notice-quick-heading">
      <h2 id="home-notice-quick-heading" className="sr-only">
        공지사항 및 바로가기
      </h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-5">
        <article className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">NOTICE</p>
              <h3 className="mt-2 text-[22px] font-semibold text-neutral-950">공지사항</h3>
            </div>
            <Link
              to="/community"
              className="inline-flex h-10 items-center justify-center rounded-full border border-neutral-200 px-4 text-sm font-medium text-neutral-700 transition-colors hover:border-brand/40 hover:text-brand"
            >
              더 보기
            </Link>
          </div>

          {isLoading ? (
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="rounded-[20px] border border-neutral-100 p-4">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="mt-3 h-5 w-full rounded-md" />
                  <Skeleton className="mt-2 h-4 w-5/6 rounded-md" />
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="mt-5 rounded-[20px] border border-red-100 bg-red-50/70 p-4">
              <p className="text-sm leading-6 text-red-500">{errorMessage}</p>
            </div>
          ) : announcements.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {announcements.slice(0, 4).map((announcement, index) => (
                <li key={`${announcement.boardTitle}-${index}`}>
                  <Link
                    to="/community"
                    className="block rounded-[20px] border border-neutral-100 p-4 transition-colors hover:border-brand/30 hover:bg-[#fffaf5]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full bg-[#fff4ea] px-2.5 py-1 text-xs font-semibold text-[#c46f3e]">
                        공지
                      </span>
                      <span className="text-xs text-neutral-400">조회 {announcement.viewCount}</span>
                    </div>
                    <p className="mt-3 line-clamp-1 text-[15px] font-semibold text-neutral-900">
                      {announcement.boardTitle}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-500">
                      {summarizeContent(announcement.boardContent, 88)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-[20px] border border-dashed border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm leading-7 text-neutral-500">
                등록된 공지사항이 없어요. 새로운 소식이 올라오면 이곳에서 바로 확인할 수 있어요.
              </p>
            </div>
          )}
        </article>

        <article className="rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400">SHORTCUT</p>
            <h3 className="mt-2 text-[22px] font-semibold text-neutral-950">바로가기</h3>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {QUICK_LINKS.map(({ id, to, label, Icon }) => (
              <Link
                key={id}
                to={to}
                className="group flex min-h-40 flex-col items-center justify-center gap-3 rounded-[24px] border border-neutral-200 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf5_100%)] px-3 py-4 transition-all hover:-translate-y-0.5 hover:border-brand/35 hover:shadow-[0_14px_30px_rgba(217,123,58,0.10)]"
              >
                <Icon className="h-20 w-20 transition-transform group-hover:scale-[1.03]" />
                <span className="text-center text-sm font-semibold text-neutral-800">{label}</span>
              </Link>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
