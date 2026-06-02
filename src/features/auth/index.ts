export { LoginModal } from './ui/LoginModal';
export { SocialLoginButton } from './ui/SocialLoginButton';
export { SignupFlow } from './ui/signup';
export { redirectToSocialLogin, getStoredState, clearStoredState, parseProvider } from './lib/oauth';
export {
  resolveApiAuthError,
  resolveAuthErrorFromMessage,
  resolveClientAuthError,
  resolveSessionExpiredError,
} from './lib/authErrorPresentation';
export type { AuthErrorPresentation, AuthClientErrorCode, AuthErrorContext } from './lib/authErrorPresentation';
export { AuthLoadingScreen } from './ui/status/AuthLoadingScreen';
export { AuthErrorScreen } from './ui/status/AuthErrorScreen';
export { socialLogin, registerProfile, checkNicknameAvailability, updateNotificationSetting } from './api/auth';
export { getMyProfile } from './api/users';
export { useCurrentUser } from './model/useCurrentUser';
export type {
  SocialProvider,
  AuthTokens,
  SocialLoginRequest,
  SocialLoginSuccess,
  SocialSignupRequired,
  SocialLoginResult,
  RegisterProfileRequest,
  RegisterProfileResponse,
  NicknameCheckResponse,
  NotificationUpdateRequest,
  NotificationUpdateResponse,
  TokenReissueRequest,
  TokenReissueResponse,
  UserProfile,
} from './model/types';
export { getApiErrorMessage, getErrorBodyMessage } from '@/shared/lib/api/errorMessage';
export {
  SOCIAL_LOGIN_STATUS_MESSAGES,
  REGISTER_PROFILE_STATUS_MESSAGES,
  NOTIFICATION_SETTING_STATUS_MESSAGES,
  NICKNAME_CHECK_STATUS_MESSAGES,
} from './lib/apiErrorMessages';
