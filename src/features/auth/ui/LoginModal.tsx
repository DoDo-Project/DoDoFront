import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';
import { Modal } from '@/shared/ui';

import type { SocialProvider } from '../model/types';
import { SocialLoginButton } from './SocialLoginButton';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSelectProvider?: (provider: SocialProvider) => void;
}

export function LoginModal({ open, onClose, onSelectProvider }: LoginModalProps) {
  return (
    <Modal open={open} onClose={onClose} ariaLabel="로그인">
      <div className="mb-6 text-center">
        <DoDoLogo className="mx-auto h-14 w-auto" />
        <p className="mt-4 text-[16px] font-regular select-none">건강, 안전, 즐거움을 하나로 묶다!</p>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <SocialLoginButton provider="NAVER" onClick={onSelectProvider} />
        <SocialLoginButton provider="GOOGLE" onClick={onSelectProvider} />
      </div>
    </Modal>
  );
}
