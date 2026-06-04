export const SPECIES_OPTIONS = [
  { value: 'CANINE', label: '강아지' },
  { value: 'FELINE', label: '고양이' },
] as const;

export const SEX_OPTIONS = [
  { value: 'MALE', label: '수컷' },
  { value: 'FEMALE', label: '암컷' },
  { value: 'NEUTER', label: '중성화' },
] as const;

export const CREATE_PET_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '입력한 반려동물 정보를 다시 확인해 주세요.',
  401: '로그인이 필요한 기능입니다. 다시 로그인해 주세요.',
  409: '이미 등록된 반려동물 정보이거나 디바이스가 사용 중일 수 있어요.',
  500: '반려동물 등록 중 서버 오류가 발생했습니다.',
};

export const MAX_PET_IMAGE_SIZE = 5 * 1024 * 1024;
