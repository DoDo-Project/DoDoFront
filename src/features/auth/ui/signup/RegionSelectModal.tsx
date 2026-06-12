import { useState } from 'react';

import {
  formatRegionLabel,
  getSigunguList,
  hasSigunguOptions,
  parseRegionLabel,
  SIDO_LIST,
} from '@/shared/lib/regions';
import { Modal } from '@/shared/ui';

import { PrimaryButton } from './SignupStepLayout';
import { SignupSelect } from './SignupSelect';

interface RegionSelectModalProps {
  open: boolean;
  initialRegion: string;
  onClose: () => void;
  onConfirm: (region: string) => void;
}

function RegionSelectForm({
  initialRegion,
  onClose,
  onConfirm,
}: {
  initialRegion: string;
  onClose: () => void;
  onConfirm: (region: string) => void;
}) {
  const parsed = parseRegionLabel(initialRegion);
  const [sido, setSido] = useState(parsed.sido);
  const [sigungu, setSigungu] = useState(parsed.sigungu ?? '');

  const sigunguOptions = sido ? getSigunguList(sido) : [];
  const showSigungu = Boolean(sido) && hasSigunguOptions(sido);
  const canConfirm = Boolean(sido) && (!showSigungu || Boolean(sigungu));

  const handleSidoChange = (nextSido: string) => {
    setSido(nextSido);
    setSigungu('');
  };

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(formatRegionLabel(sido, showSigungu ? sigungu : null));
    onClose();
  };

  return (
    <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
      <h2 className="pr-8 text-lg font-semibold text-neutral-900">지역 선택</h2>
      <p className="mt-1 text-sm text-neutral-500">활동 지역을 선택해주세요.</p>

      <div className="mt-6 flex flex-col gap-4">
        <SignupSelect
          id="region-sido"
          label="시/도"
          placeholder="시/도를 선택해주세요"
          value={sido}
          options={SIDO_LIST}
          onChange={handleSidoChange}
        />

        {showSigungu ? (
          <SignupSelect
            id="region-sigungu"
            label="시/군/구"
            placeholder="시/군/구를 선택해주세요"
            value={sigungu}
            options={sigunguOptions}
            onChange={setSigungu}
          />
        ) : sido ? (
          <p className="text-xs text-neutral-500">선택한 시/도 전체가 활동 지역으로 저장됩니다.</p>
        ) : null}
      </div>

      <div className="mt-8">
        <PrimaryButton onClick={handleConfirm} disabled={!canConfirm}>
          선택 완료
        </PrimaryButton>
      </div>
    </div>
  );
}

export function RegionSelectModal({ open, initialRegion, onClose, onConfirm }: RegionSelectModalProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="지역 선택" panelClassName="max-h-none overflow-visible">
      {open ? (
        <RegionSelectForm key={initialRegion} initialRegion={initialRegion} onClose={onClose} onConfirm={onConfirm} />
      ) : null}
    </Modal>
  );
}
