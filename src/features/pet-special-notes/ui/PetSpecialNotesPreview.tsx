import { usePetSpecialNoteList } from '@/features/auth';

import { formatPetSpecialNoteTypeLabel } from '../lib/constants';

interface PetSpecialNotesPreviewProps {
  petId: number;
  fallbackCount?: number;
}

export function PetSpecialNotesPreview({ petId, fallbackCount = 0 }: PetSpecialNotesPreviewProps) {
  const { data, isLoading } = usePetSpecialNoteList(petId, {
    page: 0,
    size: 3,
    sort: 'createdAt,desc',
  });

  const notes = (data?.notes ?? []).slice(0, 3);
  const totalElements = data?.totalElements ?? fallbackCount;

  return (
    <div className="space-y-3">
      <p className="text-sm text-neutral-500">총 {totalElements}개의 특이사항이 등록되어 있어요.</p>

      {isLoading ? (
        <p className="text-sm text-neutral-500">특이사항을 불러오는 중이에요...</p>
      ) : notes.length === 0 ? (
        <article className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-neutral-600">등록된 특이사항이 없습니다.</p>
        </article>
      ) : (
        <div className="space-y-2.5">
          {notes.map((note) => (
            <article key={note.noteId} className="rounded-[16px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
                  {formatPetSpecialNoteTypeLabel(note.noteType)}
                </span>
                <span className="text-xs text-neutral-400">{note.createdAt.slice(0, 10)}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-700">{note.noteContent}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
