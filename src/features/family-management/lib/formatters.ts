export function formatSpeciesLabel(species: string) {
  if (species === 'CANINE') return '강아지';
  if (species === 'FELINE') return '고양이';
  return species;
}

export function formatBirthLabel(birth: string) {
  const [year = '', month = '', day = ''] = birth.slice(0, 10).split('-');
  return [year, month, day].filter(Boolean).join('. ');
}

export function getSexLabel(sex: string) {
  if (sex === 'MALE') return '수컷';
  if (sex === 'FEMALE') return '암컷';
  return '중성화';
}

export function formatRequestedAt(value: string) {
  if (!value) return '-';
  return value.slice(0, 16).replace('T', ' ');
}

export function formatApplicationStatus(status: string) {
  if (status === 'PENDING') return '승인 대기';
  if (status === 'APPROVED') return '승인 완료';
  if (status === 'REJECTED') return '거절됨';
  if (status === 'BLOCKED') return '차단됨';
  return status;
}

export function getApplicationStatusClass(status: string) {
  if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-600';
  if (status === 'REJECTED') return 'bg-rose-50 text-rose-500';
  if (status === 'BLOCKED') return 'bg-neutral-200 text-neutral-700';
  return 'bg-amber-50 text-amber-600';
}

export function normalizeFamilyCode(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);
}

export function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
