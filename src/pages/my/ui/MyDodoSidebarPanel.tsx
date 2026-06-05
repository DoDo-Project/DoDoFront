import type { UserProfile } from '@/features/auth/model/types';
import type { MyDodoMenuKey } from '@/pages/my/model/menu';
import { MyDodoProfileCard } from '@/pages/my/ui/MyDodoProfileCard';
import { MyDodoSidebar } from '@/pages/my/ui/MyDodoSidebar';

interface MyDodoSidebarPanelProps {
  user: UserProfile | null;
  profileUrl: string | null;
  displayName: string;
  isLoading?: boolean;
  activeKey: MyDodoMenuKey;
}

export function MyDodoSidebarPanel({
  user,
  profileUrl,
  displayName,
  isLoading = false,
  activeKey,
}: MyDodoSidebarPanelProps) {
  return (
    <div className="h-full rounded-[26px] border border-white/80 bg-linear-to-b from-white to-neutral-50 px-5 py-6 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
      <MyDodoProfileCard user={user} profileUrl={profileUrl} displayName={displayName} isLoading={isLoading} />
      <MyDodoSidebar activeKey={activeKey} />
    </div>
  );
}
