import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { BoardEditorForm, useBoardEditorForm } from '@/features/community';
import { LoadingSpinner } from '@/shared/ui';

function parseBoardId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function BoardEditPage() {
  const params = useParams();
  const boardId = useMemo(() => parseBoardId(params.boardId), [params.boardId]);
  const editor = useBoardEditorForm({ mode: 'edit', boardId });

  if (boardId === null) {
    return (
      <PageShell>
        <InvalidBoardState />
      </PageShell>
    );
  }

  if (editor.isInitialLoading) {
    return (
      <PageShell>
        <LoadingState />
      </PageShell>
    );
  }

  if (editor.isInitialLoadError) {
    return (
      <PageShell>
        <ErrorState
          boardId={boardId}
          description={editor.initialLoadErrorMessage || '게시글 정보를 불러오지 못했어요.'}
          onRetry={() => void editor.retryInitialLoad()}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <BoardEditorForm
        form={editor.form}
        errors={editor.errors}
        submitError={editor.submitError}
        tempSaveError={editor.tempSaveError}
        imageError={editor.imageError}
        uploadingImages={editor.uploadingImages}
        isPending={editor.isPending}
        isTempSaving={editor.isTempSaving}
        storedDraftSessionKey={editor.storedDraftSessionKey}
        onFieldChange={editor.handleFieldChange}
        onSelectImages={editor.handleSelectImages}
        onRemoveImage={editor.handleRemoveImage}
        onTempSave={() => void editor.handleTempSave()}
        onSubmit={editor.handleSubmit}
        mode="edit"
        cancelTo={`/community/${boardId}`}
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
      <h1 className="text-[20px] font-medium text-neutral-950">{'잘못된 게시글 경로예요.'}</h1>
      <p className="mt-3 text-sm leading-7 text-neutral-600">{'수정할 게시글 정보를 다시 확인해주세요.'}</p>
      <Link
        to="/community"
        className="mt-6 inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
      >
        {'커뮤니티로 이동'}
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-neutral-500">{'게시글 정보를 불러오고 있어요.'}</p>
    </div>
  );
}

function ErrorState({ boardId, description, onRetry }: { boardId: number; description: string; onRetry: () => void }) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-8">
      <h1 className="text-[20px] font-medium text-neutral-950">{'게시글 수정 준비에 실패했어요.'}</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          {'다시 시도'}
        </button>
        <Link
          to={`/community/${boardId}`}
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          {'상세로 돌아가기'}
        </Link>
      </div>
    </div>
  );
}
