import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useCurrentUser } from '@/features/auth';
import {
  BOARD_DETAIL_STATUS_MESSAGES,
  BOARD_MUTATION_STATUS_MESSAGES,
  BoardDetailContent,
  DeleteBoardDialog,
  useBoardDetail,
  useDeleteBoard,
} from '@/features/community';
import { getApiErrorMessage } from '@/shared/lib/api/errorMessage';
import { LoadingSpinner } from '@/shared/ui';

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
        getApiErrorMessage(
          deleteActionError,
          'Failed to delete this post. Please try again.',
          BOARD_MUTATION_STATUS_MESSAGES,
        ),
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
          description={getApiErrorMessage(
            error,
            'Failed to load the post. Please try again.',
            BOARD_DETAIL_STATUS_MESSAGES,
          )}
          onRetry={() => void refetch()}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mb-5 flex items-center">
        <Link
          to="/community"
          className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          Back to community
        </Link>
      </div>

      <BoardDetailContent board={board} canManage={canManage} onDelete={() => setDeleteDialogOpen(true)} />
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
  return <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>;
}

function InvalidBoardState() {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-8">
      <h1 className="text-[20px] font-medium text-neutral-950">Invalid post path</h1>
      <p className="mt-3 text-sm leading-7 text-neutral-600">Please check the post address and try again.</p>
      <Link
        to="/community"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
      >
        Go to community
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-neutral-500">Loading post...</p>
    </div>
  );
}

function ErrorState({ description, onRetry }: { description: string; onRetry: () => void }) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-8">
      <h1 className="text-[20px] font-medium text-neutral-950">Could not load this post</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          Retry
        </button>
        <Link
          to="/community"
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          Community home
        </Link>
      </div>
    </div>
  );
}
