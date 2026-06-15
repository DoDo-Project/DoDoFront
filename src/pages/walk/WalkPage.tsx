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
    // 헤더(h-14) 아래로 전체 폭을 채우는 네이버 지도 스타일 레이아웃
    // (main의 max-w-5xl·padding을 벗어나기 위해 full-bleed 처리)
    <div className="relative left-1/2 -my-6 flex h-[calc(100vh-3.5rem)] w-screen -translate-x-1/2 overflow-hidden bg-white">
      {/* 왼쪽 사이드바 — 울타리 설정 (추후 산책 활동 섹션 추가 예정) */}
      <aside className="flex w-[380px] shrink-0 flex-col overflow-y-auto border-r border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h1 className="text-lg font-bold text-neutral-900">산책</h1>
          <p className="mt-0.5 text-xs text-neutral-500">반려동물 안전 울타리를 설정하세요.</p>
        </div>
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
      </aside>

      {/* 오른쪽 지도 영역 */}
      <div className="relative flex-1">
        <WalkMap
          boundaries={boundaries}
          draftCenter={draftCenter}
          draftRadius={radius}
          onMapClick={(lat, lng) => setDraftCenter({ lat, lng })}
        />
      </div>
    </div>
  );
}
