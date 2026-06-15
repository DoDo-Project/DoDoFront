const SPECIES_LABEL: Record<string, string> = {
  CANINE: '강아지',
  FELINE: '고양이',
};

export function getMainPetSpecies(profile: { species?: string; spercies?: string }) {
  return profile.species ?? profile.spercies ?? '';
}

export function formatSpeciesLabel(species: string) {
  return SPECIES_LABEL[species] ?? species;
}

export function formatWeightLabel(weight: number) {
  if (!Number.isFinite(weight)) return '-';
  if (Number.isInteger(weight)) return `${weight} kg`;
  return `${weight.toFixed(1)} kg`;
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

export function getLatestReportByPet<T extends { petId: number; checkupDate: string }>(
  petId: number,
  reports: T[],
): T | undefined {
  let latest: T | undefined;
  let latestTime = -1;

  for (const report of reports) {
    if (report.petId !== petId) {
      continue;
    }

    const time = new Date(report.checkupDate).getTime();
    if (!Number.isNaN(time) && time > latestTime) {
      latestTime = time;
      latest = report;
    }
  }

  return latest;
}

export function summarizeContent(value: string, maxLength = 140) {
  const normalized = value.replace(/\s+/g, ' ').trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}...`;
}

interface ParsedHealthReportContent {
  recommendations?: unknown;
  content?: unknown;
  summary?: unknown;
  analysis?: unknown;
  message?: unknown;
}

export function extractHealthReportRecommendations(content: string): string[] {
  if (!content.trim()) return [];

  try {
    const parsed = JSON.parse(content) as ParsedHealthReportContent | null;
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.recommendations)) {
      return [];
    }

    return parsed.recommendations.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
  } catch {
    return [];
  }
}

export function extractHealthReportDisplayContent(content: string): string | null {
  if (!content.trim()) return null;

  try {
    const parsed = JSON.parse(content) as ParsedHealthReportContent | null;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    const candidates = [parsed.content, parsed.summary, parsed.analysis, parsed.message];
    const text = candidates.find((item): item is string => typeof item === 'string' && item.trim().length > 0);

    return text?.trim() ?? null;
  } catch {
    return content;
  }
}
