import DoDoLogo from '@/shared/assets/images/Logo_light.svg?react';
import { useIsLoggedIn } from '@/widgets/header/model/useIsLoggedIn';

import { LoggedInHome } from './ui/LoggedInHome';

export function MainPage() {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn) {
    return <LoggedInHome />;
  }

  return <DoDoLogo width={200} height={100} className="mx-auto mt-10" />;
}
