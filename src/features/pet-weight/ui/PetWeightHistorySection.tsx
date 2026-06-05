import { useState } from 'react';

import {
  getApiErrorMessage,
  useCreatePetWeight,
  useDeletePetWeight,
  usePetWeightHistory,
  useUpdatePetWeight,
  type PetWeightRecord,
} from '@/features/auth';

interface PetWeightHistorySectionProps {
  petId: number;
}

interface WeightFormState {
  weight: string;
  measuredAt: string;
}

function formatMeasuredDate(date: string) {
  const [year, month, day] = date.split('-');

  return [year, month, day].filter(Boolean).join('. ');
}

function createEmptyFormState(): WeightFormState {
  return {
    weight: '',
    measuredAt: '',
  };
}

function parseWeightValue(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function isValidWeightForm(form: WeightFormState) {
  return parseWeightValue(form.weight) !== null && Boolean(form.measuredAt);
}

export function PetWeightHistorySection({ petId }: PetWeightHistorySectionProps) {
  const { data, isLoading, isError, error, refetch } = usePetWeightHistory(petId, {
    page: 0,
    size: 10,
    sort: 'petWeightsMeasuredAt,desc',
  });
  const { mutateAsync: createWeight, isPending: isCreating } = useCreatePetWeight();
  const { mutateAsync: updateWeight, isPending: isUpdating } = useUpdatePetWeight();
  const { mutateAsync: deleteWeight, isPending: isDeleting } = useDeletePetWeight();

  const [createForm, setCreateForm] = useState<WeightFormState>(createEmptyFormState);
  const [editingWeightId, setEditingWeightId] = useState<number | null>(null);
  const [editingForm, setEditingForm] = useState<WeightFormState>(createEmptyFormState);
  const [submitError, setSubmitError] = useState('');

  const weights = data?.weights ?? [];
  // const totalElements = data?.totalElements ?? 0;
  const isMutating = isCreating || isUpdating || isDeleting;

  const resetEditing = () => {
    setEditingWeightId(null);
    setEditingForm(createEmptyFormState());
  };

  const handleCreate = async () => {
    const parsedWeight = parseWeightValue(createForm.weight);

    if (parsedWeight === null || !createForm.measuredAt) {
      setSubmitError('측정 날짜와 체중을 올바르게 입력해 주세요.');
      return;
    }

    setSubmitError('');

    try {
      await createWeight({
        petId,
        payload: {
          weight: parsedWeight,
          petWeightsMeasuredAt: createForm.measuredAt,
        },
      });
      setCreateForm(createEmptyFormState());
    } catch (createError) {
      setSubmitError(getApiErrorMessage(createError, '체중 기록 추가에 실패했어요. 잠시 후 다시 시도해 주세요.'));
    }
  };

  const handleStartEdit = (weight: PetWeightRecord) => {
    setSubmitError('');
    setEditingWeightId(weight.weightId);
    setEditingForm({
      weight: String(weight.weight),
      measuredAt: weight.petWeightsMeasuredAt,
    });
  };

  const handleSaveEdit = async () => {
    if (editingWeightId === null) {
      return;
    }

    const parsedWeight = parseWeightValue(editingForm.weight);

    if (parsedWeight === null || !editingForm.measuredAt) {
      setSubmitError('측정 날짜와 체중을 올바르게 입력해 주세요.');
      return;
    }

    setSubmitError('');

    try {
      await updateWeight({
        petId,
        weightId: editingWeightId,
        payload: {
          weight: parsedWeight,
          petWeightsMeasuredAt: editingForm.measuredAt,
        },
      });
      resetEditing();
    } catch (updateError) {
      setSubmitError(getApiErrorMessage(updateError, '체중 기록 수정에 실패했어요. 잠시 후 다시 시도해 주세요.'));
    }
  };

  const handleDelete = async (weightId: number) => {
    setSubmitError('');

    try {
      await deleteWeight({ petId, weightId });
      if (editingWeightId === weightId) {
        resetEditing();
      }
    } catch (deleteError) {
      setSubmitError(getApiErrorMessage(deleteError, '체중 기록 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.'));
    }
  };

  return (
    <div className="space-y-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleCreate();
        }}
        className="rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-4 py-4"
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">측정 날짜</span>
            <input
              type="date"
              value={createForm.measuredAt}
              onChange={(event) => setCreateForm((current) => ({ ...current, measuredAt: event.target.value }))}
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
            />
          </label>
          <label className="flex-1">
            <span className="mb-1.5 block text-xs font-medium text-neutral-500">체중</span>
            <input
              type="number"
              min="0"
              step="0.1"
              inputMode="decimal"
              value={createForm.weight}
              onChange={(event) => setCreateForm((current) => ({ ...current, weight: event.target.value }))}
              placeholder="예: 5.4"
              className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand"
            />
          </label>
          <button
            type="submit"
            disabled={isMutating || !isValidWeightForm(createForm)}
            className="inline-flex h-11 min-w-24 items-center justify-center self-end rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            추가
          </button>
        </div>
      </form>

      {/* <div className="rounded-[20px] border border-neutral-200 bg-neutral-50/70 px-4 py-4">
        <p className="text-sm text-neutral-500">총 {totalElements}개의 체중 기록이 등록되어 있어요.</p>
      </div> */}

      {submitError ? <p className="text-sm text-red-500">{submitError}</p> : null}

      {isLoading ? (
        <p className="text-sm text-neutral-500">체중 기록을 불러오는 중이에요...</p>
      ) : isError ? (
        <div className="rounded-[20px] border border-red-200 bg-red-50 px-4 py-4">
          <p className="text-sm text-red-600">{getApiErrorMessage(error, '체중 기록을 불러오지 못했어요.')}</p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-3 inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            다시 시도
          </button>
        </div>
      ) : weights.length === 0 ? (
        <article className="rounded-[18px] border border-neutral-200 bg-neutral-50/70 px-4 py-3">
          <p className="text-sm leading-6 text-neutral-600">등록된 체중 기록이 없습니다.</p>
        </article>
      ) : (
        <div className="space-y-2.5">
          {weights.map((weight) => {
            const isEditing = editingWeightId === weight.weightId;

            return (
              <article key={weight.weightId} className="rounded-[18px] border border-neutral-200 bg-white px-4 py-3.5">
                {isEditing ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      void handleSaveEdit();
                    }}
                    className="space-y-3"
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label>
                        <span className="mb-1.5 block text-xs font-medium text-neutral-500">측정 날짜</span>
                        <input
                          type="date"
                          value={editingForm.measuredAt}
                          onChange={(event) =>
                            setEditingForm((current) => ({ ...current, measuredAt: event.target.value }))
                          }
                          className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
                        />
                      </label>
                      <label>
                        <span className="mb-1.5 block text-xs font-medium text-neutral-500">체중</span>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          inputMode="decimal"
                          value={editingForm.weight}
                          onChange={(event) =>
                            setEditingForm((current) => ({ ...current, weight: event.target.value }))
                          }
                          className="h-10 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition-colors focus:border-brand"
                        />
                      </label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={resetEditing}
                        disabled={isMutating}
                        className="inline-flex h-9 min-w-20 items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        disabled={isMutating || !isValidWeightForm(editingForm)}
                        className="inline-flex h-9 min-w-20 items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        저장
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-[15px] font-medium text-neutral-900">{weight.weight}</p>
                      <p className="text-sm text-neutral-500">
                        측정일 {formatMeasuredDate(weight.petWeightsMeasuredAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(weight)}
                        disabled={isMutating}
                        className="inline-flex h-9 min-w-18 items-center justify-center rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-800 transition-colors hover:border-brand/50 hover:text-brand disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(weight.weightId)}
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
