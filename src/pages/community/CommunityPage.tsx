import { Link } from 'react-router-dom';

export function CommunityPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[28px] border border-neutral-200 bg-white shadow-sm">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.24em] text-brand">COMMUNITY</p>
            <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.02em] text-neutral-950 sm:text-[34px]">
              반려생활 이야기를 편하게 남겨보세요.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
              커뮤니티 홈은 다음 단계에서 목록과 상세를 더 채울 예정이에요. 지금은 게시글 작성 플로우를 먼저 사용할 수
              있게 열어뒀어요.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/community/new"
                className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
              >
                게시글 작성하기
              </Link>
            </div>
          </div>

          <div className="rounded-[24px] border border-neutral-200 bg-neutral-50 p-5">
            <h2 className="text-[17px] font-medium text-neutral-950">이번 단계에서 가능한 것</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-neutral-600">
              <li>게시글 작성 폼 사용</li>
              <li>이미지 업로드 및 제거</li>
              <li>임시 저장 및 복원</li>
              <li>기존 게시글 수정 화면 연결</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
