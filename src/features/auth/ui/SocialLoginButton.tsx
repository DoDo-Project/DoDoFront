import type { ComponentType, SVGProps } from 'react';

import type { SocialProvider } from '../model/types';
import GoogleIcon from '../assets/google.svg?react';
import NaverIcon from '../assets/naver.svg?react';

interface ProviderConfig {
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  iconClassName: string;
  buttonClassName: string;
}

const PROVIDER_CONFIG: Record<SocialProvider, ProviderConfig> = {
  NAVER: {
    label: '네이버로 시작하기',
    Icon: NaverIcon,
    iconClassName: 'h-3.5 w-3.5',
    buttonClassName: 'bg-[#03C75A] text-white transition-opacity hover:opacity-90',
  },
  GOOGLE: {
    label: 'Google로 시작하기',
    Icon: GoogleIcon,
    iconClassName: 'h-5 w-5',
    buttonClassName: 'border border-neutral-300 bg-white text-neutral-700 transition-colors hover:bg-neutral-50',
  },
};

interface SocialLoginButtonProps {
  provider: SocialProvider;
  onClick?: (provider: SocialProvider) => void;
}

export function SocialLoginButton({ provider, onClick }: SocialLoginButtonProps) {
  const { label, Icon, iconClassName, buttonClassName } = PROVIDER_CONFIG[provider];

  return (
    <button
      type="button"
      onClick={() => onClick?.(provider)}
      className={`flex h-12 w-full items-center justify-center gap-2 rounded-[10px] text-sm font-medium select-none cursor-pointer ${buttonClassName}`}
    >
      <Icon className={iconClassName} aria-hidden />
      {label}
    </button>
  );
}
