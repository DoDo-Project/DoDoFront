import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import {
  BOARD_DETAIL_STATUS_MESSAGES,
  BOARD_MUTATION_STATUS_MESSAGES,
  BoardDetailContent,
  CommunityLayout,
  DeleteBoardDialog,
  useBoardDetail,
  useDeleteBoard,
} from '@/features/community';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { LoadingSpinner } from '@/shared/ui';

const DETAIL_PAGE_COPY = {
  backToCommunity: '커뮤니티로 돌아가기',
  invalidTitle: '올바르지 않은 게시글 경로예요.',
  invalidDescription: '게시글 주소를 다시 확인한 뒤 재시도해주세요.',
  goCommunity: '커뮤니티 홈 이동',
  loading: '게시글을 불러오는 중...',
  loadFailedTitle: '게시글을 불러오지 못했어요.',
  loadFailedFallback: '게시글 조회에 실패했어요. 잠시 후 다시 시도해주세요.',
  retry: '다시 시도',
  deleteFailedFallback: '게시글을 삭제하지 못했어요. 잠시 후 다시 시도해주세요.',
};

function parseBoardId(value: string | undefined): number | null {
  if (!value) return null;

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function BoardDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const boardId = useMemo(() => parseBoardId(params.boardId), [params.boardId]);
  const { data: board, isLoading, isError, error, refetch } = useBoardDetail(boardId);
  const { nickname } = useCurrentUser();
  const { mutateAsync: deleteBoard, isPending: isDeleting } = useDeleteBoard();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const canManage = Boolean(board && nickname && board.nickname.trim() === nickname.trim());

  const handleDelete = async () => {
    if (boardId === null) return;

    setDeleteError('');

    try {
      await deleteBoard({ boardId });
      void navigate('/community');
    } catch (deleteActionError) {
      setDeleteError(
        getApiErrorMessage(deleteActionError, DETAIL_PAGE_COPY.deleteFailedFallback, BOARD_MUTATION_STATUS_MESSAGES),
      );
    }
  };

  if (boardId === null) {
    return (
      <PageShell>
        <InvalidBoardState />
      </PageShell>
    );
  }

  if (isLoading) {
    return (
      <PageShell>
        <LoadingState />
      </PageShell>
    );
  }

  if (isError || !board) {
    return (
      <PageShell>
        <ErrorState
          description={getApiErrorMessage(error, DETAIL_PAGE_COPY.loadFailedFallback, BOARD_DETAIL_STATUS_MESSAGES)}
          onRetry={() => void refetch()}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <CommunityLayout
        eyebrow="BOARD DETAIL"
        title="게시글 상세"
        description="작성 페이지의 담백한 톤을 유지하면서 글, 이미지, 댓글을 한 흐름으로 보여주는 상세 페이지예요."
        content={
          <div className="space-y-5">
            <div className="flex items-center">
              <Link
                to="/community"
                className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
              >
                {DETAIL_PAGE_COPY.backToCommunity}
              </Link>
            </div>

            <BoardDetailContent board={board} canManage={canManage} onDelete={() => setDeleteDialogOpen(true)} />
          </div>
        }
      />

      <DeleteBoardDialog
        open={deleteDialogOpen}
        isPending={isDeleting}
        errorMessage={deleteError}
        onClose={() => {
          if (isDeleting) return;
          setDeleteDialogOpen(false);
          setDeleteError('');
        }}
        onConfirm={() => void handleDelete()}
      />
    </PageShell>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function InvalidBoardState() {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-8">
      <h1 className="text-[20px] font-medium text-neutral-950">{DETAIL_PAGE_COPY.invalidTitle}</h1>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{DETAIL_PAGE_COPY.invalidDescription}</p>
      <Link
        to="/community"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
      >
        {DETAIL_PAGE_COPY.goCommunity}
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-neutral-500">{DETAIL_PAGE_COPY.loading}</p>
    </div>
  );
}

function ErrorState({ description, onRetry }: { description: string; onRetry: () => void }) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-8">
      <h1 className="text-[20px] font-medium text-neutral-950">{DETAIL_PAGE_COPY.loadFailedTitle}</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          {DETAIL_PAGE_COPY.retry}
        </button>
        <Link
          to="/community"
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          {DETAIL_PAGE_COPY.goCommunity}
        </Link>
      </div>
    </div>
  );
}
