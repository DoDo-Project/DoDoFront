import type { ReactNode } from 'react';

import { BoardEditorForm, useBoardEditorForm } from '@/features/community';
import { LoadingSpinner } from '@/shared/ui';

export function BoardCreatePage() {
  const editor = useBoardEditorForm({ mode: 'create' });

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
          title="임시 저장 게시글을 불러오지 못했어요."
          description={editor.initialLoadErrorMessage || '잠시 후 다시 시도해주세요.'}
          onRetry={() => void editor.retryInitialLoad()}
          onReset={() => editor.resetStoredDraft()}
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
        mode="create"
      />
    </PageShell>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>;
}

function LoadingState() {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[24px] border border-neutral-200 bg-white px-6 py-16 text-center shadow-sm">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-neutral-500">{'임시 저장한 게시글을 확인하고 있어요.'}</p>
    </div>
  );
}

function ErrorState({
  title,
  description,
  onRetry,
  onReset,
}: {
  title: string;
  description: string;
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-6 py-10 shadow-sm sm:px-8">
      <h1 className="text-[20px] font-medium text-neutral-950">{title}</h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">{description}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
        >
          {'다시 시도'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          {'임시 저장본 초기화'}
        </button>
      </div>
    </div>
  );
}
