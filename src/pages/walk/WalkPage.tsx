import { useMemo, useState } from 'react';

import { usePetList } from '@/features/auth';
import {
  FenceControlPanel,
  WalkMap,
  useCreateFence,
  useFenceBoundaries,
  useToggleFence,
  useUpdateFenceRange,
} from '@/features/walk-fence';

interface DraftCenter {
  lat: number;
  lng: number;
}

const EMPTY_BOUNDARIES: never[] = [];

export function WalkPage() {
  const { data: boundariesData } = useFenceBoundaries();
  const { data: petListData } = usePetList();
  const createFence = useCreateFence();
  const toggleFence = useToggleFence();
  const updateFenceRange = useUpdateFenceRange();

  const boundaries = boundariesData?.boundaries ?? EMPTY_BOUNDARIES;
  const pets = petListData?.pets ?? [];

  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [draftCenter, setDraftCenter] = useState<DraftCenter | null>(null);
  const [radius, setRadius] = useState(500);
  const [fenceName, setFenceName] = useState('');

  // 선택한 펫의 기존 울타리 (있으면 수정 모드, 없으면 생성 모드)
  const existingFence = useMemo(
    () => (selectedPetId != null ? (boundaries.find((fence) => fence.petId === selectedPetId) ?? null) : null),
    [boundaries, selectedPetId],
  );

  // 펫/울타리가 바뀌면 입력값 동기화 (effect 대신 렌더 중 조정 — React 권장 패턴)
  const formKey = `${selectedPetId ?? ''}:${existingFence?.fenceId ?? ''}`;
  const [syncedKey, setSyncedKey] = useState(formKey);
  if (formKey !== syncedKey) {
    setSyncedKey(formKey);
    setRadius(existingFence ? existingFence.radius : 500);
    setFenceName(existingFence ? existingFence.fenceName : '');
    setDraftCenter(null);
  }

  const isSubmitting = createFence.isPending || toggleFence.isPending || updateFenceRange.isPending;

  const handleCreate = () => {
    if (selectedPetId == null || !draftCenter) return;
    createFence.mutate({
      petId: selectedPetId,
      centerLatitude: draftCenter.lat,
      centerLongitude: draftCenter.lng,
      radius,
      fenceName: fenceName.trim(),
    });
  };

  const handleUpdate = () => {
    if (!existingFence) return;
    updateFenceRange.mutate({
      fenceId: existingFence.fenceId,
      payload: {
        centerLatitude: draftCenter?.lat ?? existingFence.center.latitude,
        centerLongitude: draftCenter?.lng ?? existingFence.center.longitude,
        radius,
        fenceName: fenceName.trim() || existingFence.fenceName,
      },
    });
  };

  const handleToggle = () => {
    if (!existingFence) return;
    toggleFence.mutate({
      fenceId: existingFence.fenceId,
      payload: { fenceIsActive: !existingFence.isActive },
    });
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <WalkMap
          boundaries={boundaries}
          draftCenter={draftCenter}
          draftRadius={radius}
          onMapClick={(lat, lng) => setDraftCenter({ lat, lng })}
        />
        <FenceControlPanel
          pets={pets}
          selectedPetId={selectedPetId}
          onSelectPet={setSelectedPetId}
          existingFence={existingFence}
          draftCenter={draftCenter}
          radius={radius}
          onRadiusChange={setRadius}
          fenceName={fenceName}
          onFenceNameChange={setFenceName}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onToggle={handleToggle}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
