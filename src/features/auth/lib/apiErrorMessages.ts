/** 소셜 로그인 POST /auth/social-login */
export const SOCIAL_LOGIN_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '잘못된 로그인 요청이에요. 다시 로그인해주세요.',
  401: '로그인 정보가 올바르지 않아요. 다시 시도해주세요.',
  403: '접근이 제한된 계정이에요.',
  404: '가입된 계정을 찾을 수 없어요.',
  429: '요청이 너무 많아요. 잠시 후 다시 시도해주세요.',
  500: '서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
};

/** 로그아웃 POST /auth/logout */
export const LOGOUT_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '잘못된 요청이에요. 잠시 후 다시 시도해주세요.',
  401: '인증 정보가 유효하지 않아요. 다시 로그인해주세요.',
  404: '로그인 정보를 찾을 수 없어요.',
  500: '로그아웃에 실패했어요. 잠시 후 다시 시도해주세요.',
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

/** 탈퇴 인증 메일 발송 POST /users/me/withdrawal/email */
export const WITHDRAWAL_EMAIL_STATUS_MESSAGES: Partial<Record<number, string>> = {
  401: '로그인이 필요한 기능이에요. 다시 로그인해주세요.',
  404: '사용자를 찾을 수 없어요.',
  429: '잠시 후 다시 시도해주세요. (1분 이내 재요청은 불가해요)',
  500: '인증 메일 발송에 실패했어요. 잠시 후 다시 시도해주세요.',
};

/** 최종 회원 탈퇴 DELETE /users/me */
export const WITHDRAW_USER_STATUS_MESSAGES: Partial<Record<number, string>> = {
  400: '인증번호를 다시 확인해주세요.',
  401: '인증번호가 올바르지 않거나 만료되었어요. 다시 시도해주세요.',
  404: '사용자를 찾을 수 없어요.',
  500: '회원 탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.',
};

/** 닉네임 중복 확인 GET /users/nickname/check */
export const NICKNAME_CHECK_STATUS_MESSAGES: Partial<Record<number, string>> = {
  500: '중복 확인에 실패했어요. 잠시 후 다시 시도해주세요.',
};
