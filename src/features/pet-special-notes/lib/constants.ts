import type { PetSpecialNoteType } from '@/features/auth';

export const PET_SPECIAL_NOTE_TYPE_OPTIONS: Array<{ value: PetSpecialNoteType; label: string }> = [
  { value: 'ALLERGY', label: '알레르기' },
  { value: 'HOSPITAL', label: '병원' },
  { value: 'MEDICATION', label: '약물' },
  { value: 'FOOD', label: '음식' },
  { value: 'BEHAVIOR', label: '행동' },
  { value: 'SYMPTOM', label: '증상' },
  { value: 'ETC', label: '기타' },
];

export function formatPetSpecialNoteTypeLabel(noteType: PetSpecialNoteType) {
  return PET_SPECIAL_NOTE_TYPE_OPTIONS.find((option) => option.value === noteType)?.label ?? noteType;
}
