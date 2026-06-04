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

interface PetSpecialNotesManagerProps {
  petId: number;
  pageSize?: number;
}

type NoteFilter = 'ALL' | PetSpecialNoteType;
type NoteSort = 'latest' | 'oldest';

export function PetSpecialNotesManager({ petId, pageSize = 10 }: PetSpecialNotesManagerProps) {
  const { data, isLoading, isError, error, refetch } = usePetSpecialNoteList(petId, {
    page: 0,
    size: pageSize,
  });
  const { mutateAsync: createNote, isPending: isCreating } = useCreatePetSpecialNote();
  const { mutateAsync: updateNote, isPending: isUpdating } = useUpdatePetSpecialNote();
  const { mutateAsync: deleteNote, isPending: isDeleting } = useDeletePetSpecialNote();

  const [formType, setFormType] = useState<PetSpecialNoteType>('ALLERGY');
  const [formContent, setFormContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingType, setEditingType] = useState<PetSpecialNoteType>('ALLERGY');
  const [editingContent, setEditingContent] = useState('');
  const [filterType, setFilterType] = useState<NoteFilter>('ALL');
  const [sortOrder, setSortOrder] = useState<NoteSort>('latest');
  const [submitError, setSubmitError] = useState('');

  const notes = data?.notes ?? [];
  const isMutating = isCreating || isUpdating || isDeleting;

  const visibleNotes = useMemo(() => {
    const filtered = filterType === 'ALL' ? notes : notes.filter((note) => note.noteType === filterType);

    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return sortOrder === 'latest' ? bTime - aTime : aTime - bTime;
    });
  }, [filterType, notes, sortOrder]);

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
      <div className="rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={formType}
            onChange={(event) => setFormType(event.target.value)}
            className="h-11 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
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
            placeholder="특이사항을 입력해 주세요."
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
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filterType === 'ALL'} label="전체" onClick={() => setFilterType('ALL')} />
          {PET_SPECIAL_NOTE_TYPE_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              active={filterType === option.value}
              label={option.label}
              onClick={() => setFilterType(option.value)}
            />
          ))}
        </div>

        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value as NoteSort)}
          className="h-10 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-800 outline-none transition-colors focus:border-brand"
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
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
      ) : visibleNotes.length === 0 ? (
        <p className="text-sm leading-7 text-neutral-600">
          {filterType === 'ALL' ? '등록된 특이사항이 없습니다.' : '선택한 타입의 특이사항이 없습니다.'}
        </p>
      ) : (
        <div className="space-y-2.5">
          {visibleNotes.map((note) => {
            const isEditing = editingNoteId === note.noteId && editingNote !== null;

            return (
              <article key={note.noteId} className="rounded-[18px] border border-neutral-200 bg-white px-4 py-3.5">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <select
                        value={editingType}
                        onChange={(event) => setEditingType(event.target.value)}
                        className="h-10 cursor-pointer rounded-2xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
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
                        className="h-10 flex-1 rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleSaveEdit()}
                        disabled={isMutating || !editingContent.trim()}
                        className="inline-flex h-9 min-w-20 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        저장
                      </button>
                      <button
                        type="button"
                        onClick={resetEditing}
                        disabled={isMutating}
                        className="inline-flex h-9 min-w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                          {formatPetSpecialNoteTypeLabel(note.noteType)}
                        </span>
                        <span className="text-xs text-neutral-400">{note.createdAt.slice(0, 10)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">{note.noteContent}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(note)}
                        disabled={isMutating}
                        className="inline-flex h-9 min-w-18 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(note.noteId)}
                        disabled={isMutating}
                        className="inline-flex h-9 min-w-18 items-center justify-center rounded-xl border border-red-200 bg-white px-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'inline-flex h-9 items-center justify-center rounded-full border px-3 text-sm font-medium transition-colors',
        active
          ? 'border-brand bg-brand/10 text-brand'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-brand/40 hover:text-brand',
      ].join(' ')}
    >
      {label}
    </button>
  );
}
