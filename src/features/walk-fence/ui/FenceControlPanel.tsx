import type { PetListItem } from '@/features/auth';

import type { FenceBoundary } from '../model/types';

interface DraftCenter {
  lat: number;
  lng: number;
}

interface FenceControlPanelProps {
  pets: PetListItem[];
  selectedPetId: number | null;
  onSelectPet: (petId: number) => void;
  /** 선택한 펫의 기존 울타리 (없으면 null → 생성 모드) */
  existingFence: FenceBoundary | null;
  draftCenter: DraftCenter | null;
  radius: number;
  onRadiusChange: (radius: number) => void;
  fenceName: string;
  onFenceNameChange: (name: string) => void;
  onCreate: () => void;
  onUpdate: () => void;
  onToggle: () => void;
  isSubmitting: boolean;
}

export function FenceControlPanel({
  pets,
  selectedPetId,
  onSelectPet,
  existingFence,
  draftCenter,
  radius,
  onRadiusChange,
  fenceName,
  onFenceNameChange,
  onCreate,
  onUpdate,
  onToggle,
  isSubmitting,
}: FenceControlPanelProps) {
  const selectedPet = pets.find((pet) => pet.petId === selectedPetId) ?? null;

  return (
    <div className="flex flex-col gap-5 p-5">
      <h2 className="text-sm font-semibold text-neutral-900">울타리 설정</h2>

      {/* 펫 선택 */}
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-700">반려동물 선택</p>
        {pets.length === 0 ? (
          <p className="text-sm text-neutral-400">등록된 반려동물이 없어요.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {pets.map((pet) => {
              const isActive = pet.petId === selectedPetId;
              return (
                <button
                  key={pet.petId}
                  type="button"
                  onClick={() => onSelectPet(pet.petId)}
                  className={[
                    'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'border-brand bg-brand text-brand-foreground'
                      : 'border-neutral-300 text-neutral-700 hover:bg-neutral-50',
                  ].join(' ')}
                  aria-pressed={isActive}
                >
                  {pet.petName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedPet && (
        <>
          {/* 안내 */}
          <p className="rounded-lg bg-neutral-50 px-3 py-2 text-xs leading-5 text-neutral-500">
            지도를 클릭해 울타리 중심을 {existingFence ? '옮길' : '지정할'} 수 있어요.
            {draftCenter
              ? ` 현재: ${draftCenter.lat.toFixed(5)}, ${draftCenter.lng.toFixed(5)}`
              : existingFence
                ? ' (지금은 기존 중심 유지)'
                : ' (아직 미지정)'}
          </p>

          {/* 이름 (생성/수정 공통) */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">울타리 이름</span>
            <input
              type="text"
              value={fenceName}
              maxLength={255}
              onChange={(event) => onFenceNameChange(event.target.value)}
              placeholder="예: 집 주변 울타리"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </label>

          {/* 반경 */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">반경: {radius}m</span>
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={radius}
              onChange={(event) => onRadiusChange(Number(event.target.value))}
              className="accent-brand"
            />
          </label>

          {/* 기존 울타리: 상태 + 수정 / 없으면: 생성 */}
          {existingFence ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2.5">
                <span className="text-sm font-medium text-neutral-700">
                  울타리 {existingFence.isActive ? '켜짐' : '꺼짐'}
                </span>
                <button
                  type="button"
                  role="switch"
                  onClick={onToggle}
                  disabled={isSubmitting}
                  className={[
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors disabled:opacity-50',
                    existingFence.isActive ? 'bg-brand' : 'bg-neutral-300',
                  ].join(' ')}
                  aria-checked={existingFence.isActive}
                  aria-label="울타리 켜기/끄기"
                >
                  <span
                    className={[
                      'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
                      existingFence.isActive ? 'translate-x-[22px]' : 'translate-x-0.5',
                    ].join(' ')}
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={onUpdate}
                disabled={isSubmitting || fenceName.trim().length === 0}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                울타리 수정 저장
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onCreate}
              disabled={isSubmitting || !draftCenter || fenceName.trim().length === 0}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              울타리 생성
            </button>
          )}
        </>
      )}
    </div>
  );
}
