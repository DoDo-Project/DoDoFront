/** 소셜 로그인 POST /auth/social-login */
export const SOCIAL_LOGIN_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '잘못된 로그인 요청이에요. 다시 로그인해주세요.',
  401: '로그인 정보가 올바르지 않아요. 다시 시도해주세요.',
  403: '접근이 제한된 계정이에요.',
  404: '가입된 계정을 찾을 수 없어요.',
  429: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

/** 회원가입 완료 PUT /users/me/profile */
export const REGISTER_PROFILE_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '입력 정보를 다시 확인해주세요.',
  401: '가입 세션이 만료되었어요. 처음부터 다시 로그인해주세요.',
  409: '이미 사용 중인 닉네임이에요.',
  500: '회원가입에 실패했어요. 잠시 후 다시 시도해주세요.',
};

/** 알림 설정 PATCH /users/me/setting/notification */
export const NOTIFICATION_SETTING_STATUS_MESSAGES: Partial<Record<number, string>> = {
  401: '로그인이 필요해요. 다시 로그인해주세요.',
  500: '알림 설정 변경에 실패했어요. 잠시 후 다시 시도해주세요.',
};

/** 내 정보 수정 PATCH /users/me */
export const PROFILE_UPDATE_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '입력한 회원정보를 다시 확인해주세요.',
  401: '로그인이 필요해요. 다시 로그인한 뒤 시도해주세요.',
  404: '사용자 정보를 찾을 수 없어요.',
  409: '이미 사용 중인 닉네임이에요.',
  500: '회원정보 수정에 실패했어요. 잠시 후 다시 시도해주세요.',
};

/** 닉네임 중복 확인 GET /users/nickname/check */
export const NICKNAME_CHECK_STATUS_MESSAGES: Partial<Record<number, string>> = {
  500: '중복 확인에 실패했어요. 잠시 후 다시 시도해주세요.',
};
