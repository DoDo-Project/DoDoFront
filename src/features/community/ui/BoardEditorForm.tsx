import type { ChangeEventHandler, FormEventHandler } from 'react';
import { Link } from 'react-router-dom';

import { IMAGE_UPLOAD_POLICY_DESCRIPTION } from '@/shared/lib/files/imageUploadPolicy';

import type { BoardEditorFormErrors, BoardEditorFormState } from '../lib/validation';

interface BoardEditorFormProps {
  form: BoardEditorFormState;
  errors: BoardEditorFormErrors;
  submitError: string;
  tempSaveError: string;
  imageError: string;
  uploadingImages: boolean;
  isPending: boolean;
  isTempSaving: boolean;
  storedDraftSessionKey: string | null;
  onFieldChange: (field: keyof BoardEditorFormState) => ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onSelectImages: (files: FileList | File[]) => void;
  onRemoveImage: (index: number) => void;
  onTempSave: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  mode?: 'create' | 'edit';
  cancelTo?: string;
}

export function BoardEditorForm({
  form,
  errors,
  submitError,
  tempSaveError,
  imageError,
  uploadingImages,
  isPending,
  isTempSaving,
  storedDraftSessionKey,
  onFieldChange,
  onSelectImages,
  onRemoveImage,
  onTempSave,
  onSubmit,
  mode = 'create',
  cancelTo = '/community',
}: BoardEditorFormProps) {
  const isEditMode = mode === 'edit';
  const eyebrow = isEditMode ? 'BOARD EDIT' : 'BOARD WRITE';
  const heading = isEditMode ? '게시글 수정' : '게시글 작성';
  const description = isEditMode
    ? '제목과 내용을 다듬고, 필요한 경우 이미지도 함께 수정해보세요.'
    : '반려생활 이야기를 자유롭게 기록해보세요. 임시 저장 후 나중에 이어서 작성할 수도 있어요.';
  const submitLabel = isEditMode ? '수정 완료' : '게시하기';
  const pendingLabel = isEditMode ? '수정 중...' : '게시 중...';
  const helperMessage = storedDraftSessionKey
    ? '임시 저장한 작성 본이 이 브라우저에 연결되어 있어요.'
    : '작성 중인 내용은 임시 저장 후 다시 이어서 편집할 수 있어요.';
  const statusBadge = storedDraftSessionKey ? '임시 저장본 연결됨' : '새 게시글';

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div>
        <p className="text-xs font-semibold tracking-[0.24em] text-brand">{eyebrow}</p>
        <h1 className="mt-2 text-[18px] font-medium text-neutral-950 sm:text-[20px]">{heading}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-neutral-600">{description}</p>
      </div>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[18px] font-medium text-neutral-950">{'작성 상태'}</h2>
              <p className="mt-1 text-sm text-neutral-500">{helperMessage}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-brand/8 px-3 py-1 text-xs font-medium text-brand">
              {statusBadge}
            </span>
          </div>
        </div>
        <div className="grid gap-4 px-6 py-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <Field
              label="게시글 제목"
              placeholder="예: 오늘 산책하다 만난 귀여운 친구들"
              required
              value={form.boardTitle}
              onChange={onFieldChange('boardTitle')}
              error={errors.boardTitle}
            />
            <TextAreaField
              label="게시글 내용"
              placeholder="반려동물과의 오늘 이야기를 자유롭게 적어보세요."
              required
              value={form.boardContent}
              onChange={onFieldChange('boardContent')}
              error={errors.boardContent}
            />
          </div>

          <div className="rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-5 py-5">
            <h3 className="text-[16px] font-medium text-neutral-950">{'임시 저장'}</h3>
            <p className="mt-1 text-sm leading-6 text-neutral-500">
              {'지금 상태를 저장하고 나중에 다시 이어서 쓸 수 있어요.'}
            </p>

            <button
              type="button"
              disabled={isTempSaving}
              onClick={onTempSave}
              className="mt-5 inline-flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isTempSaving ? '임시 저장 중...' : '임시 저장'}
            </button>

            {tempSaveError ? <p className="mt-3 text-sm text-red-500">{tempSaveError}</p> : null}
            {!tempSaveError && storedDraftSessionKey ? (
              <p className="mt-3 text-sm text-brand">{'임시 저장한 게시글을 다시 불러올 수 있어요.'}</p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 px-6 py-5 sm:px-8">
          <h2 className="text-[18px] font-medium text-neutral-950">{'이미지 첨부'}</h2>
          <p className="mt-1 text-sm text-neutral-500">{IMAGE_UPLOAD_POLICY_DESCRIPTION}</p>
        </div>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-brand hover:bg-brand/5">
            <input
              type="file"
              accept="image/jpeg,image/png"
              multiple
              className="sr-only"
              onChange={(event) => {
                if (event.target.files?.length) {
                  onSelectImages(event.target.files);
                  event.target.value = '';
                }
              }}
            />
            {uploadingImages ? '이미지 업로드 중...' : '이미지 추가'}
          </label>

          {imageError ? <p className="text-sm text-red-500">{imageError}</p> : null}

          {form.imageFileUrls.length ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {form.imageFileUrls.map((imageUrl, index) => (
                <article
                  key={`${imageUrl}-${index}`}
                  className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white shadow-sm"
                >
                  <img src={imageUrl} alt={`첨부 이미지 ${index + 1}`} className="aspect-[4/3] w-full object-cover" />
                  <div className="flex items-center justify-between gap-3 px-4 py-3">
                    <span className="text-sm text-neutral-500">{`이미지 ${index + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="text-sm font-medium text-red-500 transition-opacity hover:opacity-80"
                    >
                      {'삭제'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-neutral-200 bg-neutral-50 px-5 py-8 text-center text-sm text-neutral-500">
              {'아직 첨부된 이미지가 없어요.'}
            </div>
          )}
        </div>
      </section>

      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-neutral-500">
          <span className="font-semibold text-brand">*</span> {'필수 입력 항목입니다.'}
        </p>
        {submitError ? <p className="max-w-md text-right text-sm text-red-500">{submitError}</p> : null}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          to={cancelTo}
          className="inline-flex min-w-28 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          {'취소'}
        </Link>
        <button
          type="submit"
          disabled={isPending || uploadingImages}
          className="inline-flex min-w-32 items-center justify-center rounded-xl bg-brand px-6 py-3 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {uploadingImages ? '이미지 업로드 중...' : isPending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <LabelText label={label} required={required} />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
          'mt-2 h-12 w-full rounded-xl border bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400',
          error ? 'border-red-300 focus:border-red-400' : 'border-neutral-200 focus:border-brand',
        ].join(' ')}
      />
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </label>
  );
}

function TextAreaField({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  error,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <LabelText label={label} required={required} />
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={12}
        className={[
          'mt-2 w-full resize-none rounded-2xl border bg-white px-4 py-4 text-sm leading-7 text-neutral-900 outline-none transition-colors placeholder:text-neutral-400',
          error ? 'border-red-300 focus:border-red-400' : 'border-neutral-200 focus:border-brand',
        ].join(' ')}
      />
      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
    </label>
  );
}

function LabelText({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <span className="text-sm font-medium text-neutral-800">
      {label}
      {required ? <span className="ml-1 text-brand">*</span> : null}
    </span>
  );
}
