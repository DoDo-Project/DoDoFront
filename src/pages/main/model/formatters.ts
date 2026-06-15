const SPECIES_LABEL: Record<string, string> = {
  CANINE: '강아지',
  FELINE: '고양이',
};

const SEX_LABEL: Record<string, string> = {
  MALE: '남아',
  FEMALE: '여아',
  NEUTER: '중성화',
};

export function getMainPetSpecies(profile: { species?: string; spercies?: string }) {
  return profile.species ?? profile.spercies ?? '';
}

export function formatSpeciesLabel(species: string) {
  return SPECIES_LABEL[species] ?? species;
}

export function formatSexLabel(sex: string) {
  return SEX_LABEL[sex] ?? sex;
}

export function formatWeightLabel(weight: number) {
  if (!Number.isFinite(weight)) return '-';
  return `${weight.toFixed(1)}kg`;
}

export function formatDateLabel(value: string) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 10);
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getLatestReportByPet<T extends { petId: number; checkupDate: string }>(petId: number, reports: T[]) {
  return [...reports]
    .filter((report) => report.petId === petId)
    .sort((left, right) => new Date(right.checkupDate).getTime() - new Date(left.checkupDate).getTime())[0];
}

export function summarizeContent(value: string, maxLength = 140) {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}
