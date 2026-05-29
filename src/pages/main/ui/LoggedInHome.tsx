import { HealthReportSection } from './sections/HealthReportSection';
import { HotTopicSection } from './sections/HotTopicSection';
import { NoticeAndQuickLinksSection } from './sections/NoticeAndQuickLinksSection';

export function LoggedInHome() {
  return (
    <div className="flex w-full flex-col gap-4 pb-6 sm:gap-6">
      <HealthReportSection />
      <NoticeAndQuickLinksSection />
      <HotTopicSection />
    </div>
  );
}
