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
  onSelect: (key: MyDodoMenuKey) => void;
}

export function MyDodoSidebarPanel({
  user,
  profileUrl,
  displayName,
  isLoading = false,
  activeKey,
  onSelect,
}: MyDodoSidebarPanelProps) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-6 shadow-sm">
      <MyDodoProfileCard user={user} profileUrl={profileUrl} displayName={displayName} isLoading={isLoading} />
      <MyDodoSidebar activeKey={activeKey} onSelect={onSelect} />
    </div>
  );
}
