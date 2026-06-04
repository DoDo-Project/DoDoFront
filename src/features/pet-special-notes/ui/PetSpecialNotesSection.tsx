import { useMemo, useState } from 'react';

import {
  getApiErrorMessage,
  useCreatePetSpecialNote,
  useDeletePetSpecialNote,
  usePetSpecialNoteList,
  useUpdatePetSpecialNote,
  type PetSpecialNote,
  type PetSpecialNoteType,
} from '@/features/auth';

import { formatPetSpecialNoteTypeLabel, PET_SPECIAL_NOTE_TYPE_OPTIONS } from '../lib/constants';

interface PetSpecialNotesSectionProps {
  petId: number;
  fallbackCount?: number;
}

export function PetSpecialNotesSection({ petId, fallbackCount = 0 }: PetSpecialNotesSectionProps) {
  const { data, isLoading, isError, error, refetch } = usePetSpecialNoteList(petId, { page: 0, size: 10 });
  const { mutateAsync: createNote, isPending: isCreating } = useCreatePetSpecialNote();
  const { mutateAsync: updateNote, isPending: isUpdating } = useUpdatePetSpecialNote();
  const { mutateAsync: deleteNote, isPending: isDeleting } = useDeletePetSpecialNote();

  const [formType, setFormType] = useState<PetSpecialNoteType>('ALLERGY');
  const [formContent, setFormContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<PetSpecialNoteType>('ALLERGY');
  const [editingContent, setEditingContent] = useState('');
  const [submitError, setSubmitError] = useState('');

  const notes = data?.notes ?? [];
  const noteCount = data?.totalElements ?? fallbackCount;
  const isMutating = isCreating || isUpdating || isDeleting;

  const editingNote = useMemo(
    () => notes.find((note) => note.noteId === editingNoteId) ?? null,
    [notes, editingNoteId],
  );

  const resetEditing = () => {
    setEditingNoteId(null);
    setEditingType('ALLERGY');
    setEditingContent('');
  };

  const handleCreate = async () => {
    if (!formContent.trim()) return;

    setSubmitError('');

    try {
      await createNote({
        petId,
        noteContent: formContent.trim(),
        noteType: formType,
      });
      setFormContent('');
      setFormType('ALLERGY');
    } catch (createError) {
      setSubmitError(getApiErrorMessage(createError, '특이사항 등록에 실패했어요. 잠시 후 다시 시도해 주세요.'));
    }
  };

  const handleStartEdit = (note: PetSpecialNote) => {
    setSubmitError('');
    setEditingNoteId(note.noteId);
    setEditingType(note.noteType);
    setEditingContent(note.noteContent);
  };

  const handleSaveEdit = async () => {
    if (editingNoteId === null || !editingContent.trim()) return;

    setSubmitError('');

    try {
      await updateNote({
        petId,
        noteId: editingNoteId,
        payload: {
          noteContent: editingContent.trim(),
          noteType: editingType,
        },
      });
      resetEditing();
    } catch (updateError) {
      setSubmitError(getApiErrorMessage(updateError, '특이사항 수정에 실패했어요. 잠시 후 다시 시도해 주세요.'));
    }
  };

  const handleDelete = async (noteId: number) => {
    setSubmitError('');

    try {
      await deleteNote({ petId, noteId });
      if (editingNoteId === noteId) {
        resetEditing();
      }
    } catch (deleteError) {
      setSubmitError(getApiErrorMessage(deleteError, '특이사항 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.'));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={formType}
            onChange={(event) => setFormType(event.target.value)}
            className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
          >
            {PET_SPECIAL_NOTE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            value={formContent}
            onChange={(event) => setFormContent(event.target.value)}
            placeholder="특이사항 내용을 입력해 주세요."
            className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand"
          />
          <button
            type="button"
            onClick={() => void handleCreate()}
            disabled={isMutating || !formContent.trim()}
            className="inline-flex h-11 min-w-24 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            추가
          </button>
        </div>
        <p className="text-sm text-neutral-500">총 {noteCount}개의 특이사항을 관리할 수 있어요.</p>
      </div>

      {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

      {isLoading ? (
        <p className="text-sm text-neutral-500">특이사항을 불러오는 중이에요...</p>
      ) : isError ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-4">
          <p className="text-sm text-red-600">{getApiErrorMessage(error, '특이사항을 불러오지 못했어요.')}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm leading-7 text-neutral-600">등록된 특이사항이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => {
            const isEditing = editingNoteId === note.noteId && editingNote !== null;

            return (
              <article key={note.noteId} className="rounded-[20px] border border-neutral-200 bg-white px-4 py-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select
                        value={editingType}
                        onChange={(event) => setEditingType(event.target.value)}
                        className="h-11 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
                      >
                        {PET_SPECIAL_NOTE_TYPE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <input
                        value={editingContent}
                        onChange={(event) => setEditingContent(event.target.value)}
                        className="h-11 flex-1 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleSaveEdit()}
                        disabled={isMutating || !editingContent.trim()}
                        className="inline-flex h-10 min-w-24 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={resetEditing}
                        disabled={isMutating}
                        className="inline-flex h-10 min-w-24 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
                          {formatPetSpecialNoteTypeLabel(note.noteType)}
                        </span>
                        <span className="text-xs text-neutral-400">{note.createdAt.slice(0, 10)}</span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-neutral-700">{note.noteContent}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(note)}
                        disabled={isMutating}
                        className="inline-flex h-9 min-w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(note.noteId)}
                        disabled={isMutating}
                        className="inline-flex h-9 min-w-20 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
