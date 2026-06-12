import { CommunityProfileCard } from './CommunityProfileCard';

interface CommunitySidebarPanelProps {
  profileUrl: string | null;
  nickname: string | null;
}

export function CommunitySidebarPanel({ profileUrl, nickname }: CommunitySidebarPanelProps) {
  return (
    <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
      <CommunityProfileCard profileUrl={profileUrl} nickname={nickname} />
    </div>
  );
}
