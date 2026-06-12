import { CommunityProfileCard } from './CommunityProfileCard';

interface CommunitySidebarPanelProps {
  profileUrl: string | null;
  nickname: string | null;
}

export function CommunitySidebarPanel({ profileUrl, nickname }: CommunitySidebarPanelProps) {
  return (
    <div className="rounded-[26px] border border-white/80 bg-linear-to-b from-white via-[#fffaf5] to-[#fff3e8] p-4 shadow-[0_18px_44px_rgba(15,23,42,0.08)] sm:p-5">
      <CommunityProfileCard profileUrl={profileUrl} nickname={nickname} />
    </div>
  );
}
