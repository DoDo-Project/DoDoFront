export type SocialProvider = 'NAVER' | 'GOOGLE';

// 로그인/가입 완료 시 백엔드가 내려주는 토큰 묶음
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
}

// ---- 토큰 재발급 (POST /auth/reissue) ----

export interface TokenReissueRequest {
  refreshToken: string;
}

export interface TokenReissueResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  /** OpenAPI 기준 초 단위 — setReissueTokens에서 ms로 정규화 */
  accessTokenExpiresIn: number;
}

// ---- 소셜 로그인 (POST /auth/social-login) ----

export interface SocialLoginRequest {
  provider: SocialProvider;
  code: string;
}

// 200: 기존 회원 로그인 성공
export interface SocialLoginSuccess extends AuthTokens {
  profileUrl: string;
}

// 202: 신규 사용자 → 추가 정보 입력 필요. registrationToken으로 가입을 이어감감
export interface SocialSignupRequired {
  // 소셜에서 가져온 값. STEP 6 추가 정보 입력 화면에서 안내용으로 활용 가능
  email: string;
  name: string;
  // 소셜 프로필 이미지 URL. 없으면 기본 플레이스홀더 표시
  profileUrl?: string;
  // 가입 완료(PUT /users/me/profile) 시 Authorization 헤더로 전달하는 임시 토큰
  registrationToken: string;
  // 임시 토큰 만료까지 남은 시간(ms)
  tokenExpiresIn: number;
}

// socialLogin 호출 결과. 응답 status(200/202)로 분기한 판별 유니온
export type SocialLoginResult =
  | { kind: 'LOGIN'; data: SocialLoginSuccess }
  | { kind: 'SIGNUP_REQUIRED'; data: SocialSignupRequired };

// ---- 추가 정보 입력 → 가입 완료 (PUT /users/me/profile) ----

export interface RegisterProfileRequest {
  hasFamily: boolean;
  nickname: string;
  // TODO(STEP 6): 지역 값이 enum이면 백엔드 명세에 맞춰 union 타입으로 교체
  region: string;
}

// 200: 계정 ACTIVE 전환 + 새 토큰 발급
export interface RegisterProfileResponse extends AuthTokens {
  profileUrl: string;
}

// ---- 닉네임 중복 확인 (GET /users/nickname/check) ----

export interface NicknameCheckResponse {
  message: string;
  nickname: string;
  duplicated: boolean;
}

// ---- 가족 초대 수락 신청 (POST /pets/family) ----

export interface PetFamilyJoinRequest {
  /** 영문 대문자 + 숫자 6자리 */
  code: string;
}

export interface PetFamilyJoinResponse {
  petId: number;
  message: string;
}

// ---- 알림 수신 여부 변경 (PATCH /users/me/setting/notification) ----

export interface NotificationUpdateRequest {
  notificationEnabled: boolean;
}

export interface NotificationUpdateResponse {
  message: string;
}

// ---- 내 정보 조회 (GET /users/me) ----

export interface UserProfile {
  message: string;
  email: string;
  name: string;
  nickname: string;
  region: string;
  hasFamily: boolean;
  profileUrl: string;
  notificationEnabled: boolean;
  userCreatedAt: string;
}
