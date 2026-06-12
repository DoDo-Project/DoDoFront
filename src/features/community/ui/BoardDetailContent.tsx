import { Link } from 'react-router-dom';

import type { BoardDetailResponse } from '../model/types';

interface BoardDetailContentProps {
  board: BoardDetailResponse;
  canManage: boolean;
  onDelete: () => void;
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function BoardDetailContent({ board, canManage, onDelete }: BoardDetailContentProps) {
  return (
    <article className="space-y-6">
      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.24em] text-brand">BOARD DETAIL</p>
              <h1 className="mt-3 text-[24px] font-semibold tracking-[-0.02em] text-neutral-950 sm:text-[30px]">
                {board.boardTitle}
              </h1>
            </div>

            {canManage ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to={`/community/${board.boardId}/edit`}
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
                >
                  수정하기
                </Link>
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center justify-center rounded-xl bg-red-500 px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  삭제하기
                </button>
              </div>
            ) : null}
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetaItem label="작성자" value={board.nickname} />
            <MetaItem label="조회수" value={`${board.viewCount}`} />
            <MetaItem label="작성일" value={formatDateTime(board.boardCreatedAt)} />
            <MetaItem label="수정일" value={formatDateTime(board.modifiedAt)} />
          </dl>
        </div>

        <div className="px-6 py-6 sm:px-8">
          <p className="whitespace-pre-wrap break-words text-sm leading-8 text-neutral-800 sm:text-[15px]">
            {board.boardContent}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-[18px] font-medium text-neutral-950">첨부 이미지</h2>
          <p className="mt-1 text-sm text-neutral-500">게시글에 함께 등록된 이미지예요.</p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {board.imageFileUrls.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {board.imageFileUrls.map((imageUrl, index) => (
                <figure
                  key={`${imageUrl}-${index}`}
                  className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm"
                >
                  <img src={imageUrl} alt={`게시글 이미지 ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                </figure>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-neutral-200 bg-neutral-50 px-5 py-8 text-center text-sm text-neutral-500">
              첨부된 이미지가 없어요.
            </div>
          )}
        </div>
      </section>
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-neutral-200 bg-neutral-50 px-4 py-4">
      <dt className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">{label}</dt>
      <dd className="mt-2 text-sm leading-6 text-neutral-700">{value}</dd>
    </div>
  );
}
