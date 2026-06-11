export const FAMILY_CODE_REGEX = /^[A-Z0-9]{6}$/;

export const INVITATION_CODE_STATUS_MESSAGES: Partial<Record<number, string>> = {
  401: '로그인이 필요해요. 다시 시도해 주세요.',
  403: '가족 초대 권한이 없는 반려동물이에요.',
  404: '대상 반려동물을 찾을 수 없어요.',
  409: '이미 유효한 초대 코드가 있어요.',
  500: '초대 코드 생성에 실패했어요. 잠시 후 다시 시도해 주세요.',
};

export const FAMILY_JOIN_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '가족 코드를 다시 확인해 주세요.',
  401: '로그인이 필요해요. 다시 시도해 주세요.',
  404: '만료되었거나 존재하지 않는 초대 코드예요.',
  409: '이미 가족으로 등록된 반려동물이에요.',
  500: '가족 신청에 실패했어요. 잠시 후 다시 시도해 주세요.',
};
